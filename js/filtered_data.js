// process.js basically stores the data in a datastructure more suited for searching by "tag" or some quality.

class AppliedFilter {
	constructor(label, filter) {
		this.label = label;
		this.filter = filter;
		this.sampleSize = 0;
		this.values = [];
	}
}

// Data class represents the ultimate schema.
class FilteredData {
	//
	// DATA STRUCTURE
	//
	constructor() {
		this.totalPatients = 0;
		this.totalPositive = 0;
		this.positivePatients = [];
		this.negativePatients = [];
		this.totalNegative = 0;
		this.mainDomain = [
			{ preFilter: new FilterMap("dyspnea", "==", "TRUE"), text: "Dyspnea", key: "dyspnea", positive: [], negative: [] },
			{ preFilter: new FilterMap("rhonci", "==", "TRUE"), text: "Rhonci", key: "rhonchi", positive: [], negative: [] },
			{ preFilter: new FilterMap("wheezes", "==", "TRUE"), text: "Wheezing", key: "wheezes", positive: [], negative: [] },
			{ preFilter: new FilterMap("cough", "==", "TRUE"), text: "Any Cough", key: "cough", positive: [], negative: [] },
			{ preFilter: new FilterMap("cough_severity", "==", "Mild"), text: "Mild Cough", key: "cough_mild", positive: [], negative: [] },
			{ preFilter: new FilterMap("cough_severity", "==", "Moderate"), text: "Moderate Cough", key: "cough_moderate", positive: [], negative: [] },
			{ preFilter: new FilterMap("cough_severity", "==", "Severe"), text: "Severe Cough", key: "cough_severe", positive: [], negative: [] },
			{ preFilter: new FilterMap("fever", "==", "TRUE"), text: "Fever", key: "fever", positive: [], negative: [] },
			{ preFilter: new FilterMap("sob", "==", "TRUE"), text: "Any SOB", key: "sob", positive: [], negative: [] },
			{ preFilter: new FilterMap("sob_severity", "==", "Mild"), text: "Mild SOB", key: "sob_mild", positive: [], negative: [] },
			{ preFilter: new FilterMap("sob_severity", "==", "Moderate"), text: "Moderate SOB", key: "sob_moderate", positive: [], negative: [] },
			{ preFilter: new FilterMap("sob_severity", "==", "Severe"), text: "Severe SOB", key: "sob_severe", positive:[], negative: [] },
			{ preFilter: new FilterMap("diarrhea", "==", "TRUE"), text: "Diarrhea", key: "diarrhea", positive: [], negative: [] },
			{ preFilter: new FilterMap("fatigue", "==", "TRUE"), text: "Fatigue", key: "fatigue", positive: [], negative: [] },
			{ preFilter: new FilterMap("headache", "==", "TRUE"), text: "Headache", key: "headache", positive: [], negative: [] },
			{ preFilter: new FilterMap("loss_of_smell", "==", "TRUE"), text: "Smell Loss", key: "loss_of_smell", positive: [], negative: [] },
			{ preFilter: new FilterMap("loss_of_taste", "==", "TRUE"), text: "Taste Loss", key: "loss_of_taste", positive: [], negative: [] },
			{ preFilter: new FilterMap("runny_nose", "==", "TRUE"), text: "Runny Nose", key: "runny_nose", positive: [], negative: [] },
			{ preFilter: new FilterMap("muscle_sore", "==", "TRUE"), text: "Sore Musc.", key: "muscle_sore", positive: [], negative: [] },
			{ preFilter: new FilterMap("sore_throat", "==", "TRUE"), text: "Sore Throat", key: "sore_throat", positive: [], negative: [] },
			{ preFilter: new FilterMap("cxr_impression", "!=", ""), text: "Img. Indicatation", key: "cxr_impression", positive: [], negative: [] }
		];

		// Or read from the URL
		this.appliedFilterList = [
			new AppliedFilter("COVID+", new Filter(true, false, [], 0)),
			new AppliedFilter("COVID-", new Filter(false, true, [new FilterMap("age", ">", 45)]))
		];
		// Warning: Very dependent on arrays within AppliedFilters	(this.AppliedFilter.values) being same order as this.mainDomain
	}
	// pushAppliedFilter adds a filter to the appliedFilterList
	pushAppliedFilter(appliedFilter) {
		this.appliedFilterList.push(appliedFilter);
	}

	// addSourceData will take a source data and add it to the datastructure.
	addSourceData(sourceData) {
		var newPositive = sourceData.data.filter(datum => datum.covid19_test_results === "Positive")
		var newNegative = sourceData.data.filter(datum => datum.covid19_test_results === "Negative")
		this.positivePatients = this.positivePatients.concat(newPositive);
		this.negativePatients = this.negativePatients.concat(newNegative);
		this.totalPositive = this.positivePatients.length;	
		this.totalNegative = this.negativePatients.length;	
		this.totalPatients = this.totalPositive + this.totalNegative;
		this.mainDomain.forEach( (element) => {
			var filter = new Filter(false, false, [ element.preFilter ]);
			element.positive = element.positive.concat(newPositive.filter(datum => filter.filterFunc(datum)) );
			element.negative = element.negative.concat(newNegative.filter(datum => filter.filterFunc(datum)) );
		});
}

	// prepareFilteredData will use filterFunc on each row of mainDomain and populate the values member of the filter
	// TODO maybe add a hash to see if it's changed. Probably a filter object method.
	// TODO maybe be able to do one at a time line 58
	prepareFilteredData() {
		this.appliedFilterList.forEach( (appliedFilter, i) => {
			appliedFilter.filter.values = [];
			appliedFilter.sampleSize = 0;
			if (appliedFilter.filter.positive) {
				appliedFilter.sampleSize += this.positivePatients.filter(datum => appliedFilter.filter.filterFunc(datum)).length
			}
			if (appliedFilter.filter.negative) {
				appliedFilter.sampleSize += this.negativePatients.filter(datum => appliedFilter.filter.filterFunc(datum)).length
			}
			this.mainDomain.forEach((row, i) => {
				var value = 0;
				if (appliedFilter.filter.positive) {
					value += row.positive.filter(datum => appliedFilter.filter.filterFunc(datum)).length
				}
				if (appliedFilter.filter.negative) {
					value += row.negative.filter(datum => appliedFilter.filter.filterFunc(datum)).length
				}
				appliedFilter.values.push(value);
			});
		});
	}

	//
	// VISUALIZATION GRAPHICS
	//


	// removeMajorRow manually removes an entire category. While _technically_ we're removing data, which you'd use D3.remove() for, we're more accurately removing an entire visualization.
	// This is called by removeFilter in the UI section below
	removeFilterRow(filterID) {
		document.querySelectorAll("." + filterID + "-row").forEach( (el) => { 
			return el.remove();
		});
		// TODO: what's the best way to fix colors now? rerendering doesn't work- yet. if axis was data, maybe.
		// TODO: probably just edit function above to get siblings and redo the two color calculations as in render
		// TODO: remove filter colorIndex
	}

	// renderBarGraph is going to apply a filter to the data and create a new key-value pair where the value is an array of key value pairs
	renderBarGraph() {
		if (this.totalPatients == 0) {
			iflog("renderBarGraph(): exiting as length of data is 0");
			return;
		}
		this.appliedFilterList.forEach( (appliedFilter, i) => {
			var chart = d3.select('#bar-chart').selectAll('.data-container');
			chart.data(this.mainDomain);
			chart = chart.selectAll('div .' + appliedFilter.filter.ID + "-row"); 
			// TODO not sure what d is going to be here or what's going on in the key argument/function
			chart = chart.data((d, i) => { 
				return [ appliedFilter.values[i] ]; 
			}, (d) => { 
				return appliedFilter.filter.ID; // NOTE: d3 is okay w/ multiple groups having same keys, as long as same group has different keys
			});
			iflog("Filter: ");
			iflog(appliedFilter);
			iflog("Enter: ");
			iflog(chart.enter());
			iflog("Update: ");
			iflog(chart);
			iflog("Exit: ");
			iflog(chart.exit());
			chart = chart.enter();
			var label = chart.append('div');
			label = label.attr("class", "filter-label " + appliedFilter.filter.ID + "-row");
			label = label.style("color", d3.schemeSet1[i % 9]);
			label = label.text(d => { return appliedFilter.label })
			var bar = chart.append('div');
			bar = bar.style("background-color", d3.schemeSet1[i % 9]);
			bar = bar.attr("class", "bar " + appliedFilter.filter.ID +"-row");
			bar = bar.style('width', d => {
					return (100 * (d) / appliedFilter.sampleSize) + "%";
				});
			bar = bar.text(d => { 
				return Math.round(10000 * (d) / appliedFilter.sampleSize)/100 + "%" 
			} );
		});
	}

	// writeMajorColumns creates a basic graph and legend. It would be nice to use D3's axes methods here, but they rely on SVG and given design constrains, div's make more sense.
	writeMajorColumns() {
		// NOTE: this is not using D3's API! Vanilla javascript!
		var canvas = document.getElementById("bar-chart");
		this.mainDomain.forEach( (labelObject, i) => {
			var ifodd = "";
			if ( (i % 2) == 1 ) {
				ifodd= " odd";
			} 
			var label = labelObject.text;
			var majorColumn = canvas.appendChild(document.createElement("div"));
			majorColumn.className = "major-col-label" + ifodd;
			majorColumn.innerHTML = label;
			var dataContainer = canvas.appendChild(document.createElement("div"));
			dataContainer.className = "data-container" + ifodd;
			dataContainer.setAttribute("id", label + "-container");
		});
	}


	//
	// USER INTERFACE (UI)
	// 

	// populateFilterList populates the filter list API
	populateFilterList() {
		var filterListContainer = document.getElementById("filter-list");
		while (filterListContainer.firstChild) {
			filterListContainer.removeChild(filterListContainer.lastChild);
		}
		this.appliedFilterList.forEach( (el) => {
			let newOption = document.createElement("option");
			newOption.textContent = el.label;
			filterListContainer.appendChild(newOption)
		});
	}

	// removeFilter will remove a filter from the appliedFilterList and rerender
	removeFilter(filterLabel) {
		var targetFilterId;
		this.appliedFilterList = this.appliedFilterList.filter( (el) => { 
			if (el.label != filterLabel) {	
				return true;
			}
			targetFilterId = el.filter.ID;
		});
		return targetFilterId;
	}

	// genFilter reads the filter form and returns an applied filter
	genFilter() {
		var filterMaps = [];
		var label = document.getElementById("label").value;
		if (label == "") {
			alert("please create a label");
			return false;
		}
		var minAge = document.getElementById("min-age").value;
		var ageString = "";
		if (minAge === "") {
			minAge = 0;
		}
		if (minAge != 0) {
			filterMaps.push(new FilterMap("age", ">=", minAge));
		}
		var maxAge = document.getElementById("max-age").value;
		if (maxAge === "") {
			maxAge = 120;
		}
		if (maxAge < 120) {
			filterMaps.push(new FilterMap("age", "<=", maxAge));
		}
		var comorbidityList = document.getElementById("comorbidity_options").querySelectorAll('input[type=checkbox]:checked');
		var symptomList = document.getElementById("symptom_options").querySelectorAll('input[type=checkbox]:checked');
		function wf(el) {
			filterMaps.push(new FilterMap(el.getAttribute("id"), el.getAttribute("data-filter_op"), el.getAttribute("data-filter_val")));
		}
		comorbidityList.forEach(wf);
		symptomList.forEach(wf);
		return new AppliedFilter(label, new Filter(true, false, filterMaps)); // TODO: add covid+- to form
		
	}
	//
	// Link DS+GRAPH+UI Flows
	// 

	// userAddFilter is called when user clicks "add"
	userAddFilter() {
		var newAppliedFilter = this.genFilter()
		this.pushAppliedFilter(newAppliedFilter);
		this.prepareFilteredData(); 
		this.renderBarGraph();
		this.populateFilterList();
	}

	// userRemoveFilter is called when user clicks "delete"
	userRemoveFilter(target) {
		var targetID = this.removeFilter(target);
		this.populateFilterList();
		this.removeFilterRow(targetID);
	}
	initialize() {
		this.writeMajorColumns(); 
		this.prepareFilteredData();
		this.renderBarGraph();
		this.populateFilterList();

	}
}


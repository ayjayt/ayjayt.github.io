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
		this.appliedFilterList = [];
		this.mainDomain = [
			{ preFilter: new FilterMap("dyspnea", "==", "TRUE"), text: "Dyspnea", positive: [], negative: [] },
			{ preFilter: new FilterMap("rhonci", "==", "TRUE"), text: "Rhonchi", positive: [], negative: [] },
			{ preFilter: new FilterMap("wheezes", "==", "TRUE"), text: "Wheezing", positive: [], negative: [] },
			{ preFilter: new FilterMap("cough", "==", "TRUE"), text: "Any Cough", positive: [], negative: [] },
			{ preFilter: new FilterMap("cough_severity", "==", "Mild"), text: "Mild Cough", positive: [], negative: [] },
			{ preFilter: new FilterMap("cough_severity", "==", "Moderate"), text: "Moderate Cough", positive: [], negative: [] },
			{ preFilter: new FilterMap("cough_severity", "==", "Severe"), text: "Severe Cough", positive: [], negative: [] },
			{ preFilter: new FilterMap("fever", "==", "TRUE"), text: "Fever", positive: [], negative: [] },
			{ preFilter: new FilterMap("sob", "==", "TRUE"), text: "Any SOB", positive: [], negative: [] },
			{ preFilter: new FilterMap("sob_severity", "==", "Mild"), text: "Mild SOB", positive: [], negative: [] },
			{ preFilter: new FilterMap("sob_severity", "==", "Moderate"), text: "Moderate SOB", positive: [], negative: [] },
			{ preFilter: new FilterMap("sob_severity", "==", "Severe"), text: "Severe SOB", positive:[], negative: [] },
			{ preFilter: new FilterMap("diarrhea", "==", "TRUE"), text: "Diarrhea", positive: [], negative: [] },
			{ preFilter: new FilterMap("fatigue", "==", "TRUE"), text: "Fatigue", positive: [], negative: [] },
			{ preFilter: new FilterMap("headache", "==", "TRUE"), text: "Headache", positive: [], negative: [] },
			{ preFilter: new FilterMap("loss_of_smell", "==", "TRUE"), text: "Smell Loss", positive: [], negative: [] },
			{ preFilter: new FilterMap("loss_of_taste", "==", "TRUE"), text: "Taste Loss", positive: [], negative: [] },
			{ preFilter: new FilterMap("runny_nose", "==", "TRUE"), text: "Runny Nose", positive: [], negative: [] },
			{ preFilter: new FilterMap("muscle_sore", "==", "TRUE"), text: "Sore Musc.", positive: [], negative: [] },
			{ preFilter: new FilterMap("sore_throat", "==", "TRUE"), text: "Sore Throat", positive: [], negative: [] },
			{ preFilter: new FilterMap("cxr_impression", "!=", ""), text: "Img. Indicatation", positive: [], negative: [] }
		];

		var urlParams = new URLSearchParams(window.location.search);
		var compressedFilters = urlParams.get("filters");
		var uncompressedFilters;
		var builtObject = null;
		if ((compressedFilters != null) && (compressedFilters.length > 0)) {
			try {
				uncompressedFilters = LZString.decompressFromEncodedURIComponent(compressedFilters);
				builtObject = JSON.parse(uncompressedFilters);
			} catch (err) {
				builtObject = null;
			}
		}
		if (builtObject != null) {
			try {
				builtObject.forEach( (el) => {
					var filterMaps = [];
					el.filter.filterMaps.forEach( (filterMapEl) => {
						filterMaps.push(new FilterMap(filterMapEl.key, filterMapEl.op, filterMapEl.val));
					});
					var newFilter = new Filter(el.filter.positive, el.filter.negative, filterMaps);
					this.appliedFilterList.push(new AppliedFilter(el.label, newFilter));
				});
			} catch (err) {
				builtObject = null;
			}
		}
		if (builtObject == null) {
			this.appliedFilterList = [
				new AppliedFilter("COVID+", new Filter(true, false, [])),
				new AppliedFilter("COVID-", new Filter(false, true, []))
			];
		}
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
		document.querySelectorAll(".data-container").forEach( (el) => {
			el.querySelectorAll(".filter-label").forEach( (el, i) => {
				el.style.color = d3.schemeSet1[i % 9];
			});
			el.querySelectorAll(".bar").forEach( (el, i) => {
				el.style.backgroundColor = d3.schemeSet1[i % 9];
			});
		});
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
					if (appliedFilter.sampleSize == 0) return 0%;
					return (100 * (d) / appliedFilter.sampleSize) + "%";
				});
			bar = bar.text(d => {
				if (appliedFilter.sampleSize == 0) return "(n = 0)";
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
			var labelID = "";
			for (var i = 0; i < labelObject.text.length; i++) {
				let temp = (labelObject.text.charCodeAt(i)-30).toString();
				if (temp.length == 1) temp = "0" + temp;
				labelID += temp;
			}
			// NOTE: ^^ i hate escaping it like this but this ID will pass through multiple APIs
			// ...each with slightly different requirements for escaping symbols so no built in 
			// ...escape, hash, or encoding will satisfy all of them
			var collapser = canvas.appendChild(document.createElement("div"));
			collapser.textContent = "+";
			collapser.className = "collapser";
			collapser.setAttribute("data-target", labelID+"-container");
			collapser.addEventListener("click", (ev) => {
				var target = document.getElementById(ev.currentTarget.getAttribute("data-target"));
				if (target.style.height == "0px") {
					target.style.height = "";
					ev.currentTarget.nextSibling.style.fontSize = "";
					ev.currentTarget.nextSibling.style.width = "";
					ev.currentTarget.textContent = "+";
				} else {
					target.style.height = "0px";
					target.style.overflow = "hidden";
					ev.currentTarget.nextSibling.style.fontSize = "12px";
					ev.currentTarget.nextSibling.style.width = "0";
					ev.currentTarget.textContent = "-";
				}
			})
			var majorColumn = canvas.appendChild(document.createElement("div"));
			majorColumn.className = "major-col-label" + ifodd;
			majorColumn.innerHTML = label;
			var dataContainer = canvas.appendChild(document.createElement("div"));
			dataContainer.className = "data-container" + ifodd;
			dataContainer.setAttribute("id", labelID + "-container");
		});
	}


	//
	// USER INTERFACE (UI)
	// 

	// assignClickEventsFilterList makes the filter list selectable
	assignClickEventsFilterList() {
		// NOTE: we don't have to worry about redudandtly adding listeners because
		// the list is destroyed each time an element is added
		document.querySelectorAll(".filter-list-option").forEach( (el) => {
			el.addEventListener("click", (ev) => {
				document.querySelectorAll(".filter-list-option.active").forEach( (el) => {
					el.className = "filter-list-option";
				});
				ev.currentTarget.className += " active";
			});
		});
	}

	// populateFilterList populates the filter list API
	populateFilterList() {
		var filterListContainer = document.getElementById("filter-list");
		while (filterListContainer.firstChild) {
			filterListContainer.removeChild(filterListContainer.lastChild);
		}
		this.appliedFilterList.forEach( (el) => {
			let newOption = document.createElement("div");
			newOption.className = "filter-list-option";
			newOption.textContent = el.label + " (n = "+el.sampleSize+")";
			newOption.setAttribute("data-id", el.filter.ID);
			filterListContainer.appendChild(newOption)
		});
		this.assignClickEventsFilterList();
	}

	// removeFilter will remove a filter from the appliedFilterList and rerender
	removeFilter(targetID) {
		this.appliedFilterList = this.appliedFilterList.filter( (el) => { 
			if (el.filter.ID != targetID) {	
				return true;
			}
		});
	}

	// genFilter reads the filter form and returns an applied filter
	genFilter() {
		var filterMaps = [];
		var label = document.getElementById("label").value;
		if (label == "") {
			alert("please create a label");
			return false;
		}
		var positive = false;
		var negative = false;
		if (document.getElementById("covidp").checked) {
			positive = true;
		} else if (document.getElementById("covidn").checked) {
			negative = true;
		} else {
			positive = true;
			negative = true;
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
		return new AppliedFilter(label, new Filter(positive, negative, filterMaps)); // TODO: add covid+- to form
		
	}
	//
	// Link DS+GRAPH+UI Flows
	// 

	// userAddFilter is called when user clicks "add"
	userAddFilter() {
		var newAppliedFilter = this.genFilter()
		if (newAppliedFilter == false) return false;
		this.pushAppliedFilter(newAppliedFilter);
		this.prepareFilteredData(); 
		this.renderBarGraph();
		this.populateFilterList();
	}

	// userRemoveFilter is called when user clicks "delete"
	userRemoveFilter(target) {
		this.removeFilter(target);
		if (target == "") return;
		this.populateFilterList();
		this.removeFilterRow(target);
	}
	initialize() {
		this.writeMajorColumns(); 
		this.prepareFilteredData();
		this.renderBarGraph();
		this.populateFilterList();

	}
}


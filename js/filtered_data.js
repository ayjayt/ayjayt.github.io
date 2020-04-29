// process.js basically stores the data in a datastructure more suited for searching by "tag" or some quality.

class FilterRow {
	constructor(filter) {
		this.filter = filter;
	}
}

// Data class represents the ultimate schema.
class FilteredData {
	constructor() {
		// Here are our first filters
		// This is basically a two node tree, the start of trie or something.
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
			var filter = new Filter("", false, false, [ element.preFilter ], 0);
			element.positive = element.positive.concat(newPositive.filter(datum => filter.filterFunc(datum)) );
			element.negative = element.negative.concat(newNegative.filter(datum => filter.filterFunc(datum)) );
		});
}

	// prepareFilteredData will use filterFunc on each row of mainDomain and populate the values member of the filter
	// TODO maybe add a hash to see if it's changed. Probably a filter object method.
	prepareFilteredData(filters) {
		if (!Array.isArray(filters)) {
			filters = [ filters ];
		}
		filters.forEach( (filter, i) => {
			// STATE 8: use filters to calculate bar graph values
			filter.values = [];
			filter.sampleSize = 0;
			if (filter.positive) {
				filter.sampleSize += this.positivePatients.filter(datum => filter.filterFunc(datum)).length
			}
			if (filter.negative) {
				filter.sampleSize += this.negativePatients.filter(datum => filter.filterFunc(datum)).length
			}
			this.mainDomain.forEach((row, i) => {
				var value = 0;
				if (filter.positive) {
					value += row.positive.filter(datum => filter.filterFunc(datum)).length
				}
				if (filter.negative) {
					value += row.negative.filter(datum => filter.filterFunc(datum)).length
				}
				// TODO Not sure if this structure really needs "row":row.key
				filter.values.push({"row":row.key, "value": value });
			});
		});
	}
	// removeMajorRow manually removes an entire category. While _technically_ we're removing data, which you'd use D3.remove() for, we're more accurately removing an entire visualization.
	removeFilterRow(filterID) {
		document.querySelectorAll("." + filterID + "-row").forEach( (el) => { 
			return el.remove();
		});
		// TODO: what's the best way to fix colors now? rerendering doesn't work- yet. if axis was data, maybe.
		// TODO: probably just edit function above to get siblings and redo the two color calculations as in render
		// TODO: remove filter colorIndex
	}

	// renderBarGraph is going to apply a filter to the data and create a new key-value pair where the value is an array of key value pairs
	renderBarGraph(filters) {
		if (this.totalPatients == 0) {
			iflog("renderBarGraph(): exiting as length of data is 0");
			return;
		}
		if (!Array.isArray(filters)) {
			filters = [ filters ];
		}
		filters.forEach( (filter, i) => {
			var chart = d3.select('#bar-chart').selectAll('.data-container');
			chart = chart.selectAll('div .' + filter.ID + "-row"); 
			// TODO not sure what d is going to be here or what's going on in the key argument/function
			chart = chart.data((d, i) => { return [ filter.values[i] ]; }, (d) => { return d.row + "_" + filter.ID; } );
			iflog("Filter: ");
			iflog(filter);
			iflog("Enter: ");
			iflog(chart.enter());
			iflog("Update: ");
			iflog(chart);
			iflog("Exit: ");
			iflog(chart.exit());
			chart = chart.enter();
			var label = chart.append('div');
			label = label.attr("class", "filter-label " + filter.ID + "-row");
			label = label.style("color", d3.schemeSet1[filter.colorIndex % 9]);
			label = label.text(d => { return filter.label })
			var bar = chart.append('div');
			bar = bar.style("background-color", d3.schemeSet1[filter.colorIndex % 9]);
			bar = bar.attr("class", "bar " + filter.ID +"-row");
			bar = bar.style('width', d => {
					return (100 * (d.value) / filter.sampleSize) + "%";
				});
			bar = bar.text(d => { return Math.round(10000 * (d.value) / filter.sampleSize)/100 + "%" } );
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
}


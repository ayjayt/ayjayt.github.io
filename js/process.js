// process.js detects csv type and converts the csv to a unified data format.
// the unified data format is like a protocol buffer in that the schema can only grow.
// This should be split into two objects, maybe... one is a data processor: Process. The other is a graph object, columns, but we're going to ignore that for now.

// Checking column patterns is how we're determing schema right now
const CSVVersion0Columns = JSON.stringify(["clinic_state", "test_name", "covid19_test_results", "age", "high_risk_exposure_occupation", "high_risk_interactions", "diabetes", "chd", "htn", "cancer", "asthma", "copd", "autoimmune_dis", "temperature", "pulse", "sys", "dia", "rr", "o2sat", "rapid_flu", "rapid_flu_result", "rapid_strep", "rapid_strep_result", "ctab", "dyspnea", "rhonchi", "wheezes", "cough", "cough_severity", "fever", "sob", "sob_severity", "diarrhea", "fatigue", "headache", "loss_of_smell", "loss_of_taste", "runny_nose", "muscle_sore", "sore_throat", "cxr_findings", "cxr_impression", "cxr_link"])

// sampleFilterFunc is an example filter func, to be used as a mock for the renderor. these will be generated dynamically.
var sampleFiltered = [ { label: "All", filterFunc: (element) => { return element; }, filterMap: {}, values:[] } ]

// Data class represents the ultimate schema.
class Data {
	constructor() {
		// These are the dependent variables, basically. A lot of redundancy here.
		this.totalPatients = 0;
		this.rootData = [
			{ key: "dyspnea", data: [] },
			{ key: "rhonchi", data: [] },
			{ key: "wheezes", data: [] },
			{ key: "cough", data: [] },
			{ key: "cough_mild", data: [] },
			{ key: "cough_moderate", data: [] },
			{ key: "cough_severe", data: [] },
			{ key: "fever", data: [] },
			{ key: "sob", data: [] },
			{ key: "sob_mild", data: [] },
			{ key: "sob_moderate", data: [] },
			{ key: "sob_severe", data:[] },
			{ key: "diarrhea", data: [] },
			{ key: "fatigue", data: [] },
			{ key: "headache", data: [] },
			{ key: "loss_of_smell", data: [] },
			{ key: "loss_of_taste", data: [] },
			{ key: "runny_nose", data: [] },
			{ key: "muscle_sore", data: [] },
			{ key: "sore_throat", data: [] },
			{ key: "cxr_impression", data: [] }
		]
	}


	// readCSV should detect a csv type and call the appropriate process function. 
	readCSV(raw) {
		iflog("detectAndProcess(): processing");
		try {
			var proprietaryObject = d3.csvParse(raw);
			// STATE 3: detect schema of CSV object and add to columns
			if ( JSON.stringify(proprietaryObject.columns) === CSVVersion0Columns ) {
				this.processCSVVersion0(proprietaryObject)
			}
			iflog("Data.readCSV(): data processed")
		} catch (err) {
			iflog("Data.readCSV: data not processed: " + err)
			// STATE: Error, the data couldn't be processed or wasn't detected correctly
			// TODO: Want to know what address there was an error for, so the raw data string should probably be an object
		}
	}
	
	// processCSVVersion0 will convert the 4-6-20 CarbonHealth/Braid format to a uniform dataformat. Don't really think it matters if they're part of the class.
	// this is supposed to be conforming data
	processCSVVersion0(raw) {
		var positive = raw.filter(datum => datum.covid19_test_results === "Positive")
		this.totalPatients += positive.length;
		// Would love to find a way to shorten this. TODO
		// What we're doing is detecting which row we want and then employing a filter based on that colum.
		// Could totally use the filter generator for this somehow.
		// TODO furthermore we're overwriting data
		// TODO we should just be adding data and then adjusting it.
		// We are not transforming the rows though.
		// We will have to manually translate all "keys" ie column names
		// And then the filters here... are pretty basic
		// only_dyspnea = 
		// only)rhonci =
		// the rootData themselves should contain the "master filter"
		this.rootData.forEach( (element, i) => {
			if (element.key === "dyspnea") {
				this.rootData[i].data = positive.filter(datum => datum.dyspnea === "TRUE");
			}
			else if (element.key === "rhonchi") {
				this.rootData[i].data = positive.filter(datum => datum.rhonchi === "TRUE");
			}
			else if (element.key === "wheezes") {
				this.rootData[i].data = positive.filter(datum => datum.wheezes === "TRUE");
			}
			else if (element.key === "cough") {
				this.rootData[i].data = positive.filter(datum => datum.cough === "TRUE");
			}
			else if (element.key === "cough_mild") {
				this.rootData[i].data = positive.filter(datum => datum.cough_severity === "Mild");
			}
			else if (element.key === "cough_moderate") {
				this.rootData[i].data = positive.filter(datum => datum.cough_severity === "Moderate");
			}
			else if (element.key === "cough_severe") {
				this.rootData[i].data = positive.filter(datum => datum.cough_severity === "Severe");
			}
			else if (element.key === "fever") {
				this.rootData[i].data = positive.filter(datum => datum.fever === "TRUE") ;
			}
			else if (element.key === "sob") {
				this.rootData[i].data = positive.filter(datum => datum.sob === "TRUE");
			}
			else if (element.key === "sob_mild") {
				this.rootData[i].data = positive.filter(datum => datum.sob_severity === "Mild");
			}
			else if (element.key === "sob_moderate") {
				this.rootData[i].data = positive.filter(datum => datum.sob_severity === "Moderate");
			}
			else if (element.key === "sob_severe") {
				this.rootData[i].data = positive.filter(datum => datum.sob_severity === "Severe");
			}
			else if (element.key === "diarrhea") {
				this.rootData[i].data = positive.filter(datum => datum.diarrhea === "TRUE");
			}
			else if (element.key === "fatigue") {
				this.rootData[i].data = positive.filter(datum => datum.fatigue === "TRUE");
			}
			else if (element.key === "headache") {
				this.rootData[i].data = positive.filter(datum => datum.headache === "TRUE");
			}
			else if (element.key === "loss_of_smell") {
				this.rootData[i].data = positive.filter(datum => datum.loss_of_smell === "TRUE");
			}
			else if (element.key === "loss_of_taste") {
				this.rootData[i].data = positive.filter(datum => datum.loss_of_taste === "TRUE");
			}
			else if (element.key === "runny_nose") {
				this.rootData[i].data = positive.filter(datum => datum.runny_nose === "TRUE");
			}
			else if (element.key === "muscle_sore") {
				this.rootData[i].data = positive.filter(datum => datum.muscle_sore === "TRUE");
			}
			else if (element.key === "sore_throat") {
				this.rootData[i].data = positive.filter(datum => datum.sore_throat === "TRUE");
			}
			else if (element.key === "cxr_impression") {
				this.rootData[i].data = positive.filter(datum => datum.cxr_impression != "");
			}
		});
		
		iflog("processCSVversion0(): begin processing")
		return 
	}


	// filterMapToFunc(). probably a filter object method.
	
	// prepareFilteredData will use filterFunc on each row of rootData and populate the values member of the filter
	// TODO maybe add a hash to see if it's changed. Probably a filter object method.
	prepareFilteredData(filter) {
		filter.values = [];
		this.rootData.forEach((row, i) => {
			filter.values.push({"row":row.key, "value": row.data.filter(filter.filterFunc).length });
		});
	}
	
	// writeBarGraph is going to apply a filter to the data and create a new key-value pair where the value is an array of key value pairs
	writeBarGraph(filters) {
		if (!Array.isArray(filters)) {
			filters = [ filters ];
		}
		filters.forEach( filter => {
			this.prepareFilteredData(filter); // TODO: this probably wont happen here if we're rerendering EVERYTHING

			// TODO/BUG: maybe have to write in the grid/div structure with vanilla javascript and then attach the data and modify the attribute	
			var chart = d3.select('#bar-chart').selectAll('.data-container');
			chart = chart.data(filter.values); // A key function didn't work here but did work for the leaf nodes (the second .data())
			chart = chart.selectAll('div'); 
			chart = chart.data( (d, i) => { return [ d ]; }, d => {
				return d.row + "_" + filter.label;
			}); 
			// Note Since selectAll.selectAll returns a nested selection,
			// D3 expects a [ [] ] to beind (and bound in layers).  Values is [ {} ], but above we wrap the {} in [].
			// selectAll.select produced an entirely flat structure such that nodes were appended as siblings to selectAll.
			chart = chart.enter();
			var row = chart.append('div');
			row = row.attr("class", "filter-container");
			var label = row.append('div');
			label = label.attr("class", "filter-label");
			label = label.text(filter.label);
			var bar = row.append('div');
			bar = bar.attr("class", "bar");
			bar = row.style('width', d => {
					return (100 * d.value / this.totalPatients) + "%";
				});
		});
	}

	// writeMajorColumns creates a basic graph and legend. It would be nice to use D3's axes methods here, but they rely on SVG and given design constrains, div's make more sense.
	writeMajorColumns() {
		// NOTE: this is not using D3's API! Vanilla javascript!
		var canvas = document.getElementById("bar-chart");
		this.rootData.forEach( labelObject => {
			var label = labelObject.key;
			var majorColumn = canvas.appendChild(document.createElement("div"));
			majorColumn.className = "major-col-label";
			majorColumn.innerHTML = label;
			var dataContainer = canvas.appendChild(document.createElement("div"));
			dataContainer.className = "data-container";
			dataContainer.setAttribute("id", label + "-container");
		});
	}
}


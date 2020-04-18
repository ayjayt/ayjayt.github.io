// process.js declares a data object which is responsible for:
// A) detecting CSV schema and conforming it to the data object
// B) Applying filters to the data object
// C) Rendering the data object
// Factoring out the graph visual geometry from data is hard because of the Data.mainDomain.
// Checking column patterns is how we're determing schema right now
const CSVVersion0Columns = JSON.stringify(["clinic_state", "test_name", "covid19_test_results", "age", "high_risk_exposure_occupation", "high_risk_interactions", "diabetes", "chd", "htn", "cancer", "asthma", "copd", "autoimmune_dis", "temperature", "pulse", "sys", "dia", "rr", "o2sat", "rapid_flu", "rapid_flu_result", "rapid_strep", "rapid_strep_result", "ctab", "dyspnea", "rhonchi", "wheezes", "cough", "cough_severity", "fever", "sob", "sob_severity", "diarrhea", "fatigue", "headache", "loss_of_smell", "loss_of_taste", "runny_nose", "muscle_sore", "sore_throat", "cxr_findings", "cxr_impression", "cxr_link"])

const CSVVersion04072020Columns = JSON.stringify(["date_published", "clinic_state", "test_name", "swab_type", "covid_19_test_results", "age", "high_risk_exposure_occupation", "high_risk_interactions", "diabetes", "chd", "htn", "cancer", "asthma", "copd", "autoimmune_dis", "temperature", "pulse", "sys", "dia", "rr", "sats", "rapid_flu", "rapid_flu_results", "rapid_strep", "rapid_strep_results", "ctab", "labored_respiration", "rhonchi", "wheezes", "cough", "cough_severity", "fever", "sob", "sob_severity", "diarrhea", "fatigue", "headache", "loss_of_smell", "loss_of_taste", "runny_nose", "muscle_sore", "sore_throat", "cxr_findings", "cxr_impression", "cxr_link"]);

// Data class represents the ultimate schema.
class Data {
	constructor() {
		// These are the dependent variables, basically. A lot of redundancy here.
		this.totalPatients = 0;
		this.mainDomain = [
			{ text: "Dyspnea", key: "dyspnea", data: [] },
			{ text: "Rhonci", key: "rhonchi", data: [] },
			{ text: "Wheezing", key: "wheezes", data: [] },
			{ text: "Any Cough", key: "cough", data: [] },
			{ text: "Mild Cough", key: "cough_mild", data: [] },
			{ text: "Moderate Cough", key: "cough_moderate", data: [] },
			{ text: "Severe Cough", key: "cough_severe", data: [] },
			{ text: "Fever", key: "fever", data: [] },
			{ text: "Any SOB", key: "sob", data: [] },
			{ text: "Mild SOB", key: "sob_mild", data: [] },
			{ text: "Moderate SOB", key: "sob_moderate", data: [] },
			{ text: "Severe SOB", key: "sob_severe", data:[] },
			{ text: "Diarrhea", key: "diarrhea", data: [] },
			{ text: "Fatigue", key: "fatigue", data: [] },
			{ text: "Headache", key: "headache", data: [] },
			{ text: "Smell Loss", key: "loss_of_smell", data: [] },
			{ text: "Taste Loss", key: "loss_of_taste", data: [] },
			{ text: "Runny Nose", key: "runny_nose", data: [] },
			{ text: "Sore Musc.", key: "muscle_sore", data: [] },
			{ text: "Sore Throat", key: "sore_throat", data: [] },
			{ text: "Img. Indicatation", key: "cxr_impression", data: [] }
		]
	}


	// readCSV should detect a csv type and call the appropriate process function. 
	readCSV(raw) {
		iflog("detectAndProcess(): processing");
		try {
			var proprietaryObject = d3.csvParse(raw);
			// STATE 3: detect schema of CSV object and add to columns
			if ( JSON.stringify(proprietaryObject.columns) === CSVVersion0Columns ) {
				iflog("Data.readCSV(): Detected Versio 0 CarbonBraid Schema")
				this.processCSVVersion0(proprietaryObject)
			} else if ( JSON.stringify(proprietaryObject.columns) === CSVVersion04072020Columns ) {
				iflog("Data.readCSV(): Detected 04072020 CarbonBraid Schema")
				this.processCSVVersion04072020(proprietaryObject)
			} else {
				iflog("Data.readCSV(): data is in unkown format");
			}
			iflog("Data.readCSV(): data processed")
		} catch (err) {
			iflog("Data.readCSV: data not processed: " + err)
			// STATE: Error, the data couldn't be processed or wasn't detected correctly
			// TODO: Want to know what address there was an error for, so the raw data string should probably be an object
		}
	}
	
	// processCSVVersion04072020 will convert the 4-7-20 CarbonHealth/Braid format to a uniform dataformat. 
	// this is supposed to be conforming data
	processCSVVersion04072020(raw) {
		this.positivePatients = raw.filter(datum => datum.covid_19_test_results === "Positive")
		this.totalPatients += this.positivePatients.length;
		this.mainDomain.forEach( (element, i) => {
			if (element.key === "dyspnea") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.labored_respiration === "TRUE");
			}
			else if (element.key === "rhonchi") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.rhonchi === "TRUE");
			}
			else if (element.key === "wheezes") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.wheezes === "TRUE");
			}
			else if (element.key === "cough") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.cough === "TRUE");
			}
			else if (element.key === "cough_mild") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.cough_severity === "Mild");
			}
			else if (element.key === "cough_moderate") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.cough_severity === "Moderate");
			}
			else if (element.key === "cough_severe") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.cough_severity === "Severe");
			}
			else if (element.key === "fever") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.fever === "TRUE") ;
			}
			else if (element.key === "sob") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.sob === "TRUE");
			}
			else if (element.key === "sob_mild") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.sob_severity === "Mild");
			}
			else if (element.key === "sob_moderate") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.sob_severity === "Moderate");
			}
			else if (element.key === "sob_severe") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.sob_severity === "Severe");
			}
			else if (element.key === "diarrhea") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.diarrhea === "TRUE");
			}
			else if (element.key === "fatigue") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.fatigue === "TRUE");
			}
			else if (element.key === "headache") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.headache === "TRUE");
			}
			else if (element.key === "loss_of_smell") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.loss_of_smell === "TRUE");
			}
			else if (element.key === "loss_of_taste") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.loss_of_taste === "TRUE");
			}
			else if (element.key === "runny_nose") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.runny_nose === "TRUE");
			}
			else if (element.key === "muscle_sore") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.muscle_sore === "TRUE");
			}
			else if (element.key === "sore_throat") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.sore_throat === "TRUE");
			}
			else if (element.key === "cxr_impression") {
				this.mainDomain[i].data = this.positivePatients.filter(datum => datum.cxr_impression != "");
			}
		});
		
		iflog("processCSVversion0(): begin processing")
		return 
	}
	// processCSVVersion0 will convert the 4-6-20 CarbonHealth/Braid format to a uniform dataformat. Don't really think it matters if they're part of the class.
	// this is supposed to be conforming data
	processCSVVersion0(raw) {
		this.positivePatients = raw.filter(datum => datum.covid19_test_results === "Positive")
		this.totalPatients += this.positivePatients.length;
		// Would love to find a way to shorten this. TODO
		// What we're doing is detecting which row we want and then employing a filter based on that colum.
		// Could totally use the filter generator for this somehow.
		// TODO furthermore we're overwriting data
		// TODO we should just be adding data and then adjusting it.
		// We should be conforming the column names to a schema if we need to be
		// This way the filters can all be the same
		// We are not transforming the rows though.
		// We will have to manually translate all "keys" ie column names
		// And then the filters here... are pretty basic
		// only_dyspnea = 
		// only_rhonci =
		// the mainDomain themselves should contain the "master filter"
		this.mainDomain.forEach( (element, i) => {
			if (element.key === "dyspnea") {
				this.mainDomain[i].data = positive.filter(datum => datum.dyspnea === "TRUE");
			}
			else if (element.key === "rhonchi") {
				this.mainDomain[i].data = positive.filter(datum => datum.rhonchi === "TRUE");
			}
			else if (element.key === "wheezes") {
				this.mainDomain[i].data = positive.filter(datum => datum.wheezes === "TRUE");
			}
			else if (element.key === "cough") {
				this.mainDomain[i].data = positive.filter(datum => datum.cough === "TRUE");
			}
			else if (element.key === "cough_mild") {
				this.mainDomain[i].data = positive.filter(datum => datum.cough_severity === "Mild");
			}
			else if (element.key === "cough_moderate") {
				this.mainDomain[i].data = positive.filter(datum => datum.cough_severity === "Moderate");
			}
			else if (element.key === "cough_severe") {
				this.mainDomain[i].data = positive.filter(datum => datum.cough_severity === "Severe");
			}
			else if (element.key === "fever") {
				this.mainDomain[i].data = positive.filter(datum => datum.fever === "TRUE") ;
			}
			else if (element.key === "sob") {
				this.mainDomain[i].data = positive.filter(datum => datum.sob === "TRUE");
			}
			else if (element.key === "sob_mild") {
				this.mainDomain[i].data = positive.filter(datum => datum.sob_severity === "Mild");
			}
			else if (element.key === "sob_moderate") {
				this.mainDomain[i].data = positive.filter(datum => datum.sob_severity === "Moderate");
			}
			else if (element.key === "sob_severe") {
				this.mainDomain[i].data = positive.filter(datum => datum.sob_severity === "Severe");
			}
			else if (element.key === "diarrhea") {
				this.mainDomain[i].data = positive.filter(datum => datum.diarrhea === "TRUE");
			}
			else if (element.key === "fatigue") {
				this.mainDomain[i].data = positive.filter(datum => datum.fatigue === "TRUE");
			}
			else if (element.key === "headache") {
				this.mainDomain[i].data = positive.filter(datum => datum.headache === "TRUE");
			}
			else if (element.key === "loss_of_smell") {
				this.mainDomain[i].data = positive.filter(datum => datum.loss_of_smell === "TRUE");
			}
			else if (element.key === "loss_of_taste") {
				this.mainDomain[i].data = positive.filter(datum => datum.loss_of_taste === "TRUE");
			}
			else if (element.key === "runny_nose") {
				this.mainDomain[i].data = positive.filter(datum => datum.runny_nose === "TRUE");
			}
			else if (element.key === "muscle_sore") {
				this.mainDomain[i].data = positive.filter(datum => datum.muscle_sore === "TRUE");
			}
			else if (element.key === "sore_throat") {
				this.mainDomain[i].data = positive.filter(datum => datum.sore_throat === "TRUE");
			}
			else if (element.key === "cxr_impression") {
				this.mainDomain[i].data = positive.filter(datum => datum.cxr_impression != "");
			}
		});
		
		iflog("processCSVversion0(): begin processing")
		return 
	}


	// prepareFilteredData will use filterFunc on each row of mainDomain and populate the values member of the filter
	// TODO maybe add a hash to see if it's changed. Probably a filter object method.
	prepareFilteredData(filter) {
		filter.values = [];
		filter.sampleSize = this.positivePatients.filter(filter.filterFunc).length;
		this.mainDomain.forEach((row, i) => {
			filter.values.push({"row":row.key, "value": row.data.filter(filter.filterFunc).length });
		});
	}
	// removeMajorRow manually removes an entire category. While _technically_ we're removing data, which you'd use D3.remove() for, we're more accurately removing an entire visualization.
	removeMajorRow(filterID) {
		document.querySelectorAll("." + filterID + "-row").forEach( (el) => { return el.remove(); });
	}
	// writeBarGraph is going to apply a filter to the data and create a new key-value pair where the value is an array of key value pairs
	writeBarGraph(filters) {
		if (this.totalPatients == 0) {
			iflog("writeBarGraph(): exiting as length of data is 0");
			return;
		}
		if (!Array.isArray(filters)) {
			filters = [ filters ];
		}
		filters.forEach( (filter, i) => {
			this.prepareFilteredData(filter); // TODO: this probably wont happen here if we're rerendering EVERYTHING

			var chart = d3.select('#bar-chart').selectAll('.data-container');
			chart = chart.selectAll('div .' + filter.ID + "-row"); 
			chart = chart.data((d, i) => { return [ filter.values[i] ]; }, (d) => { return d.row + "_" + filter.ID; } );
			// Engineering Note:
			// D3 tutorial suggests in the case of nested selectAlls, to attach data twice. So values[] on '.data-container' and (d) => { return [ d ]; } for 'div'
			// But attaching data to '.data-container' doesn't make sense.
			// Passing any type of an array back to just 'div' produced "undefined behavior"- you end up looping over the whole array within every '.data-container'.
			// This function accesses the particular value you want to attach and makes it an array.
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
			var sp = bar.append("span");
			var RGB = parseInt(d3.schemeSet1[filter.colorIndex % 9].slice(1), 16);
			var R = 255 - ( RGB >> 16 )
			var G = 255 - (( RGB >> 8) & 0xFF)
			var B	= 255 - ( RGB & 0xFF )
			var inverseColor = "#" + (((R << 16) + (G << 8) + (B)).toString(16));
			sp = sp.style("color", inverseColor);
			sp = sp.text(d => { return Math.round(10000 * (d.value) / filter.sampleSize)/100 + "%" } );
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


// process.js detects csv type and converts the csv to a unified data format.
// the unified data format is like a protocol buffer in that the schema can only grow.

// Data class represents the ultimate schema.
class Data {
	constructor() {
		this.data = [];
		this.positive = [];
		this.negative = [];
	}


	// readCSV should detect a csv type and call the appropriate process function. 
	readCSV(raw) {
		iflog("detectAndProcess(): processing");
		// Since there is only one format... we don't need to detect yet
		try {
			this.data = processCSVversion0(raw);
			// Create basic domain. A lot of manual work on the moment.
			this.positive = this.data.filter(datum => datum.covid19_test_results === "Positive");
			this.columns = [
				{ "ctab": this.positive.filter(datum => datum.ctab === "TRUE") },
				{ "dyspnea": this.positive.filter(datum => datum.dyspnea === "TRUE") },
				{ "rhonchi": this.positive.filter(datum => datum.rhonchi === "TRUE") },
				{ "wheezes": this.positive.filter(datum => datum.wheezes === "TRUE") },
				{ "cough": this.positive.filter(datum => datum.cough === "TRUE") },
				{ "cough_mild": this.positive.filter(datum => datum.cough_severity === "Mild") },
				{ "cough_moderate": this.positive.filter(datum => datum.cough_severity === "Moderate") },
				{ "cough_severe": this.positive.filter(datum => datum.cough_severity === "Severe") },
				{ "fever": this.positive.filter(datum => datum.fever === "TRUE")  },
				{ "sob": this.positive.filter(datum => datum.sob === "TRUE") },
				{ "sob_mild": this.positive.filter(datum => datum.sob_severity === "Mild") },
				{ "sob_moderate": this.positive.filter(datum => datum.sob_severity === "Moderate") },
				{ "sob_severe": this.positive.filter(datum => datum.sob_severity === "Severe") },
				{ "diarrhea": this.positive.filter(datum => datum.diarrhea === "TRUE") },
				{ "fatigue": this.positive.filter(datum => datum.fatigue === "TRUE") },
				{ "headache": this.positive.filter(datum => datum.headache === "TRUE") },
				{ "loss_of_smell": this.positive.filter(datum => datum.loss_of_smell === "TRUE") },
				{ "loss_of_taste": this.positive.filter(datum => datum.loss_of_taste === "TRUE") },
				{ "runny_nose": this.positive.filter(datum => datum.runny_nose === "TRUE") },
				{ "muscle_throat": this.positive.filter(datum => datum.muscle_sore === "TRUE") },
				{ "sore_throat": this.positive.filter(datum => datum.sore_throat === "TRUE") },
				{ "cxr_impression": this.positive.filter(datum => datum.cxr_impression != "") }
			]
			iflog("Data.readCSV(): data processed")
		} catch (err) {
			iflog("Data.readCSV: data not processed: " + err)
			// STATE: Error, the data couldn't be processed or wasn't detected correctly
			// Want to know what address there was an error for
		}
	}
}

// processCSVversion0 will convert the 4-6-20 CarbonHealth/Braid format to a uniform dataformat. Don't really think it matters if they're part of the class.
function processCSVversion0(raw) {
	iflog("processCSVversion0(): begin processing")
	return d3.csvParse(raw);
}

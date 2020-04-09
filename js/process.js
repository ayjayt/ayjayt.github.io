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
			// Statistic Generation- honestly just calculate every permutation serverside
			this.positive = this.data.filter(datum => datum.covid19_test_results === "Positive");
			this.negative = this.data.filter(datum => datum.covid19_test_results === "Negative");
			this.ctab = this.positive.filter(datum => datum.ctab === "TRUE").length; 
			this.dyspnea = this.positive.filter(datum => datum.dyspnea === "TRUE").length; 
			this.rhonchi = this.positive.filter(datum => datum.rhonchi === "TRUE").length; 
			this.wheezes = this.positive.filter(datum => datum.wheezes === "TRUE").length; 
			this.cough = this.positive.filter(datum => datum.cough === "TRUE").length; 
			this.cough_mild = this.positive.filter(datum => datum.cough_severity === "Mild").length; 
			this.cough_moderate = this.positive.filter(datum => datum.cough_severity === "Moderate").length; 
			this.cough_severe = this.positive.filter(datum => datum.cough_severity === "Severe").length; 
			this.fever = this.positive.filter(datum => datum.fever === "TRUE").length; 
			this.sob = this.positive.filter(datum => datum.sob === "TRUE").length; 
			this.sob_mild = this.positive.filter(datum => datum.sob_severity === "Mild").length; 
			this.sob_moderate = this.positive.filter(datum => datum.sob_severity === "Moderate").length; 
			this.sob_severe = this.positive.filter(datum => datum.sob_severity === "Severe").length; 
			this.diarrhea = this.positive.filter(datum => datum.diarrhea === "TRUE").length; 
			this.fatigue = this.positive.filter(datum => datum.fatigue === "TRUE").length; 
			this.headache = this.positive.filter(datum => datum.headache === "TRUE").length; 
			this.loss_of_smell = this.positive.filter(datum => datum.loss_of_smell === "TRUE").length; 
			this.loss_of_taste = this.positive.filter(datum => datum.loss_of_taste === "TRUE").length; 
			this.runny_nose = this.positive.filter(datum => datum.runny_nose === "TRUE").length; 
			this.muscle_throat = this.positive.filter(datum => datum.muscle_sore === "TRUE").length; 
			this.sore_throat = this.positive.filter(datum => datum.sore_throat === "TRUE").length; 
			this.cxr_impression = this.positive.filter(datum => datum.cxr_impression != "").length; 
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

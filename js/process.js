// process.js detects csv type and converts the csv to a unified data format.
// the unified data format is like a protocol buffer in that the schema can only grow.

// Checking column patterns is how we're determing schema right now
const CSVVersion0Columns = JSON.stringify(["clinic_state", "test_name", "covid19_test_results", "age", "high_risk_exposure_occupation", "high_risk_interactions", "diabetes", "chd", "htn", "cancer", "asthma", "copd", "autoimmune_dis", "temperature", "pulse", "sys", "dia", "rr", "o2sat", "rapid_flu", "rapid_flu_result", "rapid_strep", "rapid_strep_result", "ctab", "dyspnea", "rhonchi", "wheezes", "cough", "cough_severity", "fever", "sob", "sob_severity", "diarrhea", "fatigue", "headache", "loss_of_smell", "loss_of_taste", "runny_nose", "muscle_sore", "sore_throat", "cxr_findings", "cxr_impression", "cxr_link"])

// Data class represents the ultimate schema.
class Data {
	constructor() {
		// These are the dependent variables, basically. A lot of redundancy here.
		this.totalPatients = 0;
		this.columns = [
			{ "dyspnea": [] },
			{ "rhonchi": [] },
			{ "wheezes": [] },
			{ "cough": [] },
			{ "cough_mild": [] },
			{ "cough_moderate": [] },
			{ "cough_severe": [] },
			{ "fever": [] },
			{ "sob": [] },
			{ "sob_mild": [] },
			{ "sob_moderate": [] },
			{ "sob_severe":[] },
			{ "diarrhea": [] },
			{ "fatigue": [] },
			{ "headache": [] },
			{ "loss_of_smell": [] },
			{ "loss_of_taste": [] },
			{ "runny_nose": [] },
			{ "muscle_throat": [] },
			{ "sore_throat": [] },
			{ "cxr_impression": [] }
		]
	}


	// readCSV should detect a csv type and call the appropriate process function. 
	readCSV(raw) {
		iflog("detectAndProcess(): processing");
		// Since there is only one format... we don't need to detect yet
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
			// Want to know what address there was an error for
		}
	}
	
	// processCSVVersion0 will convert the 4-6-20 CarbonHealth/Braid format to a uniform dataformat. Don't really think it matters if they're part of the class.
	processCSVVersion0(raw) {
		// BUG TODO, BIG OOF: this is a major hack. we should be adding to columns, but we are not.
		var positive = raw.filter(datum => datum.covid19_test_results === "Positive")
		this.totalPatients += positive.length;
		this.columns = [
			{ "dyspnea": positive.filter(datum => datum.dyspnea === "TRUE") },
			{ "rhonchi": positive.filter(datum => datum.rhonchi === "TRUE") },
			{ "wheezes": positive.filter(datum => datum.wheezes === "TRUE") },
			{ "cough": positive.filter(datum => datum.cough === "TRUE") },
			{ "cough_mild": positive.filter(datum => datum.cough_severity === "Mild") },
			{ "cough_moderate": positive.filter(datum => datum.cough_severity === "Moderate") },
			{ "cough_severe": positive.filter(datum => datum.cough_severity === "Severe") },
			{ "fever": positive.filter(datum => datum.fever === "TRUE")  },
			{ "sob": positive.filter(datum => datum.sob === "TRUE") },
			{ "sob_mild": positive.filter(datum => datum.sob_severity === "Mild") },
			{ "sob_moderate": positive.filter(datum => datum.sob_severity === "Moderate") },
			{ "sob_severe": positive.filter(datum => datum.sob_severity === "Severe") },
			{ "diarrhea": positive.filter(datum => datum.diarrhea === "TRUE") },
			{ "fatigue": positive.filter(datum => datum.fatigue === "TRUE") },
			{ "headache": positive.filter(datum => datum.headache === "TRUE") },
			{ "loss_of_smell": positive.filter(datum => datum.loss_of_smell === "TRUE") },
			{ "loss_of_taste": positive.filter(datum => datum.loss_of_taste === "TRUE") },
			{ "runny_nose": positive.filter(datum => datum.runny_nose === "TRUE") },
			{ "muscle_throat": positive.filter(datum => datum.muscle_sore === "TRUE") },
			{ "sore_throat": positive.filter(datum => datum.sore_throat === "TRUE") },
			{ "cxr_impression": positive.filter(datum => datum.cxr_impression != "") }
		]
		iflog("processCSVversion0(): begin processing")
		return 
	}

	// writeTotals populates a graph with percentages. This function is really a place holder. We're probably going to be creating "views" based on filters. This is a TODO.
	writeTotals(target, filters) {
		var columnsHeight = 100/this.columns.length;
		var bar = d3.select('#bar-chart').selectAll('div')
		bar = bar.data(this.columns)
		bar = bar.enter()
		bar = bar.append('div')
		bar = bar.style('width', d => {
				return (100 * (Object.values(d)[0].length / this.totalPatients) + 1) + "%";
			})  // should be responsive
		bar = bar.style('height', columnsHeight + "%") // but could be responsive
	}
}


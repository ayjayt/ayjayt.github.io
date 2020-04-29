// raw_data.js just conforms the data

// Master Schema is what we conform the rows too.
const masterSchema = ["nothing yet"];

// Checking column patterns is how we're determing schema right now
const CSVVersion0Columns = JSON.stringify(["clinic_state", "test_name", "covid19_test_results", "age", "high_risk_exposure_occupation", "high_risk_interactions", "diabetes", "chd", "htn", "cancer", "asthma", "copd", "autoimmune_dis", "temperature", "pulse", "sys", "dia", "rr", "o2sat", "rapid_flu", "rapid_flu_result", "rapid_strep", "rapid_strep_result", "ctab", "dyspnea", "rhonchi", "wheezes", "cough", "cough_severity", "fever", "sob", "sob_severity", "diarrhea", "fatigue", "headache", "loss_of_smell", "loss_of_taste", "runny_nose", "muscle_sore", "sore_throat", "cxr_findings", "cxr_impression", "cxr_link"])

const CSVVersion04072020Columns = JSON.stringify(["date_published", "clinic_state", "test_name", "swab_type", "covid_19_test_results", "age", "high_risk_exposure_occupation", "high_risk_interactions", "diabetes", "chd", "htn", "cancer", "asthma", "copd", "autoimmune_dis", "temperature", "pulse", "sys", "dia", "rr", "sats", "rapid_flu", "rapid_flu_results", "rapid_strep", "rapid_strep_results", "ctab", "labored_respiration", "rhonchi", "wheezes", "cough", "cough_severity", "fever", "sob", "sob_severity", "diarrhea", "fatigue", "headache", "loss_of_smell", "loss_of_taste", "runny_nose", "muscle_sore", "sore_throat", "cxr_findings", "cxr_impression", "cxr_link"]);

const CSVVersion04212020Columns = JSON.stringify(["date_published", "clinic_state", "test_name", "swab_type", "covid19_test_results", "age", "high_risk_exposure_occupation", "high_risk_interactions", "diabetes", "chd", "htn", "cancer", "asthma", "copd", "autoimmune_dis", "temperature", "pulse", "sys", "dia", "rr", "sats", "rapid_flu_results", "rapid_strep_results", "days_since_symptom_onset", "ctab", "labored_respiration", "rhonchi", "wheezes", "cough", "cough_severity", "fever", "sob", "sob_severity", "diarrhea", "fatigue", "headache", "loss_of_smell", "loss_of_taste", "runny_nose", "muscle_sore", "sore_throat", "cxr_findings", "cxr_impression", "cxr_link", "er_referral"]);

// SchemaDiff will diff arrays to aid the programmer
function schemaDiff(comparison) {
	// TODO
	// TODO
}

class SourceData {
	constructor(source, raw) {
		this.source = source;
		try {
			this.data = d3.csvParse(raw);
			this.schemaID = JSON.stringify(this.data.columns);
		} catch (err) {
			iflog("SourceData.constructor(): error");
			iflog(err);
		}
	}

	// conformData should detect a csv type and call the appropriate process function. 
	conformData() {
		iflog("SourceData.conformData(): processing");
		try {
			if ( sourceData.schemaID === CSVVersion0Columns ) {
				iflog("SourceData.conformData(): Detected Versio 0 CarbonBraid Schema");
				this.processCSVVersion0(sourceData.data)
			} else if ( sourceData.schemaID === CSVVersion04072020Columns ) {
				iflog("SourceData.conformData(): Detected 04072020 CarbonBraid Schema");
				this.processCSVVersion04072020(sourceData.data)
			} else if ( sourceData.schemaID === CSVVersion04212020Columns ) {
				iflog("SourceData.conformData(): Detected 04072020 CarbonBraid Schema V2");
				this.processCSVVersion04212020(sourceData.data) 
			} else {
				iflog("SourceData.conformData(): data is in unkown format");
				// STATE: Error, the data couldn't be processed or wasn't detected correctly
				// TODO: Schema Dif
				return
			}
			this.totalPatients += sourceData.data.length;
			iflog("SourceData.conformData(): data processed")
		} catch (err) {
			iflog("SourceData.conformData(): data not processed: " + err)
			// STATE: Error, the data couldn't be processed or wasn't detected correctly
		}
	}
	
	// processCSVVersion04072020 will convert the 4-7-20 CarbonHealth/Braid format to a uniform dataformat. 
	processCSVVersion04212020(raw) {
		iflog("processCSVVersion04212020(): begin processing")
		return 
	}

	// processCSVVersion04072020 will convert the 4-7-20 CarbonHealth/Braid format to a uniform dataformat. 
	processCSVVersion04072020(raw) {
		raw.forEach( datum => {
			datum.covid19_test_results = datum.covid_19_test_results;
			delete datum.covid_19_test_results;
		});
		raw.columns[raw.columns.find("covid_19_test_results")] = "covid19_test_results";
		iflog("processCSVversion0(): begin processing")
		return 
	}

	// processCSVVersion0 will convert the 4-6-20 CarbonHealth/Braid format to a uniform dataformat. Don't really think it matters if they're part of the class.
	processCSVVersion0(raw) {
		iflog("processCSVversion0(): begin processing")
		return 
	}
}
// RawData stores all the rows
class RawData {
}

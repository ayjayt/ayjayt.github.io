// process.js detects csv type and converts the csv to a unified data format.
// the unified data format is like a protocol buffer in that the schema can only grow.

// Data class represents the ultimate schema.
class Data {
	constructor() {
		this.data = [];
	}

	// readCSV should detect a csv type and call the appropriate process function. 
	readCSV(raw) {
		iflog("detectAndProcess(): processing");
		// Since there is only one format... we don't need to detect yet
		try {
			this.data = processCSVversion0(raw);
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

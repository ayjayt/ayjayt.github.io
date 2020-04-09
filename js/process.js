// process.js detects csv type and converts the csv to a unified data format.
// the unified data format is like a protocol buffer in that the schema can only grow.

// detectAndProcess takes raw data and populates the DATA global with unified format data. It's called by functions in retrieve.js, and calls the process functions.
function detectAndProcess(raw) {
	iflog("detectAndProcess(): processing");
	// Since there is only one format... we don't need to detect yet
	processCSVversion0(raw);	
}

// processCSVversion0 will convert the 4-6-20 CarbonHealth/Braid format to a uniform dataformat
function processCSVversion0(raw){
	iflog("processCSVversion0(): begin processing")

}

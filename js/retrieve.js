// retrieve.js concerns itself entirely with finding CSVs

// retrieveData is called by window.load event w/ data address and a callback function
function retrieveData(address, callback) {
	function retrievalError(){
		iflog("retrievalError(): Error Loading Data");
		// STATE: ERROR, Data Retrieval Failure
	}
	req = setError(new XMLHttpRequest(), "Error loading data", retrievalError)
	req.addEventListener("load", function() {
		rawData = this.responseText;
		iflog("retrieveData.req.load(): Data Retrieved");
		// STATE: 3, Data Retrieved
		callback(rawData); // This is like a success callback, basically TODO
	})
	req.open("GET", address);
	req.send();
	iflog("retrieveData(): Data Requested");
	// STATE: 2, Loading Data
}

// retrieve.js concerns itself entirely with finding CSVs

// retrieveData is called by window.load event w/ data address and a callback function
function retrieveData(address) {
	return new Promise( (resolve, reject) => {
		var req = setError(new XMLHttpRequest(), address, reject)
		req.addEventListener("load", function(e) {
			if ( req.status != 200 ) {
				iflog("retrieveData.req.load(): Response non 200");
				reject(address, req);
				return;
			}
			rawData = this.responseText;
			iflog("retrieveData.req.load(): Data Retrieved");
			// STATE: 3, Data Retrieved
			resolve(rawData); // This is like a success callback, basically TODO
		})
		req.open("GET", address);
		req.send();
		iflog("retrieveData(): Data Requested");
		// STATE: 2, Loading Data
	})
}

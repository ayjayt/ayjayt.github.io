// retrieve.js concerns itself entirely with finding CSVs

// retrieveData is called by window.load event w/ data address and a callback function
function retrieveData(address) {
	return new Promise( (resolve, reject) => {
		fetch(address).then((response) => {
			if ( response.status != 200 ) {
				iflog("retrieveData.fetch.resolve: Response non-200");
				reject(address);
				// STATE: ERROR, non-200 response
				return;
			}
			var rawData = response.text();
			iflog("retrieveData.fetch.resolve: Data Retrieved");
			// STATE: 3, Data Loaded
			resolve(rawData);
		}).catch((err) => {
			iflog("retrieveData.fetch.reject: Error");
			reject(address);
			// STATE: ERROR, fetch failed
		})
		iflog("retrieveData(): Data Requested");
		// STATE: 2, Loading Data
	})
}

// retrieve.js concerns itself entirely with finding CSVs

// retrieveData is called by window.load event w/ data address and a callback function
function retrieveData(address) {
	return new Promise( (resolve, reject) => {
		fetch(address).then((response) => {
			if ( response.status != 200 ) {
				iflog("retrieveData.fetch.resolve: Response non-200");
				reject(address, response);
				return;
			}
			var rawData = this.responseText;
			iflog("retrieveData.fetch.resolve: Data Retrieved");
			// STATE: 3, Data Retrieved
			resolve(rawData);
		}).catch((err) => {
			iflog("retrieveData.fetch.reject: Error");
			reject(address, response);
		})
		iflog("retrieveData(): Data Requested");
		// STATE: 2, Loading Data
	})
}

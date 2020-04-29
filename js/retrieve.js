// retrieve.js concerns itself entirely with finding CSVs

// retrieveData is called by window.load event w/ data address and a callback function
function retrieveData(address) {
	return new Promise( (resolve, reject) => {
		fetch(address).then((response) => {
			if ( response.status != 200 ) {
				iflog("retrieveData.fetch.resolve: Response non-200");
				reject(new SourceData(address, ""));
				// STATE: ERROR, non-200 response
				return;
			}
			response.text().then( text => {
				var sourceData = new SourceData("",text);
				iflog("retrieveData.fetch.resolve: Data Retrieved");
				resolve(sourceData);
			});
		}).catch((err) => {
			iflog("retrieveData.fetch.reject: Error");
			iflog(err);
			reject(new SourceData(address, ""));
			// STATE: ERROR, fetch failed
		})
		iflog("retrieveData(): Data Requested");
	})
}

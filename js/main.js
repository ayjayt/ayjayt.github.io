// main.js includes some utilities and is a basic outline of the program

// List of datasources
var DATAURLS = [ 
	"https://ayjayt.github.io/cached-data/04-07_carbonhealth_and_braidhealth.csv",
	"https://ayjayt.github.io/cached-data/04-14_carbonhealth_and_braidhealth.csv",
	"https://ayjayt.github.io/cached-data/04-21_carbonhealth_and_braidhealth.csv"
	];

// LOGON is a global variable to turn verbose logging on
var LOGON=true

// data is the active dataset
var data = new FilteredData();

// iflog logs if LOGON is true
function iflog(message) {
	if (LOGON) {
		console.log(message);
	}
}

// Execute all javascript when window is ready here
window.addEventListener("load", (event) => {
	iflog("window.load(): Window Loaded");

	// NOTE: we won't use Promise.all because we want each promise to be evaluated individually for success or failure- not fail on first.
	var remoteDataProm = DATAURLS.map(retrieveData);

	remoteDataProm.forEach((promise) => {
		// NOTE: can't pass the class method directly because promise strips it from it's class instance >:O
		promise.then(dataChunk => {
			data.addSourceData(dataChunk)
		}).catch(dataChunk => { 
			// STATE: Error, address failed
			iflog("window.load(): " + dataChunk.source + " did not resolve properly.") 
		})
		// TODO: You could easily do a loading screen here. You could use fetch's partial load to make it easier.
	})
	
	Promise.all(remoteDataProm).catch( () => {
		iflog("window.load(): at least one data retrieval failed")
	}).finally( () => {
		data.initialize();
	});
	assignUIEvents();
})

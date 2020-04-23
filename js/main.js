// main.js includes some utilities and is a basic outline of the program

// List of datasources
var DATAURLS = [ 
	"https://raw.githubusercontent.com/mdcollab/covidclinicaldata/master/data/04-07_carbonhealth_and_braidhealth.csv"
	];

// LOGON is a global variable to turn verbose logging on
var LOGON=true

// data is the active dataset
var data = new Data();

// iflog logs if LOGON is true
function iflog(message) {
	if (LOGON) {
		console.log(message);
	}
}

// Execute all javascript when window is ready here
window.addEventListener("load", (event) => {
	// STATE: 1, Window Loaded
	iflog("window.load(): Window Loaded");

	// NOTE: we won't use Promise.all because we want each promise to be evaluated individually for success or failure- not fail on first.
	var remoteDataProm = DATAURLS.map(retrieveData);

	remoteDataProm.forEach((promise) => {
		// STATE 4: Processing received data. Stuff could be happening in parallel.
		// NOTE: can't pass the class method directly because promise strips it from it's class instance >:O
		promise.then(raw => data.readCSV(raw)).catch(address => { 
			// STATE: Error, address failed
			iflog("window.load(): " + address + " did not resolve properly.") 
		})
		// TODO: You could easily do a loading screen here. You could use fetch's partial load to make it easier.
	})
	
	Promise.all(remoteDataProm).catch( () => {
		iflog("window.load(): at least one data retrieval failed")
	}).finally( () => {
		// STATE 6: Render chart structure
		data.writeMajorColumns(); 
		// STATE 7: Render actual bar graph
		// TODO: check to see if there is any data here?
		data.prepareFilteredData(filterList);
		data.renderBarGraph(filterList);
		// STATE 10: Populate filterList control
		populateFilterList();
	});
	assignUIEvents();
})

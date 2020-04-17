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
		// Note: can't pass the class method directly because promise strips it from it's class instance >:O
		// So it's passed as a lambda
		promise.then(raw => data.readCSV(raw)).catch(address => { 
			// STATE: Error, address failed
			iflog("window.load(): " + address + " did not resolve properly.") 
		})
	})
	iflog("second promise");
	Promise.all(remoteDataProm).catch( () => {
		iflog("window.load(): at least one data retrieval failed")
	}).finally( () => {
		data.writeMajorColumns(); 
		data.writeBarGraph(sampleFiltered);
		data.writeBarGraph(sampleFiltered2);
	});
})

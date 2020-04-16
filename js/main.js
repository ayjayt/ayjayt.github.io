// main.js includes some utilities and is a basic outline of the program

// List of datasources
var DATAURLS = [ 
	"https://raw.githubusercontent.com/mdcollab/covidclinicaldata/master/data/carbonhealth_and_braidhealth/4.6_carbonhealth_and_braidhealth.csv"
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
	iflog("window.load(): Window Loaded")

	// NOTE: we won't use Promise.all because we want each promise to be evaluated individually for success or failure- not fail on first.
	DATAURLS.map(retrieveData).forEach((promise) => {
		// Note: can't call class method directly because promise strips it from it's class instance >:O
		promise.then(raw => data.readCSV(raw)).catch(address => { 
			// STATE: Error, address failed
			iflog("window.load(): " + address + " did not resolve properly.") 
		})
	})
})

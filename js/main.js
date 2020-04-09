// main.js includes some utilities and is a basic outline of the program

// List of datasources
var DATAURLS = [ 
	"https://covidclinicaldata.com/data/carbonhealth_and_braidhealth/ALL/4.6_carbonhealth_and_braidhealth.csv",
	"https://covidclinicaldata.com/data/carbonhealth_and_braidhealth/ALL/4.6_carbonhealth_and_braidhealth.cs",
	];

// LOGON is a global variable to turn verbose logging on
var LOGON=true
// DATA is where data will be stored
var DATA

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
		promise.then(detectAndProcess).catch((address, res) => { 
			// STATE: Error, address failed
			iflog("window.load(): " + address + " did not resolve properly.") 
		} )
	})

})

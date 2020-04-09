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

// setError takes and returns an HTTP request with basic error handling set. It takes the req's supplied address string and an  an errFunc for custom action.
// NOTE: It doesn't not catch non-200 status codes! That is a valid response as far as xhr is concerned!
function setError(req, address, errFunc) {
	req.timeout = 1200;
	req.onerror = function() {
		// STATE: ERROR, Catchall
		iflog("setError(): XHTTP ERROR");
		if (errFunc) {
			errFunc(address, req);
		}
	}
	return req;
}

// detectAndProcess takes raw data and populates the DATA global with unified format data. It's called by functions in retrieve.js, and calls functions in process.js
function detectAndProcess(raw) {
	iflog("detectAndProcess(): processing");
	// Since there is only one format...
	processCSVversion0(raw);	
}

// Execute all javascript when window is ready here
window.addEventListener("load", (event) => {
	// STATE: 1, Window Loaded
	iflog("window.load(): Window Loaded")

	// NOTE: we wont use Promise.all because we want each promise to be evaluated individually
	DATAURLS.map(retrieveData).forEach( (promise) => {
		promise.then(detectAndProcess).catch( (address, res) => { 
			iflog("window.load(): " + address + " did not resolve properly.") 
		} )
	})

})

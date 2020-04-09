// main.js includes some utilities and is a basic outline of the program

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

// setError takes and returns an HTTP request se with basic error handling. It takes a string for logging (err) and an errFunc for custom action.
function setError(req, err, errFunc) {
	req.timeout = 1200;
	req.onerror = function() {
		// STATE: ERROR, Catchall
		iflog("setError(): XHTTP ERROR");
		iflog("setError(): " + err);
		if (errFunc) {
			errFunc();
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
	retrieveData("https://covidclinicaldata.com/data/carbonhealth_and_braidhealth/ALL/4.6_carbonhealth_and_braidhealth.csv", detectAndProcess) // TODO Takes a callback, should be a promise
})

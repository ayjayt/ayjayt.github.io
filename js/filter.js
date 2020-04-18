// filter.js defines the filter array and can build one from a string


// uuidv4 supplies a random ID number to be used by a filter object because we have tight constraints for what characters are allowed. Setting a filter ID/data ID/class name to an arbitrary string leads to disaster as it winds its way through various third party frameworks.
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// Filter is basically a class that takes a data object and produces a summary based on the specified filters. It renders itself to the graph.
class Filter {
	constructor(label, filterMap, colorIndex) {
		this.label = label;
		this.colorIndex = colorIndex;
		this.filterMap = filterMap;
		// Construct function from map here;
		this.ID = "i" + uuidv4();
		this.values = [];
		this.sampleSize = 0;
	}
}


// sampleFiltered is an array of sample filter objects for testing
var sampleFiltered = [
	new Filter("All", {}, 0),
	new Filter(">60yo", {}, 1)
];
	// We're creating the two filter functions from scratch because we can't build them from strings yet.
	sampleFiltered[0].filterFunc = (el) => { return true; };
	sampleFiltered[1].filterFunc = (el) => {return el.age > 60; };

// filter.js defines the filter array and can build one from a string


// uuidv4 supplies a random ID number to be used by a filter object because we have tight constraints for what characters are allowed. Setting a filter ID/data ID/class name to an arbitrary string leads to disaster as it winds its way through various third party frameworks.
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

class FilterMap {
	constructor(key, operator, value) {
		this.key = key;
		this.op = operator;
		this.val = value;
	}
}

// Filter is basically a class that takes a data object and produces a summary based on the specified filters. It renders itself to the graph.
class Filter {
	constructor(positive, negative, filterMaps) {
		this.positive = positive;
		this.negative = negative;
		this.filterMaps = filterMaps;
		// Construct function from map here;
		this.ID = "i" + uuidv4();
		this.values = [];
		this.sampleSize = 0;
	}

	// filterFunc runs the filterMap. 
	// TODO: It could use generated and stored functions, which would be faster.
	filterFunc(elem) {
		for (let i = 0; i < this.filterMaps.length; i ++) {
			if (this.filterMaps[i].op === "==") {
				if ( elem[this.filterMaps[i].key] == this.filterMaps[i].val ) {
				} else {
					return false;
				}
			} else if (this.filterMaps[i].op === "!=") {
				if ( elem[this.filterMaps[i].key] != this.filterMaps[i].val ) {
				} else {
					return false;
				}
			} else if (this.filterMaps[i].op === ">") {
				if ( elem[this.filterMaps[i].key] > this.filterMaps[i].val ) {
				} else {
					return false;
				}
			} else if (this.filterMaps[i].op === "<") {
				if ( elem[this.filterMaps[i].key] < this.filterMaps[i].val ) {
				} else {
					return false;
				}
			} else if (this.filterMaps[i].op === ">=") {
				if ( elem[this.filterMaps[i].key] >= this.filterMaps[i].val ) {
				} else {
					return false;
				}
			} else if (this.filterMaps[i].op === "<=") {
				if ( elem[this.filterMaps[i].key] <= this.filterMaps[i].val ) {
				} else {
					return false;
				}
			}
		}
		return true;
	}
}



function populateFilterList() {
// Reads filters and writes to list
	var filterListContainer = document.getElementById("filter-list");
	while (filterListContainer.firstChild) {
		filterListContainer.removeChild(filterListContainer.lastChild);
	}
	filterList.forEach( (el) => {
		let newOption = document.createElement("option");
		newOption.textContent = el.label;
		filterListContainer.appendChild(newOption)
	});
}

function removeFilter(filterLabel) {
	var targetFilterId;
	filterList = filterList.filter( (el) => { 
		if (el.label != filterLabel) {	
			return true;
		}
		targetFilterId = el.ID;
	});
	populateFilterList();
	data.removeFilterRow(targetFilterId);
}

// assignUIEvents is run on body load to construct the ui
function assignUIEvents() {
	document.getElementById("filter-list-form").addEventListener("submit", (e) => {
		e.preventDefault();
	});
	document.getElementById("delete-filter").addEventListener("click", (e) => {
		e.preventDefault();
		var filterList = document.getElementById("filter-list");
		if (filterList.value) {
			removeFilter(filterList.value);
		}
	});
}

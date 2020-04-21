
function populateFilterList(filterList) {
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

function removeFilter() {
// Removes filter from list and deletes it from array, then rerenders (all? or part?)
}
// TODO: add onclick delete


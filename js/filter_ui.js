
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
	document.getElementById("filter-gen").addEventListener("submit", (e) => {
		e.preventDefault();
		genFilter();
		populateFilterList();
		// data.prepareFilteredData(filterList); -- done in advance
		data.renderBarGraph(filterList); // error here
		// TODO: can we render just one?
		// TODO: what happens if we change colors and rerender?
		document.getElementById("filter-list").style.transition = "";
		document.getElementById("filter-list").style.backgroundColor = "#7aff7a";
		window.setTimeout(() => {
			document.getElementById("filter-list").style.transition = "background-color 1.0s ease-in-out";
		  document.getElementById("filter-list").style.backgroundColor = "transparent";
		}, 100);

	});
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
	document.getElementById("add-filter").addEventListener("click", (e) => {
		document.getElementById("filter-form-wrapper").style.display="block";
		document.getElementById("filter-form").style.display="grid";
		document.getElementById("filter-form").style.top=(window.scrollY + 10) + "px";
		e.currentTarget.style.display = "none";
	});
	document.getElementById("filter-done").addEventListener("click", (e) => {
		document.getElementById("filter-form-wrapper").style.display="none";
		document.getElementById("filter-form").style.display="none";
		document.getElementById("add-filter").style.display = "block";
	});
}

// genFilter reads the filter form and generates a new element in filterList
function genFilter() {
	var filterMaps = [];
	var label = document.getElementById("label").value;
	if (label == "") {
		alert("please create a label");
		return false;
	}
	var minAge = document.getElementById("min-age").value;
	var ageString = "";
	if (minAge === "") {
		minAge = 0;
	}
	if (minAge != 0) {
		filterMaps.push(new FilterMap("age", ">=", minAge));
	}
	var maxAge = document.getElementById("max-age").value;
	if (maxAge === "") {
		maxAge = 120;
	}
	if (maxAge < 120) {
		filterMaps.push(new FilterMap("age", "<=", maxAge));
	}
	var comorbidityList = document.getElementById("comorbidity_options").querySelectorAll('input[type=checkbox]:checked');
	var symptomList = document.getElementById("symptom_options").querySelectorAll('input[type=checkbox]:checked');
	function wf(el) {
		filterMaps.push(new FilterMap(el.getAttribute("id"), el.getAttribute("data-filter_op"), el.getAttribute("data-filter_val")));
	}
	comorbidityList.forEach(wf);
	symptomList.forEach(wf);
	var newFilter = new Filter(label, filterMaps, filterList.length);
	data.prepareFilteredData(newFilter);
	filterList.push(newFilter); 
	document.getElementById("filter-gen").reset();
	document.getElementById("filter-list").style.backgroundColor = "#58ff58";
	document.getElementById("filter-list").style.transition = "background 0.2s ease-in-out";
	document.getElementById("filter-list").style.backgroundColor = "transparent";
}
	
	

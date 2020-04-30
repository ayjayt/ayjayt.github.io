// assignUIEvents is run on body load to construct the ui
function assignUIEvents() {
	document.getElementById("filter-gen").addEventListener("submit", (e) => {
		e.preventDefault();
		data.userAddFilter();
		document.getElementById("filter-gen").reset();
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
		if (filterList.value) { // TODO NOTE should probably return ID
			data.userRemoveFilter(filterList.value);
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


	
	

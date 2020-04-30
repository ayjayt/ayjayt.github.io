// assignUIEvents is run on body load to construct the ui
function assignUIEvents() {
	document.getElementById("filter-gen").addEventListener("submit", (e) => {
		e.preventDefault();
		if (!data.userAddFilter()) {
			return;
		}
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
		var filterList = document.querySelector(".filter-list-option.active");
		if ((filterList == null) || (filterList.length == 0)) return "";
		data.userRemoveFilter(filterList.getAttribute("data-id"));
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
	document.getElementById("share").addEventListener("click", async event => {
		var command = LZString.compressToEncodedURIComponent(JSON.stringify(data.appliedFilterList, ["label", "filter", "positive", "negative", "filterMaps", "key", "op", "val"]));
		// TODO: simple static dictionary compression would shave off 15%
		var link = window.location.href.split('?')[0] + "?filters=" + command;
		iflog(link);
		if (!navigator.clipboard) {
			// TODO: ERROR
			return;
		}
		const text = link;
		try {
			await navigator.clipboard.writeText(text);
			event.target.textContent = 'copied';
			window.setTimeout( (e) => {
				e.target.textContent = "custom link";
			}, 2000, event);
		} catch (err) {
			console.error('Failed to copy!', err);
		}
	});
}



	
	

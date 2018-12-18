chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Reload Success");
		// ----------------------------------------------------------
		if(sessionStorage.autoReloadInProgress) {
			const goToReloadPage = document.querySelector('li a.a-link-normal');
			goToReloadPage.click();

		}
		


		

	}
	}, 10);
});
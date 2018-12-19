// Reload Success
// Injected on success page when reload is complete, to redirect back to reload page
chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			if (sessionStorage.autoReloadInProgress) {
				const goToReloadPage = document.querySelector('li a.a-link-normal');
				goToReloadPage.click();
			}

		}
	}, 10);
});
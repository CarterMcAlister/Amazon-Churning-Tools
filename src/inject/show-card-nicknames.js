// Reload Success
// Injected on success page when reload is complete, to redirect back to reload page
chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
            if(document.querySelector('.pmts-instrument-detail-rows')) {
                Utilities.setCardNicknames('.pmts-instrument-detail-rows', '.pmts-instrument-display-name', '.pmts-instrument-number-tail:nth-child(2)');

            } else if(document.querySelector('.a-row.card-info')) {
                Utilities.setCardNicknames('.a-row.card-info', '#credit-card-name', 'span:nth-of-type(2)');
            }

		}
	}, 10);
});
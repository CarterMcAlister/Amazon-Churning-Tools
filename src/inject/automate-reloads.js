// Automate Reloads
chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			
			const reloadPane = document.querySelector('#asv-manual-reload-form');
			const reloadAmountField = document.querySelector('#asv-manual-reload-amount');

			// Terminates if reload section is not present
			if(!reloadPane) {
				return;
			}

			// Continues reload if in progress, or adds auto reload button to page
			if (sessionStorage.autoReloadInProgress) {
				doReload(reloadAmountField);

			} else {
				createAutoReloadBtn(reloadPane, reloadAmountField);

			}

		}
	}, 10);
});

// Adds reload button to the page and binds onclick event
function createAutoReloadBtn(reloadPane, reloadAmountField) {
	Utilities.createElement(reloadPane,
		`<input class="js-num-of-reloads a-spacing-small a-button-span4" type="number" placeholder="Number of reloads" />
		 <span class="a-button a-spacing-small a-button-span4 a-button-primary proceed-to-checkout js-do-reload">
			 <span class="a-button-inner">
				 <span class="a-button-text">Do Auto Reloads</span>
			 </span>
		 </span>`
	);

	const doReloadBtn = document.querySelector('.js-do-reload');
	const numOfReloads = document.querySelector('.js-num-of-reloads');

	// When reload button is clicked, set up session variables and perform reload
	doReloadBtn.onclick = () => {
		sessionStorage.autoReloadInProgress = true;
		sessionStorage.autoReloadMax = numOfReloads.value || 1;
		sessionStorage.reloadAmount = reloadAmountField.value || 0;

		doReload(reloadAmountField);
	}

}

function doReload(reloadAmountField) {
	const reloadIteration = parseInt(sessionStorage.autoReloadIteration) || 0;
	const autoReloadMax = parseInt(sessionStorage.autoReloadMax) || 0;

	// Do reload
	if (autoReloadMax > reloadIteration) {
		const formSubmitButton = document.querySelector('#form-submit-button');

		reloadAmountField.value = sessionStorage.reloadAmount || 0;
		reloadAmountField.click();

		sessionStorage.autoReloadIteration = reloadIteration + 1;
		formSubmitButton.click();

	// End reload sequence
	} else {
		alert(`'Reload Sequence Complete! ${sessionStorage.reloadAmount} reloads performed.`);
		sessionStorage.removeItem('autoReloadInProgress');
		sessionStorage.removeItem('autoReloadMax');
		sessionStorage.removeItem('reloadAmount');
		sessionStorage.removeItem('autoReloadIteration');
	}

}

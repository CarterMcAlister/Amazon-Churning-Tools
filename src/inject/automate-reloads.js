// Automate Reloads
chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			
			const reloadPane = document.querySelector('#asv-manual-reload-form');

			if(!reloadPane) {
				return;
			}

			Utilities.createElement(reloadPane,
				`<input class="js-num-of-reloads a-spacing-small a-button-span4" type="number" placeholder="Number of reloads"/>
					<span class="a-button a-spacing-small a-button-span4 a-button-primary proceed-to-checkout js-do-reload">
						<span class="a-button-inner">
							<span class="a-button-text">Do Auto Reloads</span>
						</span>
					</span>`
			);

			const doReloadBtn = document.querySelector('.js-do-reload');
			const numOfReloads = document.querySelector('.js-num-of-reloads');

			const amznSubmitBtn = document.querySelector('#form-submit-button');
			const amznReloadAmnt = document.querySelector('#asv-manual-reload-amount');

			//deselect 100 as default
			amznReloadAmnt.value = 0;
			amznReloadAmnt.click();
			reloadPane.click();

			//continue reloads
			if (sessionStorage.autoReloadInProgress) {
				console.log('continue reloads')
				doReload();
			}

			doReloadBtn.onclick = () => {
				console.log(doReloadBtn, numOfReloads.value, 'test')
				sessionStorage.autoReloadInProgress = true;
				sessionStorage.autoReloadMax = numOfReloads.value || 1;
				sessionStorage.reloadAmount = amznReloadAmnt.value || 0;

				const reloadIteration = parseInt(sessionStorage.autoReloadIteration) || 0;
				sessionStorage.autoReloadIteration = reloadIteration + 1;

				amznSubmitBtn.click();

			}

			function doReload() {
				const reloadIteration = parseInt(sessionStorage.autoReloadIteration) || 0;
				const autoReloadMax = parseInt(sessionStorage.autoReloadMax) || 0;

				amznReloadAmnt.value = sessionStorage.reloadAmount || 0;
				amznReloadAmnt.click();

				if (autoReloadMax > reloadIteration) {
					sessionStorage.autoReloadIteration = reloadIteration + 1;
					amznSubmitBtn.click();

				} else {
					alert(`'Reload Sequence Complete! ${sessionStorage.reloadAmount} reloads performed.`);
					sessionStorage.removeItem('autoReloadInProgress');
					sessionStorage.removeItem('autoReloadMax');
					sessionStorage.removeItem('reloadAmount');
					sessionStorage.removeItem('autoReloadIteration');
				}

			}
		}
	}, 10);
});
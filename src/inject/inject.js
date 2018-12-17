chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

		const createElement = (html, parent) => {
			const createdElement = document.createRange().createContextualFragment(html);
			parent.appendChild(createdElement);
		}

		const reloadPane = document.querySelector('#asv-manual-reload-form');

		if(reloadPane) {
			createElement(
				`<div>
					<input class="js-num-of-reloads" type="number"/>
					<button class="js-do-reload">Do Reload</button>
				</div>`, 
			reloadPane);

			const doReloadBtn = document.querySelector('.js-do-reload');
			const numOfReloads = document.querySelector('.js-num-of-reloads').value;

			console.log(doReloadBtn, numOfReloads)
		}


		

	}
	}, 10);
});
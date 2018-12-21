// Payment Method Nicknames
chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {const cardNames = document.querySelectorAll('.pmts-cc-detail');
            cardNames.forEach((card)=>{
                const cardName = card.querySelector('.pmts-cc-issuer-name');
                const cardLastFour = card.querySelector('.pmts-cc-number');
                console.log(cardLastFour);

                cardName.textContent = getCardNickname(cardLastFour);
                
            })
			clearInterval(readyStateCheckInterval);
            console.log('nn')

            const cardNames = document.querySelectorAll('.pmts-cc-detail');
            cardNames.forEach((card)=>{
                const cardName = card.querySelector('.pmts-cc-issuer-name');
                const cardLastFour = card.querySelector('.pmts-cc-number');
                console.log(cardLastFour);

                cardName.textContent = getCardNickname(cardLastFour);
                
            })

            function getCardNickname(cardLastFour){
                return 'nickname'
            }

		}
	}, 10);
});
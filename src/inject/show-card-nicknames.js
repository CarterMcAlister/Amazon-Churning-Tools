// Shows card nicknames on relevant pages
chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            
            setCardNicknames(...setCardSectionSelectors());

		}
	}, 10);
});


function setCardSectionSelectors() {
    let cardSectionSelector = null;
    let cardDigitsSelector = null;
    let cardNameSelector = null;

    if(document.querySelector('.pmts-instrument-detail-rows')) {
        cardSectionSelector = '.pmts-instrument-detail-rows';
        cardNameSelector = '.pmts-instrument-display-name';
        cardDigitsSelector = '.pmts-instrument-number-tail:nth-child(2)';

    } else if(document.querySelector('.a-row.card-info')) {
        cardSectionSelector = '.a-row.card-info';
        cardNameSelector = '#credit-card-name';
        cardDigitsSelector = 'span:nth-of-type(2)';

    } else if(document.querySelector('.pmts-cc-detail')) {
        // Reload Page
        cardSectionSelector = '.pmts-cc-detail';
        cardNameSelector = '.pmts-cc-issuer-name';
        cardDigitsSelector = '.pmts-cc-number';
    }

    if(cardSectionSelector) {
        return [cardSectionSelector, cardDigitsSelector, cardNameSelector]
    }
}

function getCardDigits() {
    const [ cardSectionSelector, cardDigitsSelector ] = setCardSectionSelectors();

    const cards = document.querySelectorAll(cardSectionSelector);
    const cardDigits = [];
    cards.forEach((card) => {
        const cardLastFour = card.querySelector(cardDigitsSelector).textContent.replace('ending in ', '').trim();
        cardDigits.push(cardLastFour);
    })

    console.log(cardDigits)
	chrome.runtime.sendMessage({
		action: "getCardDigits",
		numbers: cardDigits
	});
}

function setCardNicknames(cardSectionSelector, cardDigitsSelector, cardNameSelector) {
    const cardNames = document.querySelectorAll(cardSectionSelector);

    chrome.storage.sync.get(['cardData'], (result) => {
        console.log('savedData', result.cardData);
        const {cardData} = result;
        cardNames.forEach((card) => {
            const cardName = card.querySelector(cardNameSelector);

            let cardLastFour = card.querySelector(cardDigitsSelector).textContent;
            cardLastFour = forge_sha256(cardLastFour.replace('ending in ', '').trim());
            console.log(cardName, cardLastFour)

            const cardNickname = cardData[cardLastFour];

            if(cardNickname) {
                cardName.textContent = cardNickname;
            }

        })
    })

}
// Shows card nicknames on relevant pages
chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            
            setCardNicknames(...setCardSectionSelectors());
		}
	}, 10);
});

// Determines current page and sets the appropriate selectors
function setCardSectionSelectors() {
    let cardSectionSelector = null;
    let cardDigitsSelector = null;
    let cardNameSelector = null;

    if(document.querySelector('.pmts-instrument-detail-rows')) {
        // Wallet Page
        cardSectionSelector = '.pmts-instrument-detail-rows';
        cardNameSelector = '.pmts-instrument-display-name';
        cardDigitsSelector = '.pmts-instrument-number-tail:nth-child(2)';

    } else if(document.querySelector('.a-row.card-info')) {
        // Checkout Page
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
    } else {
        return [];
    }
}

// Gets last four of cc and sends to extension popup
function getCardsOnPage() {
    const [ cardSectionSelector, cardDigitsSelector ] = setCardSectionSelectors();

    const cards = document.querySelectorAll(cardSectionSelector);
    const cardDigits = [];
    cards.forEach((card) => {
        const cardLastFour = card.querySelector(cardDigitsSelector).textContent;
        cardDigits.push( formatCardDigits(cardLastFour) );
    })

    console.log(cardDigits)
	chrome.runtime.sendMessage({
		action: "getCardsOnPage",
		numbers: cardDigits
	});
}

// Retrieves card nicknames and sets any avaliable
function setCardNicknames(cardSectionSelector, cardDigitsSelector, cardNameSelector) {
    const cardNames = document.querySelectorAll(cardSectionSelector);

    chrome.storage.sync.get(['cardData'], (result) => {
        console.log('savedData', result);
        const {cardData} = result;
        cardNames.forEach((card) => {
            const cardName = card.querySelector(cardNameSelector);

            const cardLastFour = card.querySelector(cardDigitsSelector).textContent;
            const cardLastFourHash = forge_sha256( formatCardDigits(cardLastFour) );
            console.log(cardName, cardLastFourHash)

            const cardNickname = cardData[cardLastFourHash];

            if(cardNickname) {
                cardName.textContent = cardNickname;
            }

        })
    })

}

// Returns last four digits of cc without surrounding text
const formatCardDigits = cardDigitsString => cardDigitsString.replace('ending in ', '').trim();

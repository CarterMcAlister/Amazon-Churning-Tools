initialize();

// When popup is opened, it is populated with cards on the page and any saved nickname 
function initialize() {
    const parentNode = document.querySelector('.js-contents-parent');
    const messageText = document.querySelector('.js-placeholder-text');

    const saveBtn = document.querySelector('.js-save-values');
    saveBtn.addEventListener('click', saveValues);

    chrome.tabs.executeScript(null, {
        code: "getCardsOnPage()"
    })

    chrome.runtime.onMessage.addListener(function(request, sender) {
        if (request.action == "getCardsOnPage" && request.numbers) {
            chrome.storage.sync.get(['cardData'], ({cardData}) => {
                request.numbers.forEach((cardNumber) => {
                    const cardHash = forge_sha256(cardNumber);
                    const cardNickname = cardData[cardHash] || '';

                    addRow(cardNumber, cardNickname, parentNode);
                })
            })

            saveBtn.classList.remove('hidden');
            messageText.classList.add('hidden');
            
        }
    })
}

// Adds card name and number row to popup
function addRow(cardNumber, cardNickname, parent) {
    Utilities.createElement(parent,
        `<div class="card-row">
            <label class="card-last-four">${cardNumber}</label>
            <input class="card-nickname" placeholder="Nickname" value="${cardNickname}" />
         </div>`
    );
}

// Saves object of card digits and nicknames to chrome storage
function saveValues() {

    const cardList = document.querySelectorAll('.card-row');
    const cardData = {};
    cardList.forEach((cardRow) => {
        const cardDigitsHash = forge_sha256(cardRow.querySelector('.card-last-four').textContent);
        const cardNickname = cardRow.querySelector('.card-nickname').value;

        if(cardNickname) {
            cardData[cardDigitsHash] = cardNickname;
        }
    })

    chrome.storage.sync.set({ cardData: cardData }, () => {
        const messageText = document.querySelector('.js-placeholder-text');
        messageText.textContent = 'Card Nicknames Saved!';
        messageText.classList.remove('hidden');
    })
}

const rowParent = document.querySelector('.js-row-parent');
const saveBtn = document.querySelector('.js-save-values');
saveBtn.addEventListener('click', saveValues);


restoreValues();

getCardsOnPage();

//restoreValues();
console.log('popup')

// Get card numbers on the page
chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log(request)
    // Get stored card data
    if (request.action == "getCardDigits" && request.numbers) {
        chrome.storage.sync.get(['cardData'], (result) => {
            console.log('savedData', result.cardData);
            request.numbers.forEach((cardNumber) => {
                const cardHash = Utilities.forge_sha256(cardNumber);
                const cardNickname = result.cardData[cardHash] || '';
                console.log(cardHash, cardNickname)
                addRow(cardNumber, cardNickname);
            })
        })
        console.log(request.numbers)
        
    } else {
        rowParent.textContent = 'No cards found on this page.'
    }
})

// fn start
function addRow(cardNumber, cardNickname) {

    Utilities.createElement(rowParent,
        `<div class="card-row card-${cardNumber}">
            <label class="card-last-four">${cardNumber}</label>
            <input class="card-nickname" placeholder="Nickname" value="${cardNickname}" />
         </div>`);

}

function saveValues() {
    const cardList = document.querySelectorAll('.card-row');
    console.log(cardList)
    let cardData = {};
    cardList.forEach((cardRow) => {
        const cardDigitsHash = Utilities.forge_sha256(cardRow.querySelector('.card-last-four').textContent);
        const cardNickname = cardRow.querySelector('.card-nickname').value;

        if(cardNickname) {
            cardData[cardDigitsHash] = cardNickname;
        }
    })
    console.log(cardData)
    chrome.storage.sync.set({
        cardData: cardData
    }, () => {
        console.log('object is ', cardData);
    })
}

function restoreValues() {
    chrome.storage.sync.get(['cardData'], (result) => {
        console.log('object is ', result.cardData);
        cardData = result.cardData;
    })
}

function getCardsOnPage() {
    chrome.tabs.executeScript(null, {
        code: "getCardDigits();"
    })
}


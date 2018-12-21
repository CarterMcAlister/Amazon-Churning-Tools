const rowParent = document.querySelector('.js-row-parent');
const saveBtn = document.querySelector('.js-save-values');
saveBtn.addEventListener('click', saveValues);

let cardData = [];


restoreValues();

getCardsOnPage();

//restoreValues();
console.log('popup')

//Listeners
chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log(request)
    if (request.action == "getCardDigits" && request.numbers) {
        console.log(request.numbers)
        request.numbers.forEach((cardNumber) => {
            addRow(cardNumber);
        })
    } else {
        rowParent.textContent = 'No cards found on this page.'
    }
})

// fn start
function addRow(cardNumber) {

    const uniqueGuid = 'row-' + Utilities.generateGuid();

    Utilities.createElement(rowParent,
        `<div class="card-row ${uniqueGuid}">
            <label class="card-last-four">${cardNumber}</label>
            <input class="card-nickname" placeholder="Nickname" />
         </div>`);

    console.log('.' + uniqueGuid)

    const newRow = document.querySelector(`.${uniqueGuid}`);

    //const savedNickname = 

    //return newRow;

}

function saveValues() {
    rowList = document.querySelectorAll('.card-row');
    console.log(rowList)
    let cardData = [];
    rowList.forEach((cardRow) => {
        let card = {};
        card.digits = cardRow.querySelector('.card-last-four').value;
        card.nickname = cardRow.querySelector('.card-nickname').value;
        console.log(card.digits)
        if (card.digits || card.nickname) {
            cardData.push(card);
        }
    })
    console.log(cardData)
    chrome.storage.sync.set({
        cardData: cardData
    }, () => {
        console.log('object is ', cardData);
    })
}

function saveValues() {
    const cardList = document.querySelectorAll('.card-row');
    console.log(cardList)
    let cardData = {};
    cardList.forEach((cardRow) => {
        const nickname = cardRow.querySelector('.card-nickname').value;
        let lastFourDigits = cardRow.querySelector('.card-last-four').textContent;

        if(nickname) {
            lastFourDigits = Utilities.hash(lastFourDigits);
            cardData[lastFourDigits] = nickname;
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


const rowParent = document.querySelector('.js-row-parent');

const addRowBtn = document.querySelector('.js-add-row');
const saveBtn = document.querySelector('.js-save-values');

const cardDigitsPlaceholder = '\u2022\u2022\u2022\u2022';

console.log(addRowBtn, saveBtn, rowParent)

addRowBtn.addEventListener('click', addRow);
saveBtn.addEventListener('click', saveValues);

restoreValues();

let rowList = [];

function addRow() {

    const uniqueGuid = 'row-' + Utilities.generateGuid();

    Utilities.createElement(rowParent,
        `<div class="card-row ${uniqueGuid}">
            <input class="card-last-four" />
            <input class="card-nickname" />
            <button class="js-remove-row">x</button>
         </div>`);

    console.log('.' + uniqueGuid)

    const newRow = document.querySelector(`.${uniqueGuid}`);

    const removeBtn = newRow.querySelector('.js-remove-row');

    removeBtn.addEventListener('click', removeRow, false);

    return newRow;

}


function removeRow() {
    this.parentNode.remove();
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

function restoreValues() {
    chrome.storage.sync.get(['cardData'], (result) => {
        console.log('object is ', result.cardData);
        result.cardData.forEach((card) => {
            const cardRow = addRow();

            const cardDigits = cardRow.querySelector('.card-last-four');
            const cardNickname = cardRow.querySelector('.card-nickname');

            if (card.digits) {
                cardDigits.value = cardDigitsPlaceholder;
            }

            cardNickname.value = card.nickname;
        })
    })
}
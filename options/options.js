const rowParent = document.querySelector('.js-row-parent');

const addRowBtn = document.querySelector('.js-add-row');
const saveBtn = document.querySelector('.js-save-values');

console.log(addRowBtn, saveBtn, rowParent)

addRowBtn.addEventListener('click', addRow);
saveBtn.addEventListener('click', saveValues);

restoreValues()

    let rowList = [];

    function addRow(){
        Utilities.createElement(rowParent, 
        `<div class="card-row">
            <input class="card-last-four" />
            <input class="card-nickname" />
            <button class="js-remove-row">x</button>
         </div>`);

        const newRow = document.querySelector('.card-row');

        const removeBtn = newRow.querySelector('.js-remove-row'); //left off here - fix 

        removeBtn.addEventListener('click', removeRow, false);

        return newRow;
        
    }

    var removeRow = () => this.parentNode.remove();

    function saveValues() {
        rowList = document.querySelectorAll('.card-row');
        console.log(rowList)
        let cardData = [];
        rowList.forEach((cardRow)=>{
            let card = {};
            card.digits = cardRow.querySelector('.card-last-four').value;
            card.nickname = cardRow.querySelector('.card-nickname').value;
            cardData.push(card);
        })
        console.log(cardData)
        chrome.storage.sync.set({cardData: cardData}, function() {
          console.log('object is ', cardData);
        })
    }

    function restoreValues() {
        chrome.storage.sync.get(['cardData'], function(result) {
            console.log('object is ', result.cardData);
            result.cardData.forEach((card)=>{
                const cardRow = addRow();

                const cardDigits = cardRow.querySelector('.card-last-four');
                const cardNickname = cardRow.querySelector('.card-nickname');

                cardDigits.value = card.digits;
                cardNickname.value = card.nickname;
            })
          })
    }
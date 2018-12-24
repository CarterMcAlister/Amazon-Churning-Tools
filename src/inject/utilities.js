// Utilities
// IIFE injected before other scripts to be called by them.
var Utilities = (function () {

    var createElement = function (parentEl, html) {
        const createdElement = document.createRange().createContextualFragment(html);
        parentEl.appendChild(createdElement);
    }

    var whenElementReady = function (selector, delay) {
        return new Promise((resolve, reject) => {
            let el = document.querySelector(selector);

            if (el) {
                resolve(el);
            }
            new MutationObserver((mutationRecords, observer) => {
                    // Query for elements matching the specified selector
                    Array.from(document.querySelectorAll(selector)).forEach((element) => {
                        setTimeout(function () {
                            resolve(element)
                        }, delay);

                        //Once we have resolved we don't need the observer anymore.
                        observer.disconnect();
                    });
                })
                .observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
        });
    }

    const setCardNicknames = function (cardSectionSelector, cardNameSelector, cardDigitsSelector) {
        const cardNames = document.querySelectorAll(cardSectionSelector);

        chrome.storage.sync.get(['cardData'], (result) => {
            console.log('savedData', result.cardData);
            const {cardData} = result;
            cardNames.forEach((card) => {
                const cardName = card.querySelector(cardNameSelector);

                let cardLastFour = card.querySelector(cardDigitsSelector).textContent;
                cardLastFour = hash(cardLastFour.replace('ending in ', ''));
                console.log(cardName, cardLastFour)

                
                const cardNickname = cardData[cardLastFour];

                if(cardNickname) {
                    cardName.textContent = cardNickname;
                }
    
    
    
            })
        })


        
    }

    // makes array of card digits and returns
    const getCardDigits = function (cardSectionSelector, cardDigitsSelector) {
        const cards = document.querySelectorAll(cardSectionSelector);
        let cardDigits = [];
        cards.forEach((card) => {
            const cardLastFour = card.querySelector(cardDigitsSelector).textContent.replace('ending in ', '');
            cardDigits.push(cardLastFour);
        })
        
        return cardDigits;
    }

    const hash = function (value) {
        return value.split('').reduce((prevHash, currVal) =>
            (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);     
    }

    const generateGuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    return {
        createElement: createElement,
        whenElementReady: whenElementReady,
        setCardNicknames: setCardNicknames,
        hash: hash,
        generateGuid: generateGuid,
        getCardDigits: getCardDigits
    }
})()

// Utilities Internal Functions

function getCardNickname(lastFourString) {
    const cardLastFour = lastFourString.replace('ending in ', '');
    return cardLastFour;
}

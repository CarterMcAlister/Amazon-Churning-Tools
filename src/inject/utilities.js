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
        cardNames.forEach((card) => {
            const cardName = card.querySelector(cardNameSelector);
            const cardLastFour = card.querySelector(cardDigitsSelector).textContent;

            console.log(cardName, cardLastFour)

            cardName.textContent = getCardNickname(cardLastFour);
            
            
        })
    }

    const hash = function (value) {
        return value.split('').reduce((prevHash, currVal) =>
            (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);     
    }

    return {
        createElement: createElement,
        whenElementReady: whenElementReady,
        setCardNicknames: setCardNicknames,
        hash: hash
    }
})()

// Utilities Internal Functions

function getCardNickname(lastFourString) {
    const cardLastFour = lastFourString.replace('ending in ', '');
    return cardLastFour;
}
// Utilities - Shared helper methods
var Utilities = (function () {

    // Takes an HTML string and appends it to the specified DOM element
    var createElement = function (parentEl, html) {
        const createdElement = document.createRange().createContextualFragment(html);
        parentEl.appendChild(createdElement);
    }

    // Polls element to see if it exists, resolves when element is found
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

                    // Once we have resolved we don't need the observer anymore.
                    observer.disconnect();
                });
            })
            .observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        });
    }

    return {
        createElement: createElement,
        whenElementReady: whenElementReady
    }
})();

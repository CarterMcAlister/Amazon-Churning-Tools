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

    return {
        createElement: createElement,
        whenElementReady: whenElementReady
    }
})()
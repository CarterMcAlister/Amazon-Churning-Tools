// Archive Orders
// Injected on the Amazon order history page
// Uses Utilities from utilities.js
chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            if (sessionStorage.archiveInProgress) {
                if (sessionStorage.archivePage != window.location.href) {
                    window.location.href = sessionStorage.archivePage;
                } else {
                    archiveGiftCardReloadOrders();
                }
            } else {
                initalize();
            }

            // Adds archive button to top of page and binds click event.
            function initalize() {
                const topSection = document.querySelector('.a-spacing-base');

                Utilities.createElement(topSection,
                    `<span class="a-button a-button-normal a-button-base nav-genz-promo">
                        <span class="a-button-inner">
                            <a class="a-button-text js-archive-orders" role="button">Archive reload orders</a>
                        </span>
                     </span>`
                );

                const archiveOrdersBtn = document.querySelector('.js-archive-orders');

                archiveOrdersBtn.onclick = () => {
                    sessionStorage.archiveInProgress = true;
                    sessionStorage.archivePage = window.location.href;
                    archiveGiftCardReloadOrders();
                }
            }

            // Gets array of order: returns matching order element if found, returns false otherwise
            function getReloadOrder() {
                const orders = document.querySelectorAll(".order");

                for (let i = 0; i < orders.length; i++) {
                    const order = orders[i];
                    let orderTitle = order.querySelector(".a-fixed-left-grid-inner .a-row .a-link-normal");

                    if (orderTitle && orderTitle.textContent.trim() == "Amazon.com Gift Card Balance Reload") {
                        return order;
                    }
                }
                return false;
            }

            // If valid order is found on page, order is archived.
            function archiveGiftCardReloadOrders() {
                const order = getReloadOrder();

                if (order) {
                    order.querySelector(".a-button-text").click();
                    Utilities.whenElementReady('input[value=archiveOrder]', 200).then((archiveBtn) => {
                        archiveBtn.click();
                    });
                } else {
                    sessionStorage.removeItem('archiveInProgress');
                    sessionStorage.removeItem('archivePage');
                    alert('All orders on this page have been archived!');
                }
            }

        }
    }, 10);
});
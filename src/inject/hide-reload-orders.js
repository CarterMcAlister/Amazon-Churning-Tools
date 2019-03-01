// Hide Gift Card Reload Orders 
// Used on Order History to hide gift card reload orders, without archiving them
chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            hideReloadOrders()
        }
    }, 10);
});

// Gets array of orders: returns matching order element if found, returns false otherwise
function hideReloadOrders() {
    const orders = document.querySelectorAll(".order");

    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let orderTitle = order.querySelector(".a-fixed-left-grid-inner .a-row .a-link-normal");

        if (orderTitle && orderTitle.textContent.trim() == "Amazon.com Gift Card Balance Reload") {
            order.style.display = "none";
        }
    }
    return false;
}

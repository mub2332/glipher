chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "load") {
        var max = $(".ytp-progress-bar").attr("aria-valuemax");
        var current = $(".ytp-progress-bar").attr("aria-valuenow");
        sendResponse({ max, current });
    }
});

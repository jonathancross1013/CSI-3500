chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "popupOpened") {
        // Send the selected text to the popup
        sendResponse({ selectedText: window.getSelection().toString() });
    } else if (request.action === "getCategories") {
        // Fetch categories from Chrome storage and send to the popup
        chrome.storage.sync.get({categories: []}, function(data) {
            sendResponse({ categories: data.categories });
        });
        return true; // Indicates that the response is asynchronous
    }
});

// Listen for messages from your web page to update categories
window.addEventListener('message', function(event) {
    if (event.source == window && event.data.type && (event.data.type == 'UPDATE_CATEGORIES')) {
        updateChromeStorageWithCategory(event.data.categoryName);
    }
});

function updateChromeStorageWithCategory(categoryName) {
    chrome.storage.sync.get({categories: []}, function(data) {
        let categories = data.categories;
        if(categories.indexOf(categoryName) === -1) {
            categories.push(categoryName);
            chrome.storage.sync.set({categories: categories}, function() {
                console.log('Categories updated with:', categoryName);
            });
        }
    });
}

// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const referenceContent = document.getElementById('reference-content');
    const saveButton = document.getElementById('save-reference');

    // Retrieve the selected text from local storage immediately when the popup opens
    chrome.storage.local.get(['selectedText'], function(result) {
        if (result.selectedText) {
            referenceContent.value = result.selectedText;
            // Optionally clear the selectedText from storage after retrieving it
            chrome.storage.local.remove(['selectedText']);
        }
    });

chrome.storage.sync.get('categories', function(data) {
    if (data.categories) {
        updateDropdown(data.categories); // Function to update the dropdown
    }
});

function updateDropdown(categories) {
    const dropdown = document.getElementById('your-dropdown-id');
    categories.forEach(category => {
        let option = document.createElement('option');
        option.value = category.value;
        option.textContent = category.label;
        dropdown.appendChild(option);
    });
}


    // Save reference data when save button is clicked
    saveButton.addEventListener('click', function() {
        const name = document.getElementById('reference-name').value;
        const content = referenceContent.value; // This should be filled from local storage
        const category = document.getElementById('reference-category').value;

        // Send the reference data to the content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "FROM_POPUP",
                data: { name, content, category }
            });
        });
    });
});


window.onload = function () {
    var savedTabs = JSON.parse(localStorage.getItem('tabs')) || [];
    savedTabs.forEach(function (tabName) {
        createNewTab(tabName);
    });
    populateSubcategorySelect();
};

function saveTabsToStorage() {
    var categoryTexts = document.querySelectorAll('.tablinks.subtablinks .category-text');
    var tabNames = Array.from(categoryTexts).map(function (span) {
        return span.textContent.trim();
    });
    localStorage.setItem('tabs', JSON.stringify(tabNames));
}


function populateSubcategorySelect() {
    var subcategories = document.querySelectorAll('.subtablinks .category-text');
    var select = document.getElementById('subcategorySelect');
    select.innerHTML = ""; // Clear the current options
    subcategories.forEach(function(subcategory) {
        var option = document.createElement('option');
        option.value = subcategory.textContent.trim().toLowerCase().replace(/\s+/g, '');
        option.textContent = subcategory.textContent.trim();
        select.appendChild(option);
    });
}

function sendCategoriesToExtension() {
    // Assuming 'category-container' is the ID of the element where categories are managed
    var categoryElement = document.getElementById('category-container');
    if (categoryElement) {
        try {
            var categories = []; // Logic to fetch categories from local storage
            window.postMessage({ type: "SEND_CATEGORIES", categories: categories }, "*");
        } catch (error) {
            console.error("Error sending categories to extension:", error);
        }
    }
}


function toggleSubTab(subtabName) {
    var subtab = document.getElementById(subtabName);
    if (subtab.style.display === 'none' || subtab.style.display === '') {
        subtab.style.display = 'block';
    } else {
        subtab.style.display = 'none';
    }
}


function toggleTabContent(tabId) {
    var content = document.getElementById(tabId);
    
    // If the content is already visible, hide it
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        // Hide all tabcontent elements
        var tabcontents = document.getElementsByClassName("tabcontent");
        for (var i = 0; i < tabcontents.length; i++) {
            tabcontents[i].style.display = "none";
        }
        
        // Show the clicked tab's content
        content.style.display = "block";
    }
}

// Attach the toggle function to the main category buttons
var mainCategoryButtons = document.getElementsByClassName("main-category");
for (var i = 0; i < mainCategoryButtons.length; i++) {
    mainCategoryButtons[i].addEventListener('click', function() {
        var contentId = this.getAttribute('data-content-id');
        toggleTabContent(contentId);
    });
}


function toggleSubTabContent(subTabId) {
    var i, subtabcontent;

    // Get all elements with class="subtabcontent" and toggle their display
    subtabcontent = document.getElementsByClassName("subtabcontent");
    for (i = 0; i < subtabcontent.length; i++) {
        // If it's the subtab we're interested in, toggle it. Otherwise, hide it.
        if (subtabcontent[i].id === subTabId) {
            subtabcontent[i].style.display = subtabcontent[i].style.display === 'block' ? 'none' : 'block';
        } else {
            subtabcontent[i].style.display = 'none';
        }
    }
}



function generateNewCategory() {
    var categoryName = prompt("Enter the name for the new category:");
    if (categoryName) {
        createNewTab(categoryName);
    }
}

function createNewTab(categoryName) {
    var tabContainer = document.createElement("div");
    var newTabContent = document.createElement("div");
    var categoryText = document.createElement("span"); // Create a span for the category name
    
    categoryText.textContent = categoryName;
    categoryText.className = "category-text"; // Assign a class name if you want to style it

    tabContainer.className = "tablinks subtablinks";
    tabContainer.appendChild(categoryText); // Append the category name span to the container
    tabContainer.onclick = function () {
        openTab(event, categoryName.toLowerCase().replace(/\s+/g, ''));
        openSubTab(event, categoryName.toLowerCase().replace(/\s+/g, ''));

    chrome.storage.sync.get({categories: []}, function(data) {
        let categories = data.categories;
        if(categories.indexOf(categoryName) === -1) { // Avoid duplicates
            categories.push(categoryName);
            chrome.storage.sync.set({categories: categories}, function() {
                console.log('Categories updated with:', categoryName);
            });
        }
    });

};

    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove Category";
    removeButton.className = "remove-button";
    removeButton.onclick = function (event) {
        removeCategory(categoryName);
        event.stopPropagation(); // Prevent the tab click event from firing
    };

    tabContainer.appendChild(removeButton);
    tabContainer.id = categoryName.toLowerCase().replace(/\s+/g, ''); // Assign unique ID to tab container

    newTabContent.className = "tabcontent subtabcontent";
    newTabContent.innerHTML = "<h2>Content for " + categoryName + " tab goes here.</h2>";
    newTabContent.id = categoryName.toLowerCase().replace(/\s+/g, '') + "-content"; // Assign unique ID to tab content

    document.querySelector('#creator-content').appendChild(tabContainer); // Append to creator mode tab container
    document.querySelector('#creator-content').appendChild(newTabContent); // Append to creator mode tab content
}



function removeCategory(categoryName) {
    var tabContainerToRemove = document.getElementById(categoryName.toLowerCase().replace(/\s+/g, ''));
    if (tabContainerToRemove) {
        tabContainerToRemove.parentNode.removeChild(tabContainerToRemove);
        saveTabsToStorage();
    }
}

window.addEventListener('beforeunload', saveTabsToStorage);

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openSubTab(evt, subtabName) {
    var i, subtabcontent, subtablinks;
    subtabcontent = document.getElementsByClassName("subtabcontent");
    for (i = 0; i < subtabcontent.length; i++) {
        subtabcontent[i].style.display = "none";
    }
    subtablinks = document.getElementsByClassName("subtablinks");
    for (i = 0; i < subtablinks.length; i++) {
        subtablinks[i].className = subtablinks[i].className.replace(" active", "");
    }
    document.getElementById(subtabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function addButtonToSubcategory() {
    var buttonName = document.getElementById('newButtonName').value.trim();
    var buttonContent = document.getElementById('newButtonContent').value.trim();
    var selectedSubcategory = document.getElementById('subcategorySelect').value;

    if (!buttonName || !buttonContent) {
        alert('Please fill out the name and content for the button.');
        return;
    }

    var newButton = document.createElement('button');
    newButton.textContent = buttonName;
    newButton.onclick = function() {
        alert(buttonContent);
    };

    var subcategoryDiv = document.getElementById(selectedSubcategory);
    if (subcategoryDiv) {
        subcategoryDiv.appendChild(newButton);
    } else {
        alert('Selected sub-category does not exist.');
    }

    // Clear input fields
    document.getElementById('newButtonName').value = '';
    document.getElementById('newButtonContent').value = '';
}


function toggleReferenceDisplay(tabName) {
    var referenceDiv = document.getElementById('generateReference');

    // Check if the clicked tab is the one associated with the generateReference div
    if (tabName === 'generateReference') {
        // Toggle the 'active' class based on whether it's already present
        referenceDiv.classList.toggle('active');
    } else {
        // Ensure the 'active' class is removed if another tab is clicked
        referenceDiv.classList.remove('active');
    }
}


function showMainCategory(category) {
    var mainContent = document.getElementById('main-content');
    var creatorContent = document.getElementById('creator-content');
    var settingsContent = document.getElementById('settings-content');

    mainContent.style.display = 'none';
    creatorContent.style.display = 'none';
    settingsContent.style.display = 'none';

    if (category === 'main') {
        mainContent.style.display = 'block';
    } else if (category === 'creator') {
        creatorContent.style.display = 'block';
    } else if (category === 'settings') {
        settingsContent.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("yourButtonId").addEventListener("click", addButtonToSubcategory);

    var tabLinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].addEventListener('click', function() {
            var tabId = this.getAttribute('data-tab-id');
            toggleTabContent(tabId);


        });
    }
});

function toggleDarkMode() {
    var body = document.body;
    var modeText = document.getElementById('dark-mode-text'); // Assuming you have a span with this id for the text
    var moonIcon = document.querySelector('#dark-mode-toggle .fa-moon');
    var sunIcon = document.querySelector('#dark-mode-toggle .fa-sun');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
        modeText.textContent = 'Light Mode'; // Update text to Light Mode when dark mode is active
    } else {
        localStorage.setItem('darkMode', 'disabled');
        moonIcon.style.display = 'inline-block';
        sunIcon.style.display = 'none';
        modeText.textContent = 'Dark Mode'; // Update text to Dark Mode when light mode is active
    }
}

// Ensure to call toggleDarkMode to set the initial state when the page loads
document.addEventListener('DOMContentLoaded', function() {
    var darkModeButton = document.getElementById('dark-mode-toggle');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }

    // Initialize the correct mode based on the saved setting
    if (localStorage.getItem('darkMode') === 'enabled') {
        toggleDarkMode();
    }
});



// Listen for messages from the extension
window.addEventListener('message', function(event) {
    // Make sure the message is from your extension
    if (event.source == window && event.data.type && (event.data.type == "FROM_EXTENSION")) {
        console.log("Data received from extension:", event.data);
        // Now handle the data, for example, save it to local storage
        const { referenceName, referenceContent, referenceCategory } = event.data;
        saveReference(referenceName, referenceContent, referenceCategory);
    }
});

function saveReference(name, content, category) {
    // Retrieve the current array of references or initialize it if not present
    var references = JSON.parse(localStorage.getItem('references')) || [];
    // Create a new reference object
    var newReference = { name: name, content: content, category: category };
    // Add the new reference to the array
    references.push(newReference);
    // Save the updated array back to local storage
    localStorage.setItem('references', JSON.stringify(references));
}


document.addEventListener('DOMContentLoaded', function() {
  var darkModeToggleButton = document.getElementById('dark-mode-toggle');
  if (darkModeToggleButton) {
    darkModeToggleButton.addEventListener('click', toggleDarkMode);
  }

  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
  }
});

document.addEventListener('DOMContentLoaded', function() {
    var header = document.getElementById('header');
    var colorPicker = document.getElementById('headerColorPicker');
    var changeColorButton = document.getElementById('changeHeaderColorButton');
    
    // Function to update header color
    function updateHeaderColor(color) {
        header.style.backgroundColor = color;
        if (!document.body.classList.contains('dark-mode')) {
            localStorage.setItem('headerColor', color); // Save color to localStorage
        }
    }

    // Load saved color from localStorage and update the header if light mode is active
    var savedColor = localStorage.getItem('headerColor');
    if (savedColor && !document.body.classList.contains('dark-mode')) {
        updateHeaderColor(savedColor);
        colorPicker.value = savedColor; // Update color picker to show the saved color
    }

    // Event listener for the color picker
    colorPicker.addEventListener('input', function() {
        updateHeaderColor(colorPicker.value);
    });

    // Event listener for the button
    changeColorButton.addEventListener('click', function() {
        colorPicker.click(); // Trigger the color picker when the button is clicked
    });
});

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
// Function to toggle dark mode
function toggleDarkMode() {
  var body = document.body;
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
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


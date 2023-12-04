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
    select.innerHTML = "";
    subcategories.forEach(function(subcategory) {
        var option = document.createElement('option');
        option.value = subcategory.textContent.trim().toLowerCase().replace(/\s+/g, '');
        option.textContent = subcategory.textContent.trim();
        select.appendChild(option);
    });
}

function sendCategoriesToExtension() {
    var categoryElement = document.getElementById('category-container');
    if (categoryElement) {
        try {
            var categories = [];
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
    
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        var tabcontents = document.getElementsByClassName("tabcontent");
        for (var i = 0; i < tabcontents.length; i++) {
            tabcontents[i].style.display = "none";
        }
        
        content.style.display = "block";
    }
}

var mainCategoryButtons = document.getElementsByClassName("main-category");
for (var i = 0; i < mainCategoryButtons.length; i++) {
    mainCategoryButtons[i].addEventListener('click', function() {
        var contentId = this.getAttribute('data-content-id');
        toggleTabContent(contentId);
    });
}


function toggleSubTabContent(subTabId) {
    var i, subtabcontent;

    subtabcontent = document.getElementsByClassName("subtabcontent");
    for (i = 0; i < subtabcontent.length; i++) {
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
    var categoryText = document.createElement("span");
    
    categoryText.textContent = categoryName;
    categoryText.className = "category-text";

    tabContainer.className = "tablinks subtablinks";
    tabContainer.appendChild(categoryText);
    tabContainer.onclick = function () {
        openTab(event, categoryName.toLowerCase().replace(/\s+/g, ''));
        openSubTab(event, categoryName.toLowerCase().replace(/\s+/g, ''));

    chrome.storage.sync.get({categories: []}, function(data) {
        let categories = data.categories;
        if(categories.indexOf(categoryName) === -1) {
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
        event.stopPropagation();
    };

    tabContainer.appendChild(removeButton);
    tabContainer.id = categoryName.toLowerCase().replace(/\s+/g, '');

    newTabContent.className = "tabcontent subtabcontent";
    newTabContent.innerHTML = "<h2>Content for " + categoryName + " tab goes here.</h2>";
    newTabContent.id = categoryName.toLowerCase().replace(/\s+/g, '') + "-content";

    document.querySelector('#creator-content').appendChild(tabContainer);
    document.querySelector('#creator-content').appendChild(newTabContent);
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
    var buttonURL = document.getElementById('newButtonURL').value.trim();
    var selectedSubcategory = document.getElementById('subcategorySelect').value;

    if (!buttonName || !buttonContent || !buttonURL) {
        alert('Please fill out the name, content, and URL for the button.');
        return;
    }

    var newButton = document.createElement('button');
    newButton.textContent = buttonName;
    newButton.onclick = function() {
    // Concatenate the content with two line breaks and the URL
    var contentWithLink = buttonContent + "\n\n" + "Source: " + buttonURL;
    alert(contentWithLink);
    };

    var subcategoryDiv = document.getElementById(selectedSubcategory);
    if (subcategoryDiv) {
        subcategoryDiv.appendChild(newButton);
    } else {
        alert('Selected sub-category does not exist.');
    }
    
    // Clear the form fields
    document.getElementById('newButtonName').value = '';
    document.getElementById('newButtonContent').value = '';
    document.getElementById('newButtonURL').value = ''; // Clear the URL field as well
}



function toggleReferenceDisplay(tabName) {
    var referenceDiv = document.getElementById('generateReference');

    if (tabName === 'generateReference') {
        referenceDiv.classList.toggle('active');
    } else {
        
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
    document.getElementById("addReferenceButton").addEventListener("click", addButtonToSubcategory);

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
    var modeText = document.getElementById('dark-mode-text');
    var moonIcon = document.querySelector('#dark-mode-toggle .fa-moon');
    var sunIcon = document.querySelector('#dark-mode-toggle .fa-sun');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
        modeText.textContent = 'Light Mode';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        moonIcon.style.display = 'inline-block';
        sunIcon.style.display = 'none';
        modeText.textContent = 'Dark Mode';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var darkModeButton = document.getElementById('dark-mode-toggle');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }

    if (localStorage.getItem('darkMode') === 'enabled') {
        toggleDarkMode();
    }
});



window.addEventListener('message', function(event) {
    if (event.source == window && event.data.type && (event.data.type == "FROM_EXTENSION")) {
        console.log("Data received from extension:", event.data);
        const { referenceName, referenceContent, referenceCategory } = event.data;
        saveReference(referenceName, referenceContent, referenceCategory);
    }
});

function saveReference(name, content, category) {
    var references = JSON.parse(localStorage.getItem('references')) || [];
    var newReference = { name: name, content: content, category: category };
    references.push(newReference);
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

function toggleSettingsDropdown() {
    var dropdown = document.getElementById('settings-dropdown');
    var isVisible = dropdown.style.display !== 'none';
    dropdown.style.display = isVisible ? 'none' : 'block';
}

function openColorPicker() {
    var colorPicker = document.getElementById('headerColorPicker');
    if (!colorPicker) {
        colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.id = 'headerColorPicker';
        colorPicker.oninput = changeHeaderColor;
        colorPicker.style.display = 'none';
        document.body.appendChild(colorPicker);
    }
    colorPicker.click();
}

function changeHeaderColor(event) {
    var header = document.querySelector('header');
    header.style.backgroundColor = event.target.value;
}

function toggleFontSizeDropdown() {
    // This function will toggle the display of the font size selector dropdown
    var fontSizeDropdown = document.getElementById('fontSizeSelector');
    fontSizeDropdown.style.display = fontSizeDropdown.style.display === 'none' ? 'block' : 'none';
}

function changeFontSize(fontSize) {
    // This function will apply the selected font size to the entire site
    document.documentElement.style.fontSize = fontSize;
}

function openTextColorPicker() {
    var colorPicker = document.getElementById('textColorPicker');
    if (!colorPicker) {
        colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.id = 'textColorPicker';
        colorPicker.oninput = changeTextColor;
        colorPicker.style.display = 'none';
        document.body.appendChild(colorPicker);
    }
    colorPicker.click();
}

function changeTextColor(event) {
    var textColor = event.target.value;
    document.body.style.color = textColor; // Apply color to text
    localStorage.setItem('textColor', textColor); // Save color to localStorage
}

document.addEventListener('DOMContentLoaded', function() {
    var changeTextColorButton = document.getElementById('changeTextColorButton');
    if (changeTextColorButton) {
        changeTextColorButton.addEventListener('click', openTextColorPicker);
    }

    // Load the saved color from localStorage on page load
    var savedColor = localStorage.getItem('textColor');
    if (savedColor) {
        document.body.style.color = savedColor;
    }
});


function openBackgroundColorPicker() {
    var colorPicker = document.getElementById('backgroundColorPicker')
    if (!colorPicker) {
        colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.id = 'backgroundColorPicker';
        colorPicker.oninput = changeBackgroundColor;
        colorPicker.style.display = 'none';
        document.body.appendChild(colorPicker);
    }
    colorPicker.click();
}

function changeBackgroundColor(event) {
    var backgroundColor = event.target.value;
    document.body.style.backgroundColor = backgroundColor; // Apply color to text
    localStorage.setItem('backgroundColor', backgroundColor); // Save color to localStorage
}

document.addEventListener('DOMContentLoaded', function() {
    var changeBackgroundColorButton = document.getElementById('changeBackgroundColorButton');
    if (changeBackgroundColorButton) {
        changeBackgroundColorButton.addEventListener('click', openBackgroundColorPicker);
    }

    // Load the saved color from localStorage on page load
    var savedColor = localStorage.getItem('backgroundColor');
    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
    }
});



function toggleColorPicker() {
    var colorPickerContainer = document.getElementById('color-picker-container');
    var displayStatus = colorPickerContainer.style.display;

    if (displayStatus === 'none') {
        colorPickerContainer.style.display = 'block';
        document.getElementById('headerColorPicker').click();
    } else {
        colorPickerContainer.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    var header = document.getElementById('header');
    var colorPicker = document.getElementById('headerColorPicker');
    var changeColorButton = document.getElementById('changeHeaderColorButton');
    
    function updateHeaderColor(color) {
        header.style.backgroundColor = color;
        if (!document.body.classList.contains('dark-mode')) {
            localStorage.setItem('headerColor', color);
        }
    }

    
    var savedColor = localStorage.getItem('headerColor');
    if (savedColor && !document.body.classList.contains('dark-mode')) {
        updateHeaderColor(savedColor);
        colorPicker.value = savedColor;
    }

    
    colorPicker.addEventListener('input', function() {
        updateHeaderColor(colorPicker.value);
    });

    
    changeColorButton.addEventListener('click', function() {
        colorPicker.click();
    });
});

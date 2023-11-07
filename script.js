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

function addButtonToSubcategory() {
    alert("Function called!"); // This confirms the function is being triggered.

    // Get the value from the dropdown to know which subcategory to append to.
    var subcategory = document.getElementById("subcategorySelect").value;

    // Create a new button element.
    var newButton = document.createElement("button");
    newButton.innerHTML = "New Button"; // Set the button text. You may want to make this dynamic.

    // Append the new button to the correct sub-category.
    // Assuming your sub-categories have IDs like "subcategory1-content", "subcategory2-content", etc.
    var targetDiv = document.getElementById(subcategory + "-content");
    if (targetDiv) {
        targetDiv.appendChild(newButton);
    } else {
        alert("No target div found for subcategory: " + subcategory);
    }
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

function generateReference() {
    var inputText = document.getElementById("inputText").value;
    var outputDiv = document.getElementById("output");

    // Basic referencing logic (you can extend this based on your needs)
    var bookPattern = /(\b[A-Z][a-z]*\b), (\b[A-Z][a-z]*\b)\. \((\d{4})\)\. (\b.+?\b)\. (\b[A-Z][a-z]*\b)\: (\b.+?\b)\./;
    var websitePattern = /(\b.+?\b)\. \((\d{4})\)\. (\b.+?\b)\. (\b.+?\b)\./;

    var bookMatch = inputText.match(bookPattern);
    var websiteMatch = inputText.match(websitePattern);

    if (bookMatch) {
        var authorLastName = bookMatch[1];
        var authorFirstName = bookMatch[2];
        var year = bookMatch[3];
        var title = bookMatch[4];
        var publisher = bookMatch[5];
        var location = bookMatch[6];

        var reference = `${authorLastName}, ${authorFirstName}. (${year}). ${title}. ${publisher}: ${location}.`;
        outputDiv.innerHTML = `<p>Generated Reference: <br>${reference}</p>`;
    } else if (websiteMatch) {
        var siteName = websiteMatch[1];
        var year = websiteMatch[2];
        var title = websiteMatch[3];
        var url = websiteMatch[4];

        var reference = `${siteName}. (${year}). ${title}. Available at: ${url}.`;
        outputDiv.innerHTML = `<p>Generated Reference: <br>${reference}</p>`;
    } else {
        outputDiv.innerHTML = "<p>Invalid input. Please check your formatting.</p>";
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
});

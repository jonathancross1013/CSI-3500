// background.js
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "add-reference",
    title: "Add Reference",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "add-reference") {
    chrome.storage.local.set({ 'selectedText': info.selectionText }, function() {
      console.log('Selected text saved:', info.selectionText);
    });
  }
});

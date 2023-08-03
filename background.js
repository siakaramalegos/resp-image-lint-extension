chrome.action.onClicked.addListener(async (tab) => {
  // Insert the JS file when the user turns the extension on
  await chrome.scripting.executeScript({
    files: ["RespImageLint.js"],
    target: { tabId: tab.id },
  });
});

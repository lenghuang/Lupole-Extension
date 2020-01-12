// Background scripts

/*
This extension will need information from a persistent variable as soon as its 
installed. Start by including a listening event for runtime.onInstalled in the 
background script. Inside the onInstalled listener, the extension will set a 
value using the storage API. This will allow multiple extension components to 
access that value and update it.
*/
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: "#3aa757" }, function() {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // Checking what website you're on. Could be good for amazon.
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "developer.chrome.com" }
          })
        ],
        // Show page action as listed on manifest.json
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

chrome.runtime.onInstalled.addListener(() => {
    // Initialize storage if needed
    chrome.storage.local.set({ savedTexts: [] }, () => {
        console.log("Initialized storage.");
    });
});

// Listen for messages to save data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveText") {
        chrome.storage.local.get(['savedTexts'], (result) => {
            let updatedTexts = result.savedTexts || [];
            updatedTexts.push({
                platform: request.platform,
                text: request.text,
                timestamp: new Date().toISOString()
            });
            chrome.storage.local.set({ savedTexts: updatedTexts }, () => {
                sendResponse({ status: "success" });
            });
        });
        // Return true to indicate asynchronous response
        return true;
    }
});

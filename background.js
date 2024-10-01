// Initialize storage on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['savedTexts'], (result) => {
        if (!result.savedTexts) {
            chrome.storage.local.set({ savedTexts: [] });
        }
    });
});

// Listen for saveText messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveText') {
        const newEntry = {
            platform: request.platform,
            text: request.text,
            timestamp: request.timestamp
        };

        chrome.storage.local.get(['savedTexts'], (result) => {
            const updatedTexts = result.savedTexts || [];
            updatedTexts.push(newEntry);
            chrome.storage.local.set({ savedTexts: updatedTexts }, () => {
                sendResponse({ status: 'success' });
            });
        });

        // Indicate that the response is asynchronous
        return true;
    }
});

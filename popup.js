document.getElementById('saveButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, (response) => {
            if (response && response.text && response.text.length > 0) {
                // Save each text entry
                response.text.forEach(text => {
                    chrome.runtime.sendMessage({
                        action: "saveText",
                        platform: response.platform,
                        text: text
                    }, (res) => {
                        if (res.status === "success") {
                            loadSavedTexts();
                        }
                    });
                });
            } else {
                alert("No text found on this page.");
            }
        });
    });
});

function loadSavedTexts() {
    chrome.storage.local.get(['savedTexts'], (result) => {
        const container = document.getElementById('savedTexts');
        container.innerHTML = '';
        if (result.savedTexts && result.savedTexts.length > 0) {
            result.savedTexts.forEach(item => {
                let div = document.createElement('div');
                div.className = 'text-item';
                div.innerHTML = `<strong>${item.platform}</strong> (${new Date(item.timestamp).toLocaleString()}):<br>${item.text}`;
                container.appendChild(div);
            });
        } else {
            container.innerHTML = '<p>No texts saved yet.</p>';
        }
    });
}

// Load saved texts when the popup opens
document.addEventListener('DOMContentLoaded', loadSavedTexts);

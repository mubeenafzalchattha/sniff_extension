document.addEventListener('DOMContentLoaded', () => {
    loadSavedTexts();
});

function loadSavedTexts() {
    chrome.storage.local.get(['savedTexts'], (result) => {
        const container = document.getElementById('savedTextsContainer');
        container.innerHTML = ''; // Clear existing content

        if (result.savedTexts && result.savedTexts.length > 0) {
            result.savedTexts.reverse().forEach(item => { // Show latest first
                const textDiv = document.createElement('div');
                textDiv.className = 'saved-text-item';
                textDiv.innerHTML = `
                    <strong>${item.platform}</strong> <em>${new Date(item.timestamp).toLocaleString()}</em>
                    <p>${item.text}</p>
                `;
                container.appendChild(textDiv);
            });
        } else {
            container.innerHTML = '<p>No texts saved yet.</p>';
        }
    });
}

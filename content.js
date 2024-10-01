// Utility function to create a "Save" button
function createSaveButton() {
    const button = document.createElement('button');
    button.innerText = 'Save';
    button.className = 'ts-saver-button';
    // Style the button (you can move styles to CSS)
    button.style.marginLeft = '10px';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#1da1f2'; // Twitter Blue
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '12px';
    return button;
}

// Function to add Save buttons to tweets/posts
function addSaveButtons() {
    // Twitter
    if (window.location.hostname.includes('twitter.com')) {
        const tweets = document.querySelectorAll('article div[data-testid="tweet"]');
        tweets.forEach(tweet => {
            if (!tweet.querySelector('.ts-saver-button')) { // Prevent duplicate buttons
                const button = createSaveButton();
                button.addEventListener('click', () => handleSave(tweet, 'Twitter'));
                // Append button to tweet actions
                const actionContainer = tweet.querySelector('div[role="group"]');
                if (actionContainer) {
                    actionContainer.appendChild(button);
                }
            }
        });
    }

    // LinkedIn
    else if (window.location.hostname.includes('linkedin.com')) {
        const posts = document.querySelectorAll('div[data-id]');
        posts.forEach(post => {
            if (!post.querySelector('.ts-saver-button')) { // Prevent duplicate buttons
                const button = createSaveButton();
                button.addEventListener('click', () => handleSave(post, 'LinkedIn'));
                // Append button to post actions
                const actionContainer = post.querySelector('div.artdeco-button__text');
                if (actionContainer) {
                    actionContainer.parentElement.appendChild(button);
                }
            }
        });
    }
}

// Function to extract text and send to background for storage
function handleSave(element, platform) {
    let text = '';

    if (platform === 'Twitter') {
        const tweetText = element.querySelector('div[lang]');
        text = tweetText ? tweetText.innerText : '';
    } else if (platform === 'LinkedIn') {
        const postText = element.querySelector('span.break-words');
        text = postText ? postText.innerText : '';
    }

    if (text) {
        chrome.runtime.sendMessage({
            action: 'saveText',
            platform: platform,
            text: text,
            timestamp: new Date().toISOString()
        }, response => {
            if (response.status === 'success') {
                alert(`${platform} post saved successfully!`);
            } else {
                alert('Failed to save the post.');
            }
        });
    } else {
        alert('Unable to extract text from the post.');
    }
}

// Initial injection
addSaveButtons();

// Observe for dynamic content (e.g., infinite scroll)
const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        addSaveButtons();
    });
});

observer.observe(document.body, { childList: true, subtree: true });

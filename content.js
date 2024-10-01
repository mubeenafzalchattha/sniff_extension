// Function to extract tweets from Twitter
function extractTweets() {
    let tweets = [];
    // Twitter's tweet elements might change; selectors may need updates
    document.querySelectorAll('article div[lang]').forEach(tweet => {
        tweets.push(tweet.innerText);
    });
    return tweets;
}

// Function to extract posts from LinkedIn
function extractLinkedInPosts() {
    let posts = [];
    // LinkedIn's post elements might change; selectors may need updates
    document.querySelectorAll('div[data-id]').forEach(post => {
        const textElement = post.querySelector('span.break-words');
        if (textElement) {
            posts.push(textElement.innerText);
        }
    });
    return posts;
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractText") {
        let data = {};
        if (window.location.hostname.includes('twitter.com')) {
            data.platform = 'Twitter';
            data.text = extractTweets();
        } else if (window.location.hostname.includes('linkedin.com')) {
            data.platform = 'LinkedIn';
            data.text = extractLinkedInPosts();
        }
        sendResponse(data);
    }
});

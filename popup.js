console.log('Popup script loaded');

document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message');
    const countInput = document.getElementById('count');
    const sendButton = document.getElementById('sendButton');
    const statusDiv = document.getElementById('status');

    if (!sendButton || !messageInput || !countInput || !statusDiv) {
        console.error('Required elements not found!');
        return;
    }

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((message) => {
        if (message.status === "progress") {
            statusDiv.textContent = `Progress: ${message.current}/${message.total} (Success: ${message.success}, Failed: ${message.failed})`;
        } else if (message.status === "complete") {
            statusDiv.textContent = `Complete! Success: ${message.success}, Failed: ${message.failed}`;
            sendButton.disabled = false;
            messageInput.disabled = false;
            countInput.disabled = false;
        }
    });

    sendButton.addEventListener('click', async function() {
        const message = messageInput.value.trim();
        const count = parseInt(countInput.value);

        if (!message) {
            statusDiv.textContent = 'Please enter a message';
            return;
        }

        if (!count || count < 1) {
            statusDiv.textContent = 'Please enter a valid number';
            return;
        }

        sendButton.disabled = true;
        messageInput.disabled = true;
        countInput.disabled = true;
        statusDiv.textContent = 'Starting message sending...';

        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs[0]?.id) {
            statusDiv.textContent = 'Error: No active tab found';
            return;
        }

        try {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "sendMessages",
                message: message,
                count: count
            }, function(response) {
                if (chrome.runtime.lastError) {
                    statusDiv.textContent = 'Error: Could not connect to WhatsApp Web';
                    console.error(chrome.runtime.lastError);
                    sendButton.disabled = false;
                    messageInput.disabled = false;
                    countInput.disabled = false;
                } else if (response?.status === "error") {
                    statusDiv.textContent = 'Error: ' + response.message;
                    sendButton.disabled = false;
                    messageInput.disabled = false;
                    countInput.disabled = false;
                }
            });
        } catch (error) {
            console.error('Error:', error);
            statusDiv.textContent = 'An error occurred';
            sendButton.disabled = false;
            messageInput.disabled = false;
            countInput.disabled = false;
        }
    });
});

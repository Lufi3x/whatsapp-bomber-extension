// Eklenti yüklendiğinde
chrome.runtime.onInstalled.addListener(() => {
    console.log("WhatsApp Spam Tool installed");
});

// Tab güncellendiğinde content script'i yeniden yükle
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url?.includes('web.whatsapp.com')) {
        console.log('WhatsApp Web page loaded, reloading content script...');
        
        // Content script'i yeniden yükle
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).then(() => {
            console.log('Content script loaded successfully');
        }).catch((err) => {
            console.error('Error loading content script:', err);
        });
    }
});

// Content script'ten gelen mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background script received message:', request);
    if (request.action === "contentScriptLoaded") {
        console.log('Content script load notification received');
        sendResponse({ status: "acknowledged" });
    }
});

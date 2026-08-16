"use strict";

function setBadgeText(enabled) {
    const text = enabled ? "ON" : "OFF";
    chrome.action.setBadgeText({ text: text });
}

function startUp() {
    chrome.storage.sync.get("tracking", (data) => {
        setBadgeText(!!data.tracking);
    })
}

//Ensure the background script always runs
chrome.runtime.onStartup.addListener(startUp);
chrome.runtime.onInstalled.addListener(startUp);
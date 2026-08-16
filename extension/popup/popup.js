"use strict";
// variables checkbox
const trackingCheckbox = document.getElementById("tracking");

// variables sections 
const statusSection = document.getElementById("status");
const analyticsSection = document.getElementById("analytics");

// variables buttons
const viewAnalyticsButton = document.getElementById("viewAnalytics");
const setTrackingButton = document.getElementById("setTracking");
const exportDataButton = document.getElementById("exportData");
const clearDataButton = document.getElementById("clearData");

// Initialize the tracking checkbox
chrome.storage.sync.get("tracking", (data) => {
    trackingCheckbox.checked = !!data.tracking;
});

// Add event listener for the start tracking button
trackingCheckbox.addEventListener("change", function () {
    console.log("Start tracking button clicked");
    chrome.action.setBadgeText({ text: trackingCheckbox.checked ? "ON" : "OFF" });
    chrome.storage.sync.set({ tracking: trackingCheckbox.checked });
})
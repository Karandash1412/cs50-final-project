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

// event listener for the start tracking button
trackingCheckbox.addEventListener("change", function () {
    chrome.action.setBadgeText({ text: trackingCheckbox.checked ? "ON" : "OFF" });
    chrome.storage.sync.set({ tracking: trackingCheckbox.checked });
})

// event listener for the view analytics and set tracking
function toggleSections() {
    analyticsSection.hidden = !analyticsSection.hidden;
    statusSection.hidden = !statusSection.hidden;
    viewAnalyticsButton.hidden = !viewAnalyticsButton.hidden;
    setTrackingButton.hidden = !setTrackingButton.hidden;
}

viewAnalyticsButton.addEventListener("click", toggleSections);
setTrackingButton.addEventListener("click", toggleSections);
"use strict";
// variables seclect element
const trackingTimeSelect = document.getElementById("trackingTime");

// variables checkbox
const trackingCheckbox = document.getElementById("tracking");

// variables sections
const statusSection = document.getElementById("status");
const analyticsSection = document.getElementById("analytics");
const settingsSection = document.getElementById("settings");

// variables buttons
const viewAnalyticsButton = document.getElementById("viewAnalytics");
const setTrackingButton = document.getElementById("setTracking");
const clearDataButton = document.getElementById("clearData");
const settingsButton = document.getElementById("settingsButton");

// Initialize the tracking checkbox
chrome.storage.sync.get("tracking", (data) => {
  trackingCheckbox.checked = !!data.tracking;
});

// event listener function for the view analytics and set tracking
function toggleSections(section) {
  if (section === "analytics") {
    analyticsSection.hidden = false;
    statusSection.hidden = true;
    viewAnalyticsButton.hidden = true;
    setTrackingButton.hidden = false;
  } else {
    analyticsSection.hidden = true;
    statusSection.hidden = false;
    viewAnalyticsButton.hidden = false;
    setTrackingButton.hidden = true;
  }

  settingsSection.hidden = true;
  settingsButton.hidden = false;
}

// fucntion for the event listener for the settings button
function toggleSettings() {
  analyticsSection.hidden = true;
  statusSection.hidden = true;
  settingsSection.hidden = false;
  settingsButton.hidden = true;
}

// function for the event listener for the tracking checkbox
function handleChangeCheckbox() {
  chrome.action.setBadgeText({ text: trackingCheckbox.checked ? "ON" : "OFF" });
  chrome.storage.sync.set({ tracking: trackingCheckbox.checked });
}

// function for the event listener for the tracking time select
function handleChangeTrackingTime() {
  chrome.storage.sync.set({ trackingTime: trackingTimeSelect.value });
}
// event listeners for the buttons and the checkbox
viewAnalyticsButton.addEventListener("click", () =>
  toggleSections("analytics"),
);
setTrackingButton.addEventListener("click", () =>
  toggleSections("setTracking"),
);
settingsButton.addEventListener("click", toggleSettings);
trackingCheckbox.addEventListener("change", handleChangeCheckbox);
trackingTimeSelect.addEventListener("change", handleChangeTrackingTime);

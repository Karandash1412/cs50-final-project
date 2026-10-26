"use strict";
// variables seclect element
const trackingTimeSelect = document.getElementById("trackingTime");

// variables checkbox
const trackingCheckbox = document.getElementById("tracking");

// variables sections
const statusSection = document.getElementById("status");
const analyticsSection = document.getElementById("analytics");
const settingsSection = document.getElementById("settings");
const topVisitedSitesSection = document.getElementById("top-visited-sites");

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
async function toggleSections(section) {
  const { trackingTime = "24" } = await chrome.storage.sync.get("trackingTime");
  if (section === "analytics") {
    analyticsSection.hidden = false;
    statusSection.hidden = true;
    viewAnalyticsButton.hidden = true;
    setTrackingButton.hidden = false;
    await getAnalytics(trackingTime);
  } else {
    analyticsSection.hidden = true;
    statusSection.hidden = false;
    viewAnalyticsButton.hidden = false;
    setTrackingButton.hidden = true;
  }

  settingsSection.hidden = true;
  settingsButton.hidden = false;
}

// function to get the analytics from the API
async function getAnalytics(trackingTime) {
  const response = await fetch(
    `http://127.0.0.1:5000/analitics?date=${trackingTime}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(`API request failed: ${response.error}`);

  if (data.error) {
    topVisitedSitesSection.innerHTML = `<p>${data.error}</p>`;
  } else if (data.length === 0) {
    topVisitedSitesSection.innerHTML = `<p>No data</p>`;
  } else {
    topVisitedSitesSection.innerHTML = data
      .map((site) => `<p>${site.url}: ${site.time_spent}m</p>`)
      .join("");
  }
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

async function handleClearData() {
  await chrome.storage.sync.clear();

  fetch("http://127.0.0.1:5000/clear-data", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message);
      }
    });
}

settingsButton.addEventListener("click", toggleSettings);
trackingCheckbox.addEventListener("change", handleChangeCheckbox);
trackingTimeSelect.addEventListener("change", handleChangeTrackingTime);
clearDataButton.addEventListener("click", handleClearData);

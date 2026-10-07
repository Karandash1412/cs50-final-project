"use strict";

let trackingTimeStart = null;
let currentPage = null;

// function to set the badge text
function setBadgeText(enabled) {
  const text = enabled ? "ON" : "OFF";
  chrome.action.setBadgeText({ text: text });
}

// function to start the extension
function startUp() {
  chrome.storage.sync.get("tracking", (data) => {
    setBadgeText(!!data.tracking);
  });
}

//Ensure the background script always runs
chrome.runtime.onStartup.addListener(startUp);
chrome.runtime.onInstalled.addListener(startUp);

// function to get the current page tab
async function getCurrentPage() {
  // get the current page tab
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  if (!tab) {
    console.log("No active tab found");
    return null;
  }
  // check if the page tab is already being tracked
  const data = await chrome.storage.sync.get("trackingPage");

  if (data.trackingPage === tab.url) {
    // start tracking the time
    currentPage = tab.url;
    trackingTimeStart = Date.now();
  } else if (currentPage !== null) {
    // stop tracking the time
    stopTrackingTime();
  }
  return;
}

// function to stop tracking the time and create a session
function stopTrackingTime() {
  createSession(currentPage, trackingTimeStart);
  trackingTimeStart = null;
  currentPage = null;
}

// function to get the current page
getCurrentPage();

function createSession(currentPage, trackingTimeStart) {
  // todo save the data at db by using Flask API
  let currentSession = {
    domain: currentPage,
    start_time: trackingTimeStart,
    duration: Date.now() - trackingTimeStart,
  };
}
// to doo
//However, two issues remain:

// trackingPage is never saved, so data.trackingPage is likely undefined.
// getCurrentPage() runs only once; it does not run when you switch tabs.

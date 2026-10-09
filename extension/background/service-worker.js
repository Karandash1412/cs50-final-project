"use strict";

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
  // get the current page
  const { currentPage } = await chrome.storage.session.get(["currentPage"]);
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (tab && tab.url) {
    const hostname = new URL(tab.url).hostname;

    if (currentPage === null || currentPage === undefined) {
      await chrome.storage.session.set({
        trackingTimeStart: Date.now(),
        currentPage: hostname,
      });
    } else if (currentPage !== hostname) {
      await createSession();

      await chrome.storage.session.set({
        currentPage: hostname,
        trackingTimeStart: Date.now(),
      });
    }
  }
  return 0;
}

// function to get the current page
getCurrentPage();

async function createSession() {
  const { trackingTimeStart, currentPage } = await chrome.storage.session.get([
    "trackingTimeStart",
    "currentPage",
  ]);
  if (trackingTimeStart === undefined || currentPage === undefined) {
    return;
  }
  let currentSession = {
    domain: currentPage,
    duration: Number(((Date.now() - trackingTimeStart) / 3600000).toFixed(2)),
  };
  postData(currentSession);
}
// function to post the data to the Flask API
function postData(data) {
  fetch("/analitics", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

chrome.tabs.onActivated.addListener(getCurrentPage);

async function initializeTracking() {
  const { tracking } = await chrome.storage.sync.get("tracking");
  if (!tracking) return;

  getCurrentPage();
}

initializeTracking();

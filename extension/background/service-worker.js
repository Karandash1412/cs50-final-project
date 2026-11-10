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

  // if the tab is valid and the url starts with http, get the hostname
  if (tab?.url && ["http:", "https:"].includes(new URL(tab.url).protocol)) {
    const hostname = new URL(tab.url).hostname.replace(/^www\./, "");

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
  } else {
    // non-http tab (newtab, extensions): close the current session
    await createSession();
    await chrome.storage.session.remove(["currentPage", "trackingTimeStart"]);
  }
  return 0;
}

// function to get the current page
getCurrentPage();

// function to create a new session
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
    duration: Math.round((Date.now() - trackingTimeStart) / 1000),
    date: Date.now(),
  };
  // if the session duration is less than 1 second, don't post the data
  if (currentSession.duration < 1) return;

  // post the data to the Flask API
  postData(currentSession);

}

// function to post the data to the Flask API
async function postData(data) {
  const response = await fetch("http://127.0.0.1:5000/analitics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

chrome.tabs.onActivated.addListener(getCurrentPage);
// function to initialize the tracking
async function initializeTracking() {
  const { tracking } = await chrome.storage.sync.get("tracking");
  if (!tracking) return;

  getCurrentPage();
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.tracking) {
    setBadgeText(!!changes.tracking.newValue);
  }
});

// initialize the tracking
initializeTracking();

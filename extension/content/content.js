"use strict";
chrome.storage.sync.get("tracking", (data) => {
  if (!data.tracking) {
    console.log("Tracking not found");
    return;
  }
  console.log("Tracking is enabled");
});
chrome.storage.sync.get("trackingTime", (data) => {
  if (!data.trackingTime) {
    console.log("Tracking time not found");
    return;
  }
  console.log("Tracking time is set to", data.trackingTime);
});

// /scripts/extras.js

// ################## //
//  Console messages  //
// ################## //
console.log(
  "%cPeeking under the hood huh..👀 Noman likes you.",
  "font-size: 18px; font-weight: bold; color: #ff3b30; background: #222; padding: 4px 8px; border-radius: 4px;"
);

let devToolsDetectionTimer;

function detectDevToolsOpen() {
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;

  if (widthThreshold || heightThreshold) {
    if (!devToolsDetectionTimer) {
      devToolsDetectionTimer = setTimeout(() => {
        console.log(
          "%cAnother presence has joined you. They're quiet... for now.",
          "font-size: 18px; font-weight: bold; color: #ff3b30; background: #222; padding: 8px 12px; border-radius: 6px;"
        );
      }, 15000);
    }
  } else {
    clearTimeout(devToolsDetectionTimer);
    devToolsDetectionTimer = null;
  }
}

setInterval(detectDevToolsOpen, 1000);

// ############################ //
//  Title change on tab switch  //
// ############################ //
let originalTitle = document.title;

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    document.title = "Oye, come back...";
  } else {
    document.title = originalTitle;
  }
});

// ##################### //
//  GitHub link tooltip  //
// ##################### //
let hoverTimer;

document
  .querySelector(".github-link")
  .addEventListener("mouseenter", function () {
    hoverTimer = setTimeout(() => {
      this.classList.add("show-tooltip");
    }, 2500);
  });

document
  .querySelector(".github-link")
  .addEventListener("mouseleave", function () {
    clearTimeout(hoverTimer);
    this.classList.remove("show-tooltip");
  });

// ###################### //
//  Sleep mode animation  //
// ###################### //
let inactivitySleepTimer;
let screenBlankTimer;
let heartbeatDisplayTimer;
let sleepOverlay = null;

function initializeInactivitySleep() {
  sleepOverlay = document.createElement("div");
  sleepOverlay.className = "sleep-overlay";

  sleepOverlay.innerHTML = `
        <div class="heart-rate">
            <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="300px"
                height="146px"
                viewBox="0 0 150 73"
            >
                <polyline
                    fill="none"
                    stroke="#ff3b30"
                    stroke-width="3"
                    stroke-miterlimit="10"
                    points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                />
            </svg>
            <div class="fade-in"></div>
            <div class="fade-out"></div>
        </div>
    `;

  document.body.appendChild(sleepOverlay);
  resetInactivityTimers();

  document.addEventListener("mousemove", wakeFromSleepMode);
  document.addEventListener("keydown", wakeFromSleepMode);
  document.addEventListener("click", wakeFromSleepMode);
  document.addEventListener("scroll", wakeFromSleepMode);
  document.addEventListener("touchstart", wakeFromSleepMode);
}

function resetInactivityTimers() {
  clearTimeout(inactivitySleepTimer);
  clearTimeout(screenBlankTimer);
  clearTimeout(heartbeatDisplayTimer);

  inactivitySleepTimer = setTimeout(() => {
    beginSleepSequence();
  }, 50000); // 50 seconds until sleep starts
}

function beginSleepSequence() {
  sleepOverlay.classList.add("blur");

  screenBlankTimer = setTimeout(() => {
    sleepOverlay.classList.remove("blur");
    sleepOverlay.classList.add("blank");

    heartbeatDisplayTimer = setTimeout(() => {
      sleepOverlay.classList.add("show-heartbeat");
    }, 8000); // 8 seconds after going blank
  }, 5000); // 5 seconds of blur
}

function wakeFromSleepMode() {
  sleepOverlay.classList.remove("blur", "blank", "show-heartbeat");
  sleepOverlay.classList.add("waking");

  setTimeout(() => {
    sleepOverlay.classList.remove("waking");
  }, 300);

  resetInactivityTimers();
}

document.addEventListener("DOMContentLoaded", initializeInactivitySleep);

// Keep screen on as long as the page is visible
let wakeLock = null;

async function requestWakeLock() {
  if (!("wakeLock" in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      console.log("Wake Lock was released");
    });
    console.log("Wake Lock is active!");
  } catch (err) {
    console.error(`Could not obtain wake lock: ${err.name}, ${err.message}`);
  }
}

// Re-request if tab becomes visible again
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    requestWakeLock();
  }
});

// Start immediately
if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) {
  requestWakeLock();
}


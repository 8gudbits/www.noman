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

// #################### //
//  Hero section toast  //
// #################### //
let heroIdleTimer;
let heroToast = null;

function monitorHeroSectionIdle() {
  const heroSection = document.querySelector(".hero-section");
  const scrollY = window.scrollY;
  const heroHeight = heroSection.offsetHeight;

  if (scrollY < heroHeight * 0.8) {
    if (!heroIdleTimer && !heroToast) {
      heroIdleTimer = setTimeout(() => {
        displayHeroIdleToast();
      }, 15000);
    }
  } else {
    clearTimeout(heroIdleTimer);
    heroIdleTimer = null;
  }
}

function displayHeroIdleToast() {
  heroToast = document.createElement("div");
  heroToast.className = "hero-toast";
  heroToast.textContent =
    "You have been staring at this part of the page for way too long. Come on, scroll now... :))";
  document.body.appendChild(heroToast);

  heroToast.addEventListener("click", removeHeroToast);

  setTimeout(() => {
    heroToast.classList.add("show");
  }, 100);
}

function removeHeroToast() {
  if (heroToast && document.body.contains(heroToast)) {
    heroToast.classList.remove("show");
    setTimeout(() => {
      if (heroToast && document.body.contains(heroToast)) {
        document.body.removeChild(heroToast);
      }
      heroToast = null;
    }, 500);
  } else {
    heroToast = null;
  }
}

window.addEventListener("scroll", function () {
  if (heroToast && document.body.contains(heroToast)) {
    removeHeroToast();
  }
  clearTimeout(heroIdleTimer);
  heroIdleTimer = null;
});

monitorHeroSectionIdle();

// ##################### //
//  About section toast  //
// ##################### //
let aboutViewTimer;
let aboutToastShown = false;

function monitorAboutSectionView() {
  if (aboutToastShown) return;

  const aboutSection = document.querySelector("#about");
  const aboutRect = aboutSection.getBoundingClientRect();

  if (
    aboutRect.top < window.innerHeight * 0.8 &&
    aboutRect.bottom > window.innerHeight * 0.2
  ) {
    if (!aboutViewTimer) {
      aboutViewTimer = setTimeout(() => {
        displayAboutSectionToast();
      }, 10000);
    }
  } else {
    clearTimeout(aboutViewTimer);
    aboutViewTimer = null;
  }
}

function displayAboutSectionToast() {
  aboutToastShown = true;
  const toast = document.createElement("div");
  toast.className = "about-toast";
  toast.textContent =
    "I see you're a person of taste - reading the part of the site most would skip! I like you :))";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  toast.addEventListener("click", function hideOnClick() {
    toast.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 500);
    toast.removeEventListener("click", hideOnClick);
  });

  function hideOnScroll() {
    toast.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 500);
    window.removeEventListener("scroll", hideOnScroll);
  }

  window.addEventListener("scroll", hideOnScroll);
}

window.addEventListener("scroll", monitorAboutSectionView);
monitorAboutSectionView();

// ########################## //
//  Speed toast notification  //
// ########################## //
const SCROLL_THRESHOLD = 1250;
const SCROLL_SPEED_THRESHOLD = 0.8;
const COOLDOWN_TIME = 10000;
const RESET_AMOUNT = 50;

let previousScrollPosition = 0;
let lastScrollTime = Date.now();
let rapidScrollDistance = 0;
let lastToastTime = 0;
let isToastCooldown = false;

function setupScrollSpeedTracking() {
  previousScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  lastScrollTime = Date.now();

  window.addEventListener("scroll", measureScrollVelocity);
}

function measureScrollVelocity() {
  const currentTime = Date.now();

  if (isToastCooldown && currentTime - lastToastTime < COOLDOWN_TIME) {
    return;
  } else if (isToastCooldown) {
    isToastCooldown = false;
  }

  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  const timeDiff = currentTime - lastScrollTime;

  if (timeDiff > 0) {
    const scrollDistance = currentScrollTop - previousScrollPosition;
    const scrollSpeed = Math.abs(scrollDistance) / timeDiff;

    if (scrollDistance > 0 && scrollSpeed > SCROLL_SPEED_THRESHOLD) {
      rapidScrollDistance += scrollDistance;

      if (rapidScrollDistance > SCROLL_THRESHOLD) {
        displaySpeedWarningToast();
        rapidScrollDistance = 0;
        lastToastTime = currentTime;
        isToastCooldown = true;
      }
    } else {
      rapidScrollDistance = Math.max(0, rapidScrollDistance - RESET_AMOUNT);
    }
  }

  previousScrollPosition = currentScrollTop;
  lastScrollTime = currentTime;
}

function displaySpeedWarningToast() {
  const toast = document.createElement("div");
  toast.className = "speed-toast";
  toast.textContent =
    "Did you know that most readers miss the best parts at this speed??";
  document.body.appendChild(toast);

  toast.addEventListener("click", () => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  });

  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 8000);
}

window.addEventListener("load", setupScrollSpeedTracking);
if (document.readyState === "complete") {
  setupScrollSpeedTracking();
}

// ########################### //
//  Developer Tools detection  //
// ########################### //
(function () {
  let isDevToolsOpen = false;
  let devToolsToast = null;

  function displayDevToolsSourceToast() {
    // Don't show multiple toasts
    if (devToolsToast && document.body.contains(devToolsToast)) return;

    devToolsToast = document.createElement("div");
    devToolsToast.className = "devtools-toast";
    devToolsToast.innerHTML = `
            <p>The source code of this page is readily available at:</p>
            <a href="https://github.com/8gudbits/noman" target="_blank">github.com/8gudbits/noman</a>
            <p>You can check it out there...</p>
        `;

    document.body.appendChild(devToolsToast);

    setTimeout(() => {
      devToolsToast.classList.add("show");
    }, 100);

    setTimeout(() => {
      if (devToolsToast && document.body.contains(devToolsToast)) {
        removeDevToolsToast();
      }
    }, 8000); // Auto-hide after 8 seconds

    // Also hide on click
    devToolsToast.addEventListener("click", removeDevToolsToast);
  }

  function removeDevToolsToast() {
    if (devToolsToast && document.body.contains(devToolsToast)) {
      devToolsToast.classList.remove("show");
      setTimeout(() => {
        if (devToolsToast && document.body.contains(devToolsToast)) {
          document.body.removeChild(devToolsToast);
        }
        devToolsToast = null;
      }, 500);
    }
  }

  // Method 1: Check console size (most reliable)
  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;

  if (widthThreshold || heightThreshold) {
    displayDevToolsSourceToast();
    isDevToolsOpen = true;
  }

  // Method 2: Listen for debugger statements
  let element = new Image();
  Object.defineProperty(element, "id", {
    get: function () {
      if (!isDevToolsOpen) {
        displayDevToolsSourceToast();
        isDevToolsOpen = true;
      }
    },
  });

  console.log("%c", element);

  // Method 3: Check for resize (devtools opening/closing)
  window.addEventListener("resize", function () {
    setTimeout(function () {
      const widthCheck = window.outerWidth - window.innerWidth > threshold;
      const heightCheck = window.outerHeight - window.innerHeight > threshold;

      if ((widthCheck || heightCheck) && !isDevToolsOpen) {
        displayDevToolsSourceToast();
        isDevToolsOpen = true;
      } else if (!widthCheck && !heightCheck && isDevToolsOpen) {
        isDevToolsOpen = false;
      }
    }, 500);
  });
})();

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

  // Create heartbeat monitor HTML
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

  // Reset timers on any interaction
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

    // Show heartbeat after blank screen
    heartbeatDisplayTimer = setTimeout(() => {
      sleepOverlay.classList.add("show-heartbeat");
    }, 8000); // 8 seconds after going blank
  }, 5000); // 5 seconds of blur
}

function wakeFromSleepMode() {
  // Remove all sleep-related classes
  sleepOverlay.classList.remove("blur", "blank", "show-heartbeat");
  sleepOverlay.classList.add("waking");

  setTimeout(() => {
    sleepOverlay.classList.remove("waking");
  }, 300);

  resetInactivityTimers();
}

document.addEventListener("DOMContentLoaded", initializeInactivitySleep);

// Keep screen on for 1.5 minutes of inactivity
let wakeLock = null;
let inactivityTimer = null;
const idleTime = 90000;

function startInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }

  inactivityTimer = setTimeout(preventScreenSleep, idleTime);
}

async function preventScreenSleep() {
  if (!/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) return;

  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
    }
  } catch (err) {
    const video = document.createElement("video");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.style.display = "none";
    document.body.appendChild(video);
    video.play();
  }
}

const events = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
];
events.forEach((event) => {
  document.addEventListener(event, startInactivityTimer);
});

startInactivityTimer();


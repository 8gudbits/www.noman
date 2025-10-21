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
    }, 2000);
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
const SCROLL_THRESHOLD = 1250; // pixels of fast scrolling required
const SCROLL_SPEED_THRESHOLD = 0.8; // pixels per millisecond
const COOLDOWN_TIME = 10000; // 10 seconds in milliseconds
const RESET_AMOUNT = 50; // pixels to reset when not fast scrolling

let previousScrollPosition = 0;
let lastScrollTime = Date.now();
let rapidScrollDistance = 0;
let lastToastTime = 0;
let isToastCooldown = false;

function setupScrollSpeedTracking() {
  // Set the initial scroll position to the current restored position
  previousScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  lastScrollTime = Date.now();

  //Start listening to scroll events
  window.addEventListener("scroll", measureScrollVelocity);
}

function measureScrollVelocity() {
  const currentTime = Date.now();

  // Check if on cooldown period
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

    // Only track when scrolling down
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

  // Add hover to dismiss
  toast.addEventListener("mouseenter", () => {
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

    // Animate in
    setTimeout(() => {
      devToolsToast.classList.add("show");
    }, 100);

    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (devToolsToast && document.body.contains(devToolsToast)) {
        removeDevToolsToast();
      }
    }, 8000);

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

// ################################ //
// Item dragging and deleting logic //
// ################################ //
class ItemDragManager {
  constructor() {
    this.currentlyDraggedItem = null;
    this.dragStartOffset = { x: 0, y: 0 };
    this.placeholder = null;
    this.originalIndex = null;
    this.container = null;
    this.isItemBeingDragged = false;
    this.snapThreshold = 60;
    this.animationFrame = null;
    this.itemWidth = 0;
    this.itemHeight = 0;
    this.dragStartTime = 0;
    this.dragStartPosition = { x: 0, y: 0 };
    this.currentTargetIndex = -1;
    this.lastSnapTime = 0;
    this.snapCooldown = 100;
    this.deletedItems = new Map();
    this.floatingDeleteZone = null;
    this.isOverDeleteZone = false;

    // Touch-specific properties
    this.isTouchCapableDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    this.touchDragTimeout = null;
    this.isPotentialDragAction = false;
    this.initialTouchElement = null;
    this.scrollDisabled = false;

    this.init();
  }

  init() {
    this.setupContainers();
    this.createDragDeleteZone();
    this.attachDragEventListeners();
  }

  setupContainers() {
    const containerSelectors = [
      "#achievements .achievements-grid",
      "#projects .projects-grid",
      "#micro-projects .projects-grid",
      "#private-projects .projects-grid",
      "#project-ideas .projects-grid",
      "#tech-stack .tech-grid",
    ];

    containerSelectors.forEach((selector) => {
      const container = document.querySelector(selector);
      if (container) {
        this.enableContainerDragDrop(container);
        this.deletedItems.set(container, []);
      }
    });
  }

  enableContainerDragDrop(container) {
    container.classList.add("draggable-container", "draggable-grid");

    const items = container.children;
    [...items].forEach((item, index) => {
      item.classList.add("draggable-item");
      if (!item.dataset.originalIndex) {
        item.dataset.originalIndex = index;
      }
    });
  }

  createDragDeleteZone() {
    this.floatingDeleteZone = document.createElement("div");
    this.floatingDeleteZone.className = "floating-delete-zone";
    this.floatingDeleteZone.innerHTML = `<i class="fas fa-trash"></i>`;
    document.body.appendChild(this.floatingDeleteZone);

    this.floatingDeleteZone.addEventListener("click", () => {
      if (this.isItemBeingDragged && this.currentlyDraggedItem) {
        this.removeDraggedItem();
      }
    });
  }

  attachDragEventListeners() {
    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));

    // Touch events with different handling for touch devices
    if (this.isTouchCapableDevice) {
      document.addEventListener(
        "touchstart",
        this.handleTouchStart.bind(this),
        {
          passive: true,
        }
      );
      document.addEventListener("touchmove", this.handleTouchMove.bind(this), {
        passive: false,
      });
      document.addEventListener("touchend", this.handleTouchEnd.bind(this));
      document.addEventListener("touchcancel", this.handleTouchEnd.bind(this));
    } else {
      // For non-touch devices
      document.addEventListener(
        "touchstart",
        this.handleTouchStart.bind(this),
        {
          passive: false,
        }
      );
      document.addEventListener("touchmove", this.handleTouchMove.bind(this), {
        passive: false,
      });
      document.addEventListener("touchend", this.handleTouchEnd.bind(this));
    }

    document.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("selectstart", this.handleSelectStart.bind(this));

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  // Disable scroll during drag on touch devices
  preventPageScroll() {
    if (!this.scrollDisabled) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      this.scrollDisabled = true;
    }
  }

  // Enable scroll after drag on touch devices
  restorePageScroll() {
    if (this.scrollDisabled) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      this.scrollDisabled = false;
    }
  }

  handleSelectStart(e) {
    if (e.target.closest(".draggable-item")) {
      e.preventDefault();
    }
  }

  handleKeyDown(e) {
    if (!this.isItemBeingDragged || !this.currentlyDraggedItem) return;

    const deleteKeys = ["Escape", "Delete", "Backspace"];
    if (deleteKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      this.removeDraggedItem();
    }
  }

  removeDraggedItem() {
    if (!this.currentlyDraggedItem || !this.container) return;

    const deletedItem = {
      element: this.currentlyDraggedItem,
      originalIndex: this.originalIndex,
      container: this.container,
    };

    const containerDeletedItems = this.deletedItems.get(this.container) || [];
    containerDeletedItems.push(deletedItem);
    this.deletedItems.set(this.container, containerDeletedItems);

    this.createDeletedItemMarker();
    this.currentlyDraggedItem.remove();
    this.resetDragState();
  }

  createDeletedItemMarker() {
    if (!this.placeholder) return;

    const permanentPlaceholder = this.placeholder;
    permanentPlaceholder.classList.add("permanent-deleted");
    permanentPlaceholder.style.opacity = "0.4";
    permanentPlaceholder.style.background = "rgba(255, 59, 48, 0.1)";
    permanentPlaceholder.style.border = "2px dashed var(--accent-red)";
    permanentPlaceholder.innerHTML = `
      <div style="text-align: center; color: var(--accent-red);">
        <i class="fas fa-trash" style="font-size: 1.5em; margin-bottom: 0.5rem;"></i>
        <div style="font-size: 0.8em;">Deleted</div>
      </div>
    `;

    permanentPlaceholder.addEventListener("click", () => {
      this.restoreRecentlyDeletedItem(this.container);
    });

    permanentPlaceholder.classList.add("draggable-item");
    permanentPlaceholder.dataset.originalIndex = this.originalIndex;

    this.placeholder = null;
  }

  restoreRecentlyDeletedItem(container) {
    const containerDeletedItems = this.deletedItems.get(container) || [];
    if (containerDeletedItems.length === 0) return;

    const lastDeleted = containerDeletedItems.pop();
    this.deletedItems.set(container, containerDeletedItems);

    if (lastDeleted && lastDeleted.element) {
      const permanentPlaceholders =
        container.querySelectorAll(".permanent-deleted");
      permanentPlaceholders.forEach((placeholder) => {
        placeholder.remove();
      });

      const currentItems = Array.from(container.children).filter(
        (item) => !item.classList.contains("permanent-deleted")
      );
      let insertIndex = Math.min(
        lastDeleted.originalIndex,
        currentItems.length
      );

      if (currentItems.length === 0) {
        container.appendChild(lastDeleted.element);
      } else {
        container.insertBefore(lastDeleted.element, currentItems[insertIndex]);
      }

      lastDeleted.element.classList.add("draggable-item");
      this.triggerScrollAnimations();
    }
  }

  initGlobalRestore() {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        this.restoreAllRemovedItems();
      }
    });
  }

  restoreAllRemovedItems() {
    let restoredCount = 0;

    this.deletedItems.forEach((deletedItems, container) => {
      if (deletedItems.length > 0) {
        const itemsToRestore = [...deletedItems].reverse();
        itemsToRestore.forEach((item) => {
          if (item && item.element) {
            const permanentPlaceholders =
              container.querySelectorAll(".permanent-deleted");
            permanentPlaceholders.forEach((placeholder) => {
              placeholder.remove();
            });

            const currentItems = Array.from(container.children).filter(
              (item) => !item.classList.contains("permanent-deleted")
            );
            let insertIndex = Math.min(item.originalIndex, currentItems.length);

            if (currentItems.length === 0) {
              container.appendChild(item.element);
            } else {
              const targetIndex = Math.min(insertIndex, currentItems.length);
              container.insertBefore(item.element, currentItems[targetIndex]);
            }

            item.element.classList.add("draggable-item");
            restoredCount++;
          }
        });

        this.deletedItems.set(container, []);
      }
    });

    if (restoredCount > 0) {
      this.triggerScrollAnimations();
    }
  }

  handleMouseDown(e) {
    if (!e.target.closest(".draggable-item")) return;

    const item = e.target.closest(".draggable-item");
    if (item.classList.contains("permanent-deleted")) {
      this.restoreRecentlyDeletedItem(item.parentElement);
      return;
    }

    this.dragStartTime = Date.now();
    this.dragStartPosition = { x: e.clientX, y: e.clientY };

    this.dragTimeout = setTimeout(() => {
      this.initiateItemDrag(item, e.clientX, e.clientY);
    }, 150);

    e.preventDefault();
  }

  // Touch start with delay-based drag initiation
  handleTouchStart(e) {
    if (!e.target.closest(".draggable-item")) return;

    const touch = e.touches[0];
    const item = e.target.closest(".draggable-item");

    if (item.classList.contains("permanent-deleted")) {
      this.restoreRecentlyDeletedItem(item.parentElement);
      return;
    }

    this.initialTouchElement = item;
    this.dragStartTime = Date.now();
    this.dragStartPosition = { x: touch.clientX, y: touch.clientY };

    // Set up drag timeout for touch devices
    if (this.isTouchCapableDevice) {
      this.isPotentialDragAction = true;

      // Clear any existing timeout
      if (this.touchDragTimeout) {
        clearTimeout(this.touchDragTimeout);
      }

      // Set new timeout for drag initiation (500ms hold)
      this.touchDragTimeout = setTimeout(() => {
        if (this.isPotentialDragAction && this.initialTouchElement) {
          this.initiateItemDrag(
            this.initialTouchElement,
            touch.clientX,
            touch.clientY
          );
          this.isPotentialDragAction = false;
        }
      }, 500);
    } else {
      // Non-touch devices use shorter delay
      this.dragTimeout = setTimeout(() => {
        this.initiateItemDrag(item, touch.clientX, touch.clientY);
      }, 200);
    }

    if (!this.isTouchCapableDevice) {
      e.preventDefault();
    }
  }

  initiateItemDrag(item, clientX, clientY) {
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
    }

    if (this.touchDragTimeout) {
      clearTimeout(this.touchDragTimeout);
      this.touchDragTimeout = null;
    }

    this.currentlyDraggedItem = item;
    this.container = item.parentElement;
    this.isItemBeingDragged = true;

    this.floatingDeleteZone.classList.add("visible");

    const rect = item.getBoundingClientRect();
    this.itemWidth = rect.width;
    this.itemHeight = rect.height;

    item.style.setProperty("--item-width", `${this.itemWidth}px`);
    item.style.setProperty("--item-height", `${this.itemHeight}px`);

    this.dragStartOffset.x = clientX - rect.left;
    this.dragStartOffset.y = clientY - rect.top;

    this.originalIndex = Array.from(this.container.children).indexOf(item);
    this.currentTargetIndex = this.originalIndex;

    this.createDragPlaceholder();
    item.classList.add("dragging");
    this.updateItemPosition(clientX, clientY);

    // Disable scroll on touch devices when dragging starts
    if (this.isTouchCapableDevice) {
      this.preventPageScroll();
    }

    setTimeout(() => {
      if (this.placeholder) {
        this.placeholder.style.opacity = "0.4";
      }
    }, 100);
  }

  createDragPlaceholder() {
    this.placeholder = document.createElement("div");
    this.placeholder.classList.add("draggable-item", "placeholder");

    this.placeholder.style.width = `${this.itemWidth}px`;
    this.placeholder.style.height = `${this.itemHeight}px`;
    this.placeholder.style.opacity = "0";

    this.container.insertBefore(this.placeholder, this.currentlyDraggedItem);
  }

  handleMouseMove(e) {
    if (this.dragTimeout && !this.isItemBeingDragged) {
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - this.dragStartPosition.x, 2) +
          Math.pow(e.clientY - this.dragStartPosition.y, 2)
      );

      if (moveDistance > 10) {
        clearTimeout(this.dragTimeout);
        this.dragTimeout = null;
        return;
      }
    }

    if (!this.isItemBeingDragged) return;

    const deleteZoneRect = this.floatingDeleteZone.getBoundingClientRect();
    const isOverDeleteZone =
      e.clientX >= deleteZoneRect.left &&
      e.clientX <= deleteZoneRect.right &&
      e.clientY >= deleteZoneRect.top &&
      e.clientY <= deleteZoneRect.bottom;

    if (isOverDeleteZone && !this.isOverDeleteZone) {
      this.isOverDeleteZone = true;
      this.floatingDeleteZone.classList.add("active");
    } else if (!isOverDeleteZone && this.isOverDeleteZone) {
      this.isOverDeleteZone = false;
      this.floatingDeleteZone.classList.remove("active");
    }

    this.updateDragPosition(e.clientX, e.clientY);
    e.preventDefault();
  }

  // Touch move with scroll prevention during drag
  handleTouchMove(e) {
    // If we're potentially starting a drag but haven't initiated yet
    if (this.isPotentialDragAction && !this.isItemBeingDragged) {
      const touch = e.touches[0];
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - this.dragStartPosition.x, 2) +
          Math.pow(touch.clientY - this.dragStartPosition.y, 2)
      );

      // If user moved too much during the hold period, cancel potential drag
      if (moveDistance > 15) {
        this.isPotentialDragAction = false;
        if (this.touchDragTimeout) {
          clearTimeout(this.touchDragTimeout);
          this.touchDragTimeout = null;
        }
        return; // Allow normal scrolling
      }

      // Prevent default only if we're still in potential drag state
      e.preventDefault();
      return;
    }

    if (!this.isItemBeingDragged) return;

    const touch = e.touches[0];

    const deleteZoneRect = this.floatingDeleteZone.getBoundingClientRect();
    const isOverDeleteZone =
      touch.clientX >= deleteZoneRect.left &&
      touch.clientX <= deleteZoneRect.right &&
      touch.clientY >= deleteZoneRect.top &&
      touch.clientY <= deleteZoneRect.bottom;

    if (isOverDeleteZone && !this.isOverDeleteZone) {
      this.isOverDeleteZone = true;
      this.floatingDeleteZone.classList.add("active");
    } else if (!isOverDeleteZone && this.isOverDeleteZone) {
      this.isOverDeleteZone = false;
      this.floatingDeleteZone.classList.remove("active");
    }

    this.updateDragPosition(touch.clientX, touch.clientY);
    e.preventDefault();
  }

  updateDragPosition(clientX, clientY) {
    if (!this.currentlyDraggedItem || !this.isItemBeingDragged) return;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.updateItemPosition(clientX, clientY);
      this.reorderItemsOnDrag();
    });
  }

  updateItemPosition(clientX, clientY) {
    const x = clientX - this.dragStartOffset.x;
    const y = clientY - this.dragStartOffset.y;

    this.currentlyDraggedItem.style.position = "fixed";
    this.currentlyDraggedItem.style.left = `${x}px`;
    this.currentlyDraggedItem.style.top = `${y}px`;
    this.currentlyDraggedItem.style.zIndex = "1000";
    this.currentlyDraggedItem.style.width = `${this.itemWidth}px`;
    this.currentlyDraggedItem.style.height = `${this.itemHeight}px`;
  }

  reorderItemsOnDrag() {
    if (!this.currentlyDraggedItem || !this.placeholder) return;

    const draggedRect = this.currentlyDraggedItem.getBoundingClientRect();
    const items = Array.from(this.container.children).filter(
      (child) =>
        child !== this.currentlyDraggedItem && child !== this.placeholder
    );

    // Find which item the dragged item is covering by 50% or more
    let targetItem = null;

    for (const item of items) {
      const itemRect = item.getBoundingClientRect();

      // Calculate overlap area
      const overlapLeft = Math.max(draggedRect.left, itemRect.left);
      const overlapRight = Math.min(draggedRect.right, itemRect.right);
      const overlapTop = Math.max(draggedRect.top, itemRect.top);
      const overlapBottom = Math.min(draggedRect.bottom, itemRect.bottom);

      if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
        const overlapWidth = overlapRight - overlapLeft;
        const overlapHeight = overlapBottom - overlapTop;
        const overlapArea = overlapWidth * overlapHeight;

        const itemArea = itemRect.width * itemRect.height;
        const overlapPercentage = (overlapArea / itemArea) * 100;

        // If dragged item covers 50% or more of this item, swap positions
        if (overlapPercentage >= 50) {
          targetItem = item;
          break;
        }
      }
    }

    if (targetItem) {
      const draggedIndex = this.originalIndex;
      const targetIndex = Array.from(this.container.children).indexOf(
        targetItem
      );

      // Only swap if they're different positions
      if (draggedIndex !== targetIndex) {
        this.placeholder.remove();

        // Move the target item to the dragged item's original position
        this.container.insertBefore(
          targetItem,
          this.container.children[draggedIndex]
        );

        // Put placeholder back where the target item was
        this.container.insertBefore(
          this.placeholder,
          this.container.children[targetIndex]
        );

        // Update original index since positions have changed
        this.originalIndex = targetIndex;
      }
    }

    this.highlightAdjacentDeletedItems(draggedRect);
  }

  highlightAdjacentDeletedItems(draggedRect) {
    this.container.classList.remove("drag-near-deleted");

    const deletedItems = this.container.querySelectorAll(".permanent-deleted");
    let isNearDeleted = false;

    deletedItems.forEach((deletedItem) => {
      const deletedRect = deletedItem.getBoundingClientRect();

      const expandedTop = deletedRect.top - 40;
      const expandedBottom = deletedRect.bottom + 40;
      const expandedLeft = deletedRect.left - 40;
      const expandedRight = deletedRect.right + 40;

      const isNear =
        draggedRect.bottom > expandedTop &&
        draggedRect.top < expandedBottom &&
        draggedRect.right > expandedLeft &&
        draggedRect.left < expandedRight;

      if (isNear) {
        isNearDeleted = true;
        deletedItem.style.borderColor = "var(--accent-light-red)";
        deletedItem.style.background = "rgba(255, 59, 48, 0.2)";
      } else {
        deletedItem.style.borderColor = "";
        deletedItem.style.background = "";
        deletedItem.style.transform = "";
      }
    });

    if (isNearDeleted) {
      this.container.classList.add("drag-near-deleted");
    }
  }

  handleMouseUp(e) {
    this.completeDragOperation();
  }

  // Touch end with cleanup
  handleTouchEnd(e) {
    if (this.isPotentialDragAction && !this.isItemBeingDragged) {
      this.isPotentialDragAction = false;
      if (this.touchDragTimeout) {
        clearTimeout(this.touchDragTimeout);
        this.touchDragTimeout = null;
      }
      this.initialTouchElement = null;
      return;
    }

    this.completeDragOperation();
  }

  completeDragOperation() {
    if (this.isOverDeleteZone && this.currentlyDraggedItem) {
      this.removeDraggedItem();
    } else {
      if (this.dragTimeout) {
        clearTimeout(this.dragTimeout);
        this.dragTimeout = null;
      }

      if (this.touchDragTimeout) {
        clearTimeout(this.touchDragTimeout);
        this.touchDragTimeout = null;
      }

      if (!this.isItemBeingDragged) return;

      this.isItemBeingDragged = false;

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      if (this.currentlyDraggedItem && this.placeholder) {
        this.snapItemToGrid();
      } else {
        this.resetDragState();
      }
    }

    // Re-enable scroll on touch devices
    if (this.isTouchCapableDevice) {
      this.restorePageScroll();
    }

    this.floatingDeleteZone.classList.remove("visible", "active");
    this.isOverDeleteZone = false;
    this.isPotentialDragAction = false;
    this.initialTouchElement = null;
  }

  snapItemToGrid() {
    if (!this.currentlyDraggedItem || !this.placeholder) return;

    this.container.insertBefore(this.currentlyDraggedItem, this.placeholder);
    this.resetDragState();
    this.persistItemOrder();

    // Trigger scroll animations after snap to fix conflicts with transitions.js
    this.triggerScrollAnimations();
  }

  triggerScrollAnimations() {
    // Auto-scroll 1px down and back up to trigger transitions.js
    const currentScroll = window.pageYOffset;

    // Scroll down 1px
    window.scrollTo({
      top: currentScroll + 1,
      behavior: "auto",
    });

    // Scroll back immediately
    requestAnimationFrame(() => {
      window.scrollTo({
        top: currentScroll,
        behavior: "auto",
      });
    });
  }

  resetDragState() {
    if (this.container) {
      this.container.classList.remove("drag-near-deleted");
      const deletedItems =
        this.container.querySelectorAll(".permanent-deleted");
      deletedItems.forEach((item) => {
        item.style.borderColor = "";
        item.style.background = "";
        item.style.transform = "";
      });
    }

    if (this.currentlyDraggedItem) {
      this.currentlyDraggedItem.classList.remove("dragging");
      this.currentlyDraggedItem.style.position = "";
      this.currentlyDraggedItem.style.left = "";
      this.currentlyDraggedItem.style.top = "";
      this.currentlyDraggedItem.style.zIndex = "";
      this.currentlyDraggedItem.style.pointerEvents = "";
      this.currentlyDraggedItem.style.transform = "";
      this.currentlyDraggedItem.style.width = "";
      this.currentlyDraggedItem.style.height = "";
      this.currentlyDraggedItem.style.removeProperty("--item-width");
      this.currentlyDraggedItem.style.removeProperty("--item-height");
    }

    if (this.placeholder && this.placeholder.parentElement) {
      this.placeholder.parentElement.removeChild(this.placeholder);
    }

    this.currentlyDraggedItem = null;
    this.placeholder = null;
    this.container = null;
    this.animationFrame = null;
    this.itemWidth = 0;
    this.itemHeight = 0;
    this.dragStartTime = 0;
    this.currentTargetIndex = -1;
    this.lastSnapTime = 0;
  }

  persistItemOrder() {
    if (!this.container) return;

    const items = Array.from(this.container.children);
    const order = items.map((item) => item.dataset.originalIndex);
  }

  destroy() {
    document.removeEventListener("mousedown", this.handleMouseDown);
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("touchstart", this.handleTouchStart);
    document.removeEventListener("touchmove", this.handleTouchMove);
    document.removeEventListener("touchend", this.handleTouchEnd);
    document.removeEventListener("selectstart", this.handleSelectStart);
    document.removeEventListener("keydown", this.handleKeyDown);

    if (this.floatingDeleteZone) {
      this.floatingDeleteZone.remove();
    }

    this.restorePageScroll(); // Ensure scroll is re-enabled
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.dragDropManager = new ItemDragManager();
    window.dragDropManager.initGlobalRestore();
  }, 100);
});


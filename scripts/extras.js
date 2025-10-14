// /scripts/extras.js

// ################## //
//  Console messages  //
// ################## //
console.log(
  "%cPeeking under the hood huh..👀 Noman likes you.",
  "font-size: 18px; font-weight: bold; color: #ff3b30; background: #222; padding: 4px 8px; border-radius: 4px;"
);

let devToolsTimer;

function checkDevTools() {
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;

  if (widthThreshold || heightThreshold) {
    if (!devToolsTimer) {
      devToolsTimer = setTimeout(() => {
        console.log(
          "%cAnother presence has joined you. They're quiet... for now.",
          "font-size: 18px; font-weight: bold; color: #ff3b30; background: #222; padding: 8px 12px; border-radius: 6px;"
        );
      }, 15000);
    }
  } else {
    clearTimeout(devToolsTimer);
    devToolsTimer = null;
  }
}

setInterval(checkDevTools, 1000);

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
let heroTimer;
let toast = null;

function checkHeroSection() {
  const heroSection = document.querySelector(".hero-section");
  const scrollY = window.scrollY;
  const heroHeight = heroSection.offsetHeight;

  if (scrollY < heroHeight * 0.8) {
    if (!heroTimer && !toast) {
      heroTimer = setTimeout(() => {
        showToast();
      }, 15000);
    }
  } else {
    clearTimeout(heroTimer);
    heroTimer = null;
  }
}

function showToast() {
  toast = document.createElement("div");
  toast.className = "hero-toast";
  toast.textContent =
    "You have been staring at this part of the page for way too long. Come on, scroll now... :))";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);
}

function hideToast() {
  if (toast && document.body.contains(toast)) {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast && document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
      toast = null;
    }, 500);
  } else {
    toast = null;
  }
}

window.addEventListener("scroll", function () {
  if (toast && document.body.contains(toast)) {
    hideToast();
  }
  clearTimeout(heroTimer);
  heroTimer = null;
});

checkHeroSection();

// ##################### //
//  About section toast  //
// ##################### //
let aboutTimer;
let aboutToastShown = false;

function checkAboutSection() {
  if (aboutToastShown) return;

  const aboutSection = document.querySelector("#about");
  const aboutRect = aboutSection.getBoundingClientRect();

  if (
    aboutRect.top < window.innerHeight * 0.8 &&
    aboutRect.bottom > window.innerHeight * 0.2
  ) {
    if (!aboutTimer) {
      aboutTimer = setTimeout(() => {
        showAboutToast();
      }, 10000);
    }
  } else {
    clearTimeout(aboutTimer);
    aboutTimer = null;
  }
}

function showAboutToast() {
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

window.addEventListener("scroll", checkAboutSection);
checkAboutSection();

// ########################## //
//  Speed toast notification  //
// ########################## //
const SCROLL_THRESHOLD = 1200; // pixels of fast scrolling required
const SCROLL_SPEED_THRESHOLD = 0.8; // pixels per millisecond
const COOLDOWN_TIME = 10000; // 10 seconds in milliseconds
const RESET_AMOUNT = 50; // pixels to reset when not fast scrolling

let lastScrollTop = 0;
let lastScrollTime = Date.now();
let fastScrollDistance = 0;
let lastToastTime = 0;
let isCoolingDown = false;

function checkScrollSpeed() {
  const currentTime = Date.now();

  // Check if we're in cooldown period
  if (isCoolingDown && currentTime - lastToastTime < COOLDOWN_TIME) {
    return;
  } else if (isCoolingDown) {
    isCoolingDown = false;
  }

  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  const timeDiff = currentTime - lastScrollTime;

  if (timeDiff > 0) {
    const scrollDistance = currentScrollTop - lastScrollTop;
    const scrollSpeed = Math.abs(scrollDistance) / timeDiff;

    // Only track when scrolling down
    if (scrollDistance > 0 && scrollSpeed > SCROLL_SPEED_THRESHOLD) {
      fastScrollDistance += scrollDistance;

      if (fastScrollDistance > SCROLL_THRESHOLD) {
        showSpeedToast();
        fastScrollDistance = 0;
        lastToastTime = currentTime;
        isCoolingDown = true;
      }
    } else {
      fastScrollDistance = Math.max(0, fastScrollDistance - RESET_AMOUNT);
    }
  }

  lastScrollTop = currentScrollTop;
  lastScrollTime = currentTime;
}

function showSpeedToast() {
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
  }, 3500);
}

window.addEventListener("scroll", checkScrollSpeed);

// ###################### //
//  Sleep mode animation  //
// ###################### //
let sleepTimer;
let blankTimer;
let heartbeatTimer;
let overlay = null;

function initSleepMode() {
  overlay = document.createElement("div");
  overlay.className = "sleep-overlay";

  // Create heartbeat monitor HTML
  overlay.innerHTML = `
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

  document.body.appendChild(overlay);
  resetSleepTimers();

  // Reset timers on any interaction
  document.addEventListener("mousemove", wakePage);
  document.addEventListener("keydown", wakePage);
  document.addEventListener("click", wakePage);
  document.addEventListener("scroll", wakePage);
  document.addEventListener("touchstart", wakePage);
}

function resetSleepTimers() {
  clearTimeout(sleepTimer);
  clearTimeout(blankTimer);
  clearTimeout(heartbeatTimer);

  sleepTimer = setTimeout(() => {
    startSleepAnimation();
  }, 50000); // 50 seconds until sleep starts
}

function startSleepAnimation() {
  overlay.classList.add("blur");

  blankTimer = setTimeout(() => {
    overlay.classList.remove("blur");
    overlay.classList.add("blank");

    // Show heartbeat after blank screen
    heartbeatTimer = setTimeout(() => {
      overlay.classList.add("show-heartbeat");
    }, 8000); // 8 seconds after going blank
  }, 5000); // 5 seconds of blur
}

function wakePage() {
  // Remove all sleep-related classes
  overlay.classList.remove("blur", "blank", "show-heartbeat");
  overlay.classList.add("waking");

  setTimeout(() => {
    overlay.classList.remove("waking");
  }, 300);

  resetSleepTimers();
}

document.addEventListener("DOMContentLoaded", initSleepMode);

// Keep screen on for 1.5 minutes of inactivity
let wakeLock = null;
let idleTimer = null;
const idleTime = 90000;

function startIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }

  idleTimer = setTimeout(keepScreenOn, idleTime);
}

async function keepScreenOn() {
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
  document.addEventListener(event, startIdleTimer);
});

startIdleTimer();

// ################### //
// Item dragging logic //
// ################### //
class DragDropManager {
  constructor() {
    this.draggedItem = null;
    this.dragOffset = { x: 0, y: 0 };
    this.placeholder = null;
    this.originalIndex = null;
    this.container = null;
    this.isDragging = false;
    this.snapThreshold = 60;
    this.animationFrame = null;
    this.itemWidth = 0;
    this.itemHeight = 0;
    this.dragStartTime = 0;
    this.dragStartPosition = { x: 0, y: 0 };
    this.currentTargetIndex = -1;
    this.lastSnapTime = 0;
    this.snapCooldown = 100;

    this.init();
  }

  init() {
    this.setupContainers();
    this.bindEvents();
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
        this.makeContainerDraggable(container);
      }
    });
  }

  makeContainerDraggable(container) {
    container.classList.add("draggable-container", "draggable-grid");

    const items = container.children;
    [...items].forEach((item, index) => {
      item.classList.add("draggable-item");
      if (!item.dataset.originalIndex) {
        item.dataset.originalIndex = index;
      }
    });
  }

  bindEvents() {
    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));

    document.addEventListener("touchstart", this.handleTouchStart.bind(this), {
      passive: false,
    });
    document.addEventListener("touchmove", this.handleTouchMove.bind(this), {
      passive: false,
    });
    document.addEventListener("touchend", this.handleTouchEnd.bind(this));

    document.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("selectstart", this.handleSelectStart.bind(this));
  }

  handleSelectStart(e) {
    if (e.target.closest(".draggable-item")) {
      e.preventDefault();
    }
  }

  handleMouseDown(e) {
    if (!e.target.closest(".draggable-item")) return;

    const item = e.target.closest(".draggable-item");
    this.dragStartTime = Date.now();
    this.dragStartPosition = { x: e.clientX, y: e.clientY };

    this.dragTimeout = setTimeout(() => {
      this.startDrag(item, e.clientX, e.clientY);
    }, 150);

    e.preventDefault();
  }

  handleTouchStart(e) {
    if (!e.target.closest(".draggable-item")) return;

    const touch = e.touches[0];
    const item = e.target.closest(".draggable-item");
    this.dragStartTime = Date.now();
    this.dragStartPosition = { x: touch.clientX, y: touch.clientY };

    this.dragTimeout = setTimeout(() => {
      this.startDrag(item, touch.clientX, touch.clientY);
    }, 200);

    e.preventDefault();
  }

  startDrag(item, clientX, clientY) {
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
    }

    this.draggedItem = item;
    this.container = item.parentElement;
    this.isDragging = true;

    const rect = item.getBoundingClientRect();
    this.itemWidth = rect.width;
    this.itemHeight = rect.height;

    item.style.setProperty("--item-width", `${this.itemWidth}px`);
    item.style.setProperty("--item-height", `${this.itemHeight}px`);

    this.dragOffset.x = clientX - rect.left;
    this.dragOffset.y = clientY - rect.top;

    this.originalIndex = Array.from(this.container.children).indexOf(item);
    this.currentTargetIndex = this.originalIndex;

    this.createPlaceholder();
    item.classList.add("dragging");
    this.updateItemPosition(clientX, clientY);

    setTimeout(() => {
      if (this.placeholder) {
        this.placeholder.style.opacity = "0.4";
      }
    }, 100);
  }

  createPlaceholder() {
    this.placeholder = document.createElement("div");
    this.placeholder.classList.add("draggable-item", "placeholder");

    this.placeholder.style.width = `${this.itemWidth}px`;
    this.placeholder.style.height = `${this.itemHeight}px`;
    this.placeholder.style.opacity = "0";

    this.container.insertBefore(this.placeholder, this.draggedItem);
  }

  handleMouseMove(e) {
    if (this.dragTimeout && !this.isDragging) {
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

    if (!this.isDragging) return;
    this.updateDrag(e.clientX, e.clientY);
    e.preventDefault();
  }

  handleTouchMove(e) {
    if (this.dragTimeout && !this.isDragging) {
      const touch = e.touches[0];
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - this.dragStartPosition.x, 2) +
          Math.pow(touch.clientY - this.dragStartPosition.y, 2)
      );

      if (moveDistance > 15) {
        clearTimeout(this.dragTimeout);
        this.dragTimeout = null;
        return;
      }
    }

    if (!this.isDragging) return;
    const touch = e.touches[0];
    this.updateDrag(touch.clientX, touch.clientY);
    e.preventDefault();
  }

  updateDrag(clientX, clientY) {
    if (!this.draggedItem || !this.isDragging) return;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.updateItemPosition(clientX, clientY);

      const now = Date.now();
      if (now - this.lastSnapTime > this.snapCooldown) {
        this.handleSnapping();
        this.lastSnapTime = now;
      }
    });
  }

  updateItemPosition(clientX, clientY) {
    const x = clientX - this.dragOffset.x;
    const y = clientY - this.dragOffset.y;

    this.draggedItem.style.position = "fixed";
    this.draggedItem.style.left = `${x}px`;
    this.draggedItem.style.top = `${y}px`;
    this.draggedItem.style.zIndex = "1000";
    this.draggedItem.style.pointerEvents = "none";
    this.draggedItem.style.width = `${this.itemWidth}px`;
    this.draggedItem.style.height = `${this.itemHeight}px`;
  }

  handleSnapping() {
    if (!this.draggedItem || !this.placeholder) return;

    const draggedRect = this.draggedItem.getBoundingClientRect();
    const items = Array.from(this.container.children).filter(
      (child) => child !== this.draggedItem && child !== this.placeholder
    );

    const draggedCenterY = draggedRect.top + draggedRect.height / 2;

    const targetPositions = [];

    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterY = itemRect.top + itemRect.height / 2;

      targetPositions.push({
        item: item,
        index: index,
        centerY: itemCenterY,
        distance: Math.abs(draggedCenterY - itemCenterY),
      });
    });

    if (items.length > 0) {
      const firstItem = items[0];
      const firstRect = firstItem.getBoundingClientRect();
      targetPositions.push({
        item: firstItem,
        index: -1,
        centerY: firstRect.top - this.itemHeight / 2,
        distance: Math.abs(
          draggedCenterY - (firstRect.top - this.itemHeight / 2)
        ),
      });

      const lastItem = items[items.length - 1];
      const lastRect = lastItem.getBoundingClientRect();
      targetPositions.push({
        item: lastItem,
        index: items.length,
        centerY: lastRect.bottom + this.itemHeight / 2,
        distance: Math.abs(
          draggedCenterY - (lastRect.bottom + this.itemHeight / 2)
        ),
      });
    }

    const validTargets = targetPositions.filter(
      (target) => target.distance < this.snapThreshold
    );

    if (validTargets.length > 0) {
      validTargets.sort((a, b) => a.distance - b.distance);
      const bestTarget = validTargets[0];

      if (bestTarget.index !== this.currentTargetIndex) {
        this.currentTargetIndex = bestTarget.index;
        this.moveToTargetPosition(bestTarget);
      }
    } else {
      if (this.currentTargetIndex !== this.originalIndex) {
        this.currentTargetIndex = this.originalIndex;
        this.moveToOriginalPosition();
      }
    }
  }

  moveToTargetPosition(target) {
    const placeholderIndex = Array.from(this.container.children).indexOf(
      this.placeholder
    );
    let targetIndex = target.index;

    if (target.index === -1) {
      targetIndex = 0;
    } else if (target.index >= this.container.children.length - 1) {
      targetIndex = this.container.children.length - 1;
    } else {
      const itemRect = target.item.getBoundingClientRect();
      const draggedRect = this.draggedItem.getBoundingClientRect();
      const draggedCenterY = draggedRect.top + draggedRect.height / 2;
      const itemCenterY = itemRect.top + itemRect.height / 2;

      targetIndex = Array.from(this.container.children).indexOf(target.item);
      if (draggedCenterY > itemCenterY) {
        targetIndex += 1;
      }
    }

    if (
      placeholderIndex !== targetIndex &&
      targetIndex >= 0 &&
      targetIndex < this.container.children.length
    ) {
      const targetElement = this.container.children[targetIndex];
      if (targetElement !== this.placeholder) {
        this.container.insertBefore(this.placeholder, targetElement);
      }
    }
  }

  moveToOriginalPosition() {
    const placeholderIndex = Array.from(this.container.children).indexOf(
      this.placeholder
    );
    const originalElement = this.container.children[this.originalIndex];

    if (originalElement && placeholderIndex !== this.originalIndex) {
      this.container.insertBefore(this.placeholder, originalElement);
    }
  }

  handleMouseUp(e) {
    this.endDrag();
  }

  handleTouchEnd(e) {
    this.endDrag();
  }

  endDrag() {
    if (this.dragTimeout) {
      clearTimeout(this.dragTimeout);
      this.dragTimeout = null;
    }

    if (!this.isDragging) return;

    this.isDragging = false;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    if (this.draggedItem && this.placeholder) {
      this.snapToPosition();
    } else {
      this.cleanup();
    }
  }

  snapToPosition() {
    if (!this.draggedItem || !this.placeholder) return;

    this.container.insertBefore(this.draggedItem, this.placeholder);
    this.cleanup();
    this.saveOrder();

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

  cleanup() {
    if (this.draggedItem) {
      this.draggedItem.classList.remove("dragging");
      this.draggedItem.style.position = "";
      this.draggedItem.style.left = "";
      this.draggedItem.style.top = "";
      this.draggedItem.style.zIndex = "";
      this.draggedItem.style.pointerEvents = "";
      this.draggedItem.style.transform = "";
      this.draggedItem.style.width = "";
      this.draggedItem.style.height = "";
      this.draggedItem.style.removeProperty("--item-width");
      this.draggedItem.style.removeProperty("--item-height");
    }

    if (this.placeholder && this.placeholder.parentElement) {
      this.placeholder.parentElement.removeChild(this.placeholder);
    }

    this.draggedItem = null;
    this.placeholder = null;
    this.container = null;
    this.animationFrame = null;
    this.itemWidth = 0;
    this.itemHeight = 0;
    this.dragStartTime = 0;
    this.currentTargetIndex = -1;
    this.lastSnapTime = 0;
  }

  saveOrder() {
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
  }
}

// Initialize drag and drop when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.dragDropManager = new DragDropManager();
  }, 100);
});


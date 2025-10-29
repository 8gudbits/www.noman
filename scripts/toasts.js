// /scripts/toasts.js

function isDesktop() {
  return !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// ############################### //
//  Fullscreen prompt on pageload  //
// ############################### //
let fullscreenToast = null;

function displayFullscreenPromptToast() {
  if (fullscreenToast) return;

  fullscreenToast = document.createElement("div");
  fullscreenToast.className = "fullscreen-toast";
  fullscreenToast.innerHTML = `
    <p>You're missing something... fullscreen makes it visible.</p>
    <div class="fullscreen-toast-buttons">
      <button id="fullscreen-yes">Enter Fullscreen</button>
      <button id="fullscreen-no">Not now</button>
    </div>
  `;

  document.body.appendChild(fullscreenToast);

  setTimeout(() => {
    fullscreenToast.classList.add("show");
  }, 100);

  document.getElementById("fullscreen-yes").addEventListener("click", () => {
    document.documentElement.requestFullscreen();
    removeFullscreenPromptToast();
  });

  document
    .getElementById("fullscreen-no")
    .addEventListener("click", removeFullscreenPromptToast);

  setTimeout(removeFullscreenPromptToast, 8000);
}

function removeFullscreenPromptToast() {
  if (fullscreenToast && document.body.contains(fullscreenToast)) {
    fullscreenToast.classList.remove("show");
    setTimeout(() => {
      if (fullscreenToast && document.body.contains(fullscreenToast)) {
        document.body.removeChild(fullscreenToast);
      }
      fullscreenToast = null;
    }, 500);
  }
}

window.addEventListener("load", () => {
  const isNotFullscreen = window.screenTop === 0 || window.screenY === 0;

  if (isDesktop() && isNotFullscreen) {
    displayFullscreenPromptToast();
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

// #################### //
//  See Parallax Toast  //
// #################### //
let parallaxToastShown = false;

function monitorScrollDepthForParallaxToast() {
  if (parallaxToastShown) return;

  if (window.scrollY >= 1600) {
    parallaxToastShown = true;
    displayParallaxToast();
  }
}

function displayParallaxToast() {
  const toast = document.createElement("div");
  toast.className = "parallax-toast";
  toast.textContent =
    "Mouse movement reveals what's layered beneath. Move it, and you will see the parallax.";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  toast.addEventListener("click", removeParallaxToast);

  setTimeout(removeParallaxToast, 10000);
}

function removeParallaxToast() {
  const toast = document.querySelector(".parallax-toast");
  if (toast && document.body.contains(toast)) {
    toast.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 500);
  }
}

if (isDesktop()) {
  window.addEventListener("scroll", monitorScrollDepthForParallaxToast);
}

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
    if (devToolsToast && document.body.contains(devToolsToast)) return; // Don't show multiple toasts

    devToolsToast = document.createElement("div");
    devToolsToast.className = "devtools-toast";
    devToolsToast.innerHTML = `
            <p>The source code of this page is available at:</p>
            <a href="https://github.com/8gudbits/www.noman" target="_blank">github.com/8gudbits/www.noman</a>
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
    }, 8000);

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


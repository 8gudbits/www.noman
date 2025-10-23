// /scripts/transitions.js

// Helper function to set styles without triggering transitions
function setStylesWithoutTransition(element, styles) {
  const originalTransition = element.style.transition; // Store original transition
  element.style.transition = "none"; // Disable transitions

  // Apply all styles
  Object.keys(styles).forEach((property) => {
    element.style[property] = styles[property];
  });

  element.offsetHeight; // Force reflow to ensure styles are applied

  // Restore transitions on next frame
  requestAnimationFrame(() => {
    element.style.transition = originalTransition;
  });
}

// ##################################### //
//  Scroll-based directional animations  //
// ##################################### //
function initializeDirectionalScrollFade() {
  function updateDirectionalFadeAnimations() {
    const fadeElements = document.querySelectorAll(".scroll-fade");
    const windowHeight = window.innerHeight;

    fadeElements.forEach((currentElement) => {
      const elementBounds = currentElement.getBoundingClientRect();

      // Default scroll window
      let animationStartPoint = windowHeight * 0.75;
      let animationEndPoint = windowHeight * 0.55;

      // Special case for last item (prevents half animated state)
      if (currentElement.id === "last-item") {
        animationStartPoint = windowHeight * 0.95;
        animationEndPoint = windowHeight * 0.85;
      }

      const scrollProgress =
        (animationStartPoint - elementBounds.top) /
        (animationStartPoint - animationEndPoint);
      const normalizedProgress = Math.max(0, Math.min(1, scrollProgress));

      let transformValue = "";

      if (currentElement.classList.contains("fade-up")) {
        transformValue = `translateY(${(1 - normalizedProgress) * 30}px)`;
      } else if (currentElement.classList.contains("fade-down")) {
        transformValue = `translateY(${(normalizedProgress - 1) * 30}px)`;
      } else if (currentElement.classList.contains("fade-left")) {
        transformValue = `translateX(${(1 - normalizedProgress) * 30}px)`;
      } else if (currentElement.classList.contains("fade-right")) {
        transformValue = `translateX(${(normalizedProgress - 1) * 30}px)`;
      }

      setStylesWithoutTransition(currentElement, {
        opacity: normalizedProgress.toFixed(2),
        transform: transformValue,
      });
    });
  }

  window.addEventListener("scroll", updateDirectionalFadeAnimations);
  window.addEventListener("resize", updateDirectionalFadeAnimations);
  updateDirectionalFadeAnimations();
}

// ############################# //
//  Scroll-based zoom animations //
// ############################# //
function initializeScrollZoomEffect() {
  function updateZoomScrollAnimations() {
    const zoomElements = document.querySelectorAll(".scroll-zoom");
    const windowHeight = window.innerHeight;

    zoomElements.forEach((currentElement) => {
      const elementBounds = currentElement.getBoundingClientRect();
      const zoomStartThreshold = windowHeight * 0.75;
      const zoomEndThreshold = windowHeight * 0.55;

      const scrollProgress =
        (zoomStartThreshold - elementBounds.top) /
        (zoomStartThreshold - zoomEndThreshold);
      const normalizedProgress = Math.max(0, Math.min(1, scrollProgress));

      const zoomScale = 0.8 + normalizedProgress * 0.2;

      setStylesWithoutTransition(currentElement, {
        opacity: normalizedProgress.toFixed(2),
        transform: `scale(${zoomScale.toFixed(3)})`,
      });
    });
  }

  window.addEventListener("scroll", updateZoomScrollAnimations);
  window.addEventListener("resize", updateZoomScrollAnimations);
  updateZoomScrollAnimations();
}

function initializeScrollBlurEffect() {
  function updateBlurScrollAnimations() {
    const blurElements = document.querySelectorAll(".scroll-blur");
    const windowHeight = window.innerHeight;

    blurElements.forEach((currentElement) => {
      const elementBounds = currentElement.getBoundingClientRect();
      const blurStartThreshold = windowHeight * 0.75;
      const blurEndThreshold = windowHeight * 0.55;

      const scrollProgress =
        (blurStartThreshold - elementBounds.top) /
        (blurStartThreshold - blurEndThreshold);
      const normalizedProgress = Math.max(0, Math.min(1, scrollProgress));

      const blurAmount = 8 * (1 - normalizedProgress);

      setStylesWithoutTransition(currentElement, {
        opacity: normalizedProgress.toFixed(2),
        filter: `blur(${blurAmount.toFixed(2)}px)`,
      });
    });
  }

  window.addEventListener("scroll", updateBlurScrollAnimations);
  window.addEventListener("resize", updateBlurScrollAnimations);
  updateBlurScrollAnimations();
}

// ########################### //
//  Scroll-based orbit effect  //
// ########################### //
function initializeScrollOrbitEffect() {
  function updateOrbitScrollAnimations() {
    const orbitElements = document.querySelectorAll(".tech-item.scroll-orbit");
    const windowHeight = window.innerHeight;

    orbitElements.forEach((currentElement, elementIndex) => {
      const elementBounds = currentElement.getBoundingClientRect();
      const orbitStartThreshold = windowHeight * 0.8;
      const orbitEndThreshold = windowHeight * 0.6;

      const scrollProgress =
        (orbitStartThreshold - elementBounds.top) /
        (orbitStartThreshold - orbitEndThreshold);
      const normalizedProgress = Math.max(0, Math.min(1, scrollProgress));

      const rotationAngle = -15 + normalizedProgress * 15;
      const horizontalOffset = 60 * (1 - normalizedProgress);
      const orbitScale = 0.9 + normalizedProgress * 0.1;

      setStylesWithoutTransition(currentElement, {
        opacity: normalizedProgress.toFixed(2),
        transform: `rotate(${rotationAngle.toFixed(
          1
        )}deg) translateX(${horizontalOffset.toFixed(
          1
        )}px) scale(${orbitScale.toFixed(3)})`,
      });
    });
  }

  window.addEventListener("scroll", updateOrbitScrollAnimations);
  window.addEventListener("resize", updateOrbitScrollAnimations);
  updateOrbitScrollAnimations();
}

// Force refresh for dynamically added elements
window.refreshAllScrollAnimations = function () {
  // Trigger all animation functions immediately
  const event = new Event("scroll");
  window.dispatchEvent(event);
};

// MutationObserver to detect new elements and apply correct styles immediately
function initializeMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    let hasNewAnimatableElements = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            if (
              node.matches(
                ".scroll-fade, .scroll-zoom, .scroll-blur, .scroll-orbit"
              ) ||
              (node.querySelector &&
                node.querySelector(
                  ".scroll-fade, .scroll-zoom, .scroll-blur, .scroll-orbit"
                ))
            ) {
              hasNewAnimatableElements = true;
            }
          }
        });
      }
    });

    if (hasNewAnimatableElements) {
      // Use setTimeout to ensure DOM is fully updated, then apply correct styles
      setTimeout(() => {
        window.refreshAllScrollAnimations();
      }, 0);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeDirectionalScrollFade();
  initializeScrollZoomEffect();
  initializeScrollBlurEffect();
  initializeScrollOrbitEffect();
  initializeMutationObserver();
});


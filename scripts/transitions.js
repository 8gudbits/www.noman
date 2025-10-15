// /scripts/transitions.js

// ##################################### //
//  Scroll-based directional animations  //
// ##################################### //
function initializeDirectionalScrollFade() {
  const fadeElements = document.querySelectorAll(".scroll-fade");

  function updateDirectionalFadeAnimations() {
    const windowHeight = window.innerHeight;

    fadeElements.forEach((currentElement) => {
      const elementBounds = currentElement.getBoundingClientRect();

      // Default scroll window
      let animationStartPoint = windowHeight * 0.75;
      let animationEndPoint = windowHeight * 0.55;

      // Special case for last item
      if (currentElement.id === "last-item") {
        animationStartPoint = windowHeight * 0.95;
        animationEndPoint = windowHeight * 0.85;
      }

      const scrollProgress =
        (animationStartPoint - elementBounds.top) /
        (animationStartPoint - animationEndPoint);
      const normalizedProgress = Math.max(0, Math.min(1, scrollProgress));

      currentElement.style.opacity = normalizedProgress.toFixed(2);

      if (currentElement.classList.contains("fade-up")) {
        currentElement.style.transform = `translateY(${
          (1 - normalizedProgress) * 30
        }px)`;
      } else if (currentElement.classList.contains("fade-down")) {
        currentElement.style.transform = `translateY(${
          (normalizedProgress - 1) * 30
        }px)`;
      } else if (currentElement.classList.contains("fade-left")) {
        currentElement.style.transform = `translateX(${
          (1 - normalizedProgress) * 30
        }px)`;
      } else if (currentElement.classList.contains("fade-right")) {
        currentElement.style.transform = `translateX(${
          (normalizedProgress - 1) * 30
        }px)`;
      }
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
  const zoomElements = document.querySelectorAll(".scroll-zoom");

  function updateZoomScrollAnimations() {
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
      currentElement.style.opacity = normalizedProgress.toFixed(2);
      currentElement.style.transform = `scale(${zoomScale.toFixed(3)})`;
    });
  }

  window.addEventListener("scroll", updateZoomScrollAnimations);
  window.addEventListener("resize", updateZoomScrollAnimations);
  updateZoomScrollAnimations();
}

function initializeScrollBlurEffect() {
  const blurElements = document.querySelectorAll(".scroll-blur");

  function updateBlurScrollAnimations() {
    const windowHeight = window.innerHeight;

    blurElements.forEach((currentElement) => {
      const elementBounds = currentElement.getBoundingClientRect();
      const blurStartThreshold = windowHeight * 0.75;
      const blurEndThreshold = windowHeight * 0.55;

      const scrollProgress =
        (blurStartThreshold - elementBounds.top) /
        (blurStartThreshold - blurEndThreshold);
      const normalizedProgress = Math.max(0, Math.min(1, scrollProgress));

      const blurAmount = 8 * (1 - normalizedProgress); // from 8px to 0px
      currentElement.style.opacity = normalizedProgress.toFixed(2);
      currentElement.style.filter = `blur(${blurAmount.toFixed(2)}px)`;
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
  const orbitElements = document.querySelectorAll(".tech-item.scroll-orbit");

  function updateOrbitScrollAnimations() {
    const windowHeight = window.innerHeight;

    orbitElements.forEach((currentElement, elementIndex) => {
      const elementBounds = currentElement.getBoundingClientRect();
      const orbitStartThreshold = windowHeight * 0.8;
      const orbitEndThreshold = windowHeight * 0.6;

      const scrollProgress =
        (orbitStartThreshold - elementBounds.top) /
        (orbitStartThreshold - orbitEndThreshold);
      const normalizedProgress = Math.max(0, Math.min(1, scrollProgress));

      // Orbit effect: rotate + translate + scale
      const rotationAngle = -15 + normalizedProgress * 15; // -15deg to 0deg
      const horizontalOffset = 60 * (1 - normalizedProgress); // from 60px to 0
      const orbitScale = 0.9 + normalizedProgress * 0.1; // from 0.9 to 1.0

      currentElement.style.opacity = normalizedProgress.toFixed(2);
      currentElement.style.transform = `rotate(${rotationAngle.toFixed(
        1
      )}deg) translateX(${horizontalOffset.toFixed(
        1
      )}px) scale(${orbitScale.toFixed(3)})`;
    });
  }

  window.addEventListener("scroll", updateOrbitScrollAnimations);
  window.addEventListener("resize", updateOrbitScrollAnimations);
  updateOrbitScrollAnimations();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeDirectionalScrollFade();
  initializeScrollZoomEffect();
  initializeScrollBlurEffect();
  initializeScrollOrbitEffect();
});


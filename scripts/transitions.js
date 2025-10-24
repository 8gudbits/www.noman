// /scripts/transitions.js

// Helper function to set styles without triggering transitions
function setStylesWithoutTransition(element, styles) {
  const originalTransition = element.style.transition;
  element.style.transition = "none";

  Object.keys(styles).forEach((property) => {
    element.style[property] = styles[property];
  });

  element.offsetHeight;

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

      let animationStartPoint = windowHeight * 0.75;
      let animationEndPoint = windowHeight * 0.55;

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

      if (normalizedProgress === 1) {
        currentElement.classList.add("animation-complete");
      } else {
        currentElement.classList.remove("animation-complete");
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

      if (normalizedProgress === 1) {
        currentElement.classList.add("animation-complete");
      } else {
        currentElement.classList.remove("animation-complete");
      }
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

      if (normalizedProgress === 1) {
        currentElement.classList.add("animation-complete");
      } else {
        currentElement.classList.remove("animation-complete");
      }
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

      if (normalizedProgress === 1) {
        currentElement.classList.add("animation-complete");
      } else {
        currentElement.classList.remove("animation-complete");
      }
    });
  }

  window.addEventListener("scroll", updateOrbitScrollAnimations);
  window.addEventListener("resize", updateOrbitScrollAnimations);
  updateOrbitScrollAnimations();
}

// ####################### //
//  Tilt effect on panels  //
// ####################### //
function initializePanelTilt() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const panel = mutation.target;
        if (panel.classList.contains("glass-panel")) {
          if (
            panel.classList.contains("animation-complete") &&
            !panel.hasAttribute("data-tilt-initialized")
          ) {
            setupTiltForPanel(panel);
            panel.setAttribute("data-tilt-initialized", "true");
          } else if (
            !panel.classList.contains("animation-complete") &&
            panel.hasAttribute("data-tilt-initialized")
          ) {
            removeTiltFromPanel(panel);
            panel.removeAttribute("data-tilt-initialized");
          }
        }
      }
    });
  });

  document.querySelectorAll(".glass-panel").forEach((panel) => {
    observer.observe(panel, { attributes: true });

    if (panel.classList.contains("animation-complete")) {
      setupTiltForPanel(panel);
      panel.setAttribute("data-tilt-initialized", "true");
    }
  });
}

function setupTiltForPanel(panel) {
  let isInitialInteraction = true;

  const mousemoveHandler = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const panelBounds = panel.getBoundingClientRect();
    const mousePanelX = event.clientX - panelBounds.left;
    const mousePanelY = event.clientY - panelBounds.top;

    const panelCenterX = panelBounds.width / 2;
    const panelCenterY = panelBounds.height / 2;

    const tiltRatioX = (mousePanelX - panelCenterX) / panelCenterX;
    const tiltRatioY = (mousePanelY - panelCenterY) / panelCenterY;

    const maximumTiltAngle = 5;
    const tiltAngleX = (tiltRatioY * -maximumTiltAngle).toFixed(2);
    const tiltAngleY = (tiltRatioX * maximumTiltAngle).toFixed(2);

    if (isInitialInteraction) {
      panel.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      isInitialInteraction = false;
      setTimeout(() => {
        panel.style.transition = "box-shadow 0.3s ease";
      }, 300);
    }

    panel.style.transform = `perspective(1000px) rotateX(${tiltAngleX}deg) rotateY(${tiltAngleY}deg) translateZ(10px)`;

    const shadowOffsetX = tiltAngleY * 2;
    const shadowOffsetY = tiltAngleX * 2;
    panel.style.boxShadow = `${shadowOffsetX}px ${shadowOffsetY}px 25px rgba(0, 0, 0, 0.4), var(--glass-shadow)`;
  };

  const mouseleaveHandler = () => {
    isInitialInteraction = true;
    panel.style.transition =
      "transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.5s ease";

    panel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    panel.style.boxShadow = "var(--glass-shadow)";

    setTimeout(() => {
      panel.style.transition = "";
    }, 500);
  };

  const mouseenterHandler = () => {
    panel.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
  };

  panel.addEventListener("mousemove", mousemoveHandler);
  panel.addEventListener("mouseleave", mouseleaveHandler);
  panel.addEventListener("mouseenter", mouseenterHandler);

  panel._tiltHandlers = {
    mousemoveHandler,
    mouseleaveHandler,
    mouseenterHandler,
  };
}

function removeTiltFromPanel(panel) {
  if (panel._tiltHandlers) {
    panel.removeEventListener(
      "mousemove",
      panel._tiltHandlers.mousemoveHandler
    );
    panel.removeEventListener(
      "mouseleave",
      panel._tiltHandlers.mouseleaveHandler
    );
    panel.removeEventListener(
      "mouseenter",
      panel._tiltHandlers.mouseenterHandler
    );
    delete panel._tiltHandlers;
  }

  panel.style.boxShadow = "var(--glass-shadow)";
  panel.style.transition = "";
}

document.addEventListener("DOMContentLoaded", () => {
  initializeDirectionalScrollFade();
  initializeScrollZoomEffect();
  initializeScrollBlurEffect();
  initializeScrollOrbitEffect();
  initializePanelTilt();
  initializeMutationObserver();
});


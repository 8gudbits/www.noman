// /scripts/script.js

// ######################################### //
//  Particle background and parallax effect  //
// ######################################### //
(function () {
  const canvas = document.getElementById("particle-canvas");
  const canvasContext = canvas.getContext("2d");
  const parallaxElem = document.getElementById("parallax");

  let canvasWidth, canvasHeight;
  let particleArray = [];
  const isMobileDevice = window.innerWidth < 480;
  const totalParticles = isMobileDevice ? 18 : 35;
  const maxConnectionDistance = 200;
  const cursorPosition = { x: null, y: null };

  function updateCanvasDimensions() {
    canvasWidth = canvas.width = canvas.offsetWidth;
    canvasHeight = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener("resize", updateCanvasDimensions);
  updateCanvasDimensions();

  for (let i = 0; i < totalParticles; i++) {
    particleArray.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    });
  }

  canvas.addEventListener("mousemove", (event) => {
    const canvasBounds = canvas.getBoundingClientRect();
    cursorPosition.x = event.clientX - canvasBounds.left;
    cursorPosition.y = event.clientY - canvasBounds.top;
  });

  canvas.addEventListener("mouseleave", () => {
    cursorPosition.x = null;
    cursorPosition.y = null;
  });

  document.addEventListener("mousemove", (event) => {
    if (!parallaxElem) return;
    let windowCenterX = window.innerWidth / 2;
    let windowCenterY = window.innerHeight / 2;
    let currentMouseX = event.clientX;
    let currentMouseY = event.clientY;
    let parallaxLayer1 = `${50 - (currentMouseX - windowCenterX) * 0.01}% ${
      50 - (currentMouseY - windowCenterY) * 0.01
    }%`;
    let parallaxLayer2 = `${50 - (currentMouseX - windowCenterX) * 0.02}% ${
      50 - (currentMouseY - windowCenterY) * 0.02
    }%`;
    let parallaxLayer3 = `${50 - (currentMouseX - windowCenterX) * 0.06}% ${
      50 - (currentMouseY - windowCenterY) * 0.06
    }%`;
    let backgroundPosition = `${parallaxLayer3}, ${parallaxLayer2}, ${parallaxLayer1}`;
    parallaxElem.style.backgroundPosition = backgroundPosition;
  });

  function updateScrollEffects() {
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection || !parallaxElem) return;

    const scrollY = window.scrollY;
    const fadeStart = heroSection.offsetHeight * 0.8;
    const fadeEnd = fadeStart + window.innerHeight;

    let parallaxOpacity = 0;
    if (scrollY >= fadeStart && scrollY <= fadeEnd) {
      parallaxOpacity = (scrollY - fadeStart) / (fadeEnd - fadeStart);
    } else if (scrollY > fadeEnd) {
      parallaxOpacity = 1;
    }
    parallaxElem.style.opacity = parallaxOpacity.toFixed(2);

    let canvasOpacity = 1;
    const canvasFadeEnd = fadeStart + 200;
    if (scrollY >= fadeStart && scrollY <= canvasFadeEnd) {
      canvasOpacity = 1 - (scrollY - fadeStart) / (canvasFadeEnd - fadeStart);
    } else if (scrollY > canvasFadeEnd) {
      canvasOpacity = 0;
    }
    canvas.style.opacity = canvasOpacity.toFixed(2);
  }

  window.addEventListener("scroll", updateScrollEffects);
  window.addEventListener("resize", updateScrollEffects);

  function renderParticleScene() {
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    particleArray.forEach((currentParticle) => {
      currentParticle.x += currentParticle.vx;
      currentParticle.y += currentParticle.vy;

      if (currentParticle.x < 0 || currentParticle.x > canvasWidth)
        currentParticle.vx *= -1;
      if (currentParticle.y < 0 || currentParticle.y > canvasHeight)
        currentParticle.vy *= -1;

      canvasContext.beginPath();
      canvasContext.arc(
        currentParticle.x,
        currentParticle.y,
        2,
        0,
        Math.PI * 2
      );
      canvasContext.fillStyle = "#ccc";
      canvasContext.fill();
    });

    for (let i = 0; i < totalParticles; i++) {
      for (let j = i + 1; j < totalParticles; j++) {
        const deltaX = particleArray[i].x - particleArray[j].x;
        const deltaY = particleArray[i].y - particleArray[j].y;
        const distanceBetween = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distanceBetween < maxConnectionDistance) {
          canvasContext.beginPath();
          canvasContext.moveTo(particleArray[i].x, particleArray[i].y);
          canvasContext.lineTo(particleArray[j].x, particleArray[j].y);
          canvasContext.strokeStyle = `rgba(200,200,200,${
            1 - distanceBetween / maxConnectionDistance
          })`;
          canvasContext.stroke();
        }
      }

      if (cursorPosition.x !== null && cursorPosition.y !== null) {
        const deltaX = particleArray[i].x - cursorPosition.x;
        const deltaY = particleArray[i].y - cursorPosition.y;
        const distanceBetween = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distanceBetween < maxConnectionDistance) {
          canvasContext.beginPath();
          canvasContext.moveTo(particleArray[i].x, particleArray[i].y);
          canvasContext.lineTo(cursorPosition.x, cursorPosition.y);
          canvasContext.strokeStyle = `rgba(255,255,255,${
            1 - distanceBetween / maxConnectionDistance
          })`;
          canvasContext.stroke();
        }
      }
    }

    requestAnimationFrame(renderParticleScene);
  }

  renderParticleScene();
})();

// ######################### //
//  Custom cursor followers  //
// ######################### //
function initializeCustomCursor() {
  const cursor = document.getElementById("cursor");
  const cursorFollower = document.getElementById("cursorFollower");

  if (window.matchMedia("(pointer: coarse)").matches) {
    cursor.style.display = "none";
    cursorFollower.style.display = "none";
    return;
  }

  let cursorX = 0;
  let cursorY = 0;
  let followerPositionX = 0;
  let followerPositionY = 0;
  let cursorHasMoved = false;

  // Define exclusion list - classes where cursor should be hidden
  const exclusionClasses = [
    ".tech-stack-section",
  ];

  cursor.style.opacity = "0";
  cursorFollower.style.opacity = "0";

  document.addEventListener("mousemove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;

    if (!cursorHasMoved) {
      cursorHasMoved = true;
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = "1";
    }

    cursor.style.left = `${cursorX - 10}px`;
    cursor.style.top = `${cursorY - 10}px`;
  });

  function animateFollower() {
    if (cursorHasMoved) {
      followerPositionX += (cursorX - followerPositionX - 20) * 0.2;
      followerPositionY += (cursorY - followerPositionY - 20) * 0.2;

      cursorFollower.style.left = `${followerPositionX}px`;
      cursorFollower.style.top = `${followerPositionY}px`;
    }

    requestAnimationFrame(animateFollower);
  }

  animateFollower();

  document.addEventListener("mousedown", () => {
    cursor.classList.add("click");
    cursorFollower.classList.add("click");
  });

  document.addEventListener("mouseup", () => {
    cursor.classList.remove("click");
    cursorFollower.classList.remove("click");
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, .tech-item, .nav-btn, .mobile-nav-btn, .back-to-top"
  );

  interactiveElements.forEach((interactiveElement) => {
    interactiveElement.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      cursorFollower.classList.add("hover");
    });

    interactiveElement.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      cursorFollower.classList.remove("hover");
    });
  });

  exclusionClasses.forEach((className) => {
    const excludedElements = document.querySelectorAll(className);
    excludedElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.style.opacity = "0";
        cursorFollower.style.opacity = "0";
      });

      element.addEventListener("mouseleave", () => {
        cursor.style.opacity = "1";
        cursorFollower.style.opacity = "1";
      });
    });
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    cursorFollower.style.opacity = "0";
    cursorHasMoved = false;
  });
}

// ########################## //
//  Particle effect on click  //
// ########################## //
function initializeClickParticles() {
  document.addEventListener("click", (event) => {
    const particlesPerClick = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < particlesPerClick; i++) {
      generateClickParticle(event.clientX, event.clientY);
    }
  });

  function generateClickParticle(particleX, particleY) {
    const clickParticle = document.createElement("div");
    clickParticle.classList.add("particle");
    document.body.appendChild(clickParticle);

    const particleSize = Math.floor(Math.random() * 10 + 5);
    const colorSelection = Math.random();
    let particleColor;

    if (colorSelection < 0.33) {
      particleColor = "#ff3b30";
    } else if (colorSelection < 0.66) {
      particleColor = "#ff6257";
    } else {
      particleColor = "#d70015";
    }

    const particleAngle = Math.random() * Math.PI * 2;
    const particleDistance = Math.random() * 50 + 30;
    const particleDuration = Math.random() * 1000 + 500;

    clickParticle.style.width = `${particleSize}px`;
    clickParticle.style.height = `${particleSize}px`;
    clickParticle.style.background = particleColor;
    clickParticle.style.borderRadius = "50%";
    clickParticle.style.boxShadow = `0 0 ${particleSize / 2}px ${
      particleSize / 3
    }px ${particleColor}`;
    clickParticle.style.left = `${particleX - particleSize / 2}px`;
    clickParticle.style.top = `${particleY - particleSize / 2}px`;

    const particleAnimation = clickParticle.animate(
      [
        {
          transform: `translate(0, 0) scale(1)`,
          opacity: 1,
        },
        {
          transform: `translate(${
            Math.cos(particleAngle) * particleDistance
          }px, ${Math.sin(particleAngle) * particleDistance}px) scale(0)`,
          opacity: 0,
        },
      ],
      {
        duration: particleDuration,
        easing: "cubic-bezier(0, 0.9, 0.57, 1)",
      }
    );

    particleAnimation.onfinish = () => {
      clickParticle.remove();
    };
  }
}

// #################################### //
//  Handle scroll indicator visibility  //
// #################################### //
function initializeScrollIndicator() {
  const scrollHintElement = document.getElementById("scrollIndicator");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 50) {
      scrollHintElement.classList.add("hidden");
    } else {
      scrollHintElement.classList.remove("hidden");
    }
  });
}

function initializeMobileHaptics() {
  const hasTouchCapability = navigator.maxTouchPoints > 0;

  if (!hasTouchCapability) return;

  const navigationButtons = document.querySelectorAll(
    ".mobile-nav-btn, #mobileMenuBtn"
  );

  navigationButtons.forEach((navButton) => {
    navButton.addEventListener("click", () => {
      if ("vibrate" in navigator) {
        navigator.vibrate(95);
      }
    });
  });
}

// ######################## //
//  Main site script logic  //
// ######################## //
document.addEventListener("DOMContentLoaded", function () {
  const pageSections = document.querySelectorAll("section");
  const desktopNavButtons = document.querySelectorAll(".nav-btn");
  const mobileNavigationButtons = document.querySelectorAll(".mobile-nav-btn");
  const navigationContainer = document.getElementById("navContainer");
  const mobileMenuButton = document.getElementById("mobileMenuBtn");
  const mobileMenuPanel = document.getElementById("mobileMenu");
  const menuToggleIcon = mobileMenuButton.querySelector("i");
  const backToTopButton = document.getElementById("backToTop");
  const scrollProgressBar = document.getElementById("scrollProgress");

  initializeCustomCursor();
  initializeClickParticles();
  initializeScrollIndicator();
  initializeMobileHaptics();

  function initializeScrollProgress() {
    window.addEventListener("scroll", () => {
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgressBar.style.width = scrolled + "%";
    });
  }

  function initializeBackToTop() {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    backToTopButton.addEventListener("click", () => {
      const hasTouchCapability = navigator.maxTouchPoints > 0;

      if (hasTouchCapability && "vibrate" in navigator) {
        navigator.vibrate(95);
      }
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  function updateNavigationOnScroll() {
    const scrollY = window.scrollY;
    const navigationSelector = document.querySelector(".section-selector");

    const scrollProgressRatio = Math.min(scrollY / 200, 1);

    if (scrollProgressRatio > 0) {
      navigationContainer.classList.add("scrolled");

      const navigationScale = 0.95 + 0.05 * (1 - scrollProgressRatio);
      const navigationBorderRadius = 50 * scrollProgressRatio;
      const navigationMarginTop = 20 * scrollProgressRatio;

      navigationSelector.style.borderRadius = `${navigationBorderRadius}px`;
      navigationSelector.style.marginTop = `${navigationMarginTop}px`;
      navigationSelector.style.transform = `scale(${navigationScale})`;

      const navigationWidthPercent = 100 - 40 * scrollProgressRatio;
      navigationSelector.style.width = `${navigationWidthPercent}%`;

      const navigationGap = 1.5 - 0.75 * scrollProgressRatio;
      navigationSelector.style.gap = `${navigationGap}rem`;
    } else {
      navigationContainer.classList.remove("scrolled");
      navigationSelector.style.borderRadius = "0";
      navigationSelector.style.marginTop = "0";
      navigationSelector.style.transform = "scale(1)";
      navigationSelector.style.width = "100%";
      navigationSelector.style.gap = "1.5rem";
    }
  }

  mobileMenuButton.addEventListener("click", function () {
    mobileMenuPanel.classList.toggle("open");
    if (mobileMenuPanel.classList.contains("open")) {
      menuToggleIcon.classList.remove("fa-bars");
      menuToggleIcon.classList.add("fa-times");
      mobileMenuButton.setAttribute("aria-expanded", "true");
    } else {
      menuToggleIcon.classList.remove("fa-times");
      menuToggleIcon.classList.add("fa-bars");
      mobileMenuButton.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", function (clickEvent) {
    if (
      mobileMenuPanel.classList.contains("open") &&
      !mobileMenuPanel.contains(clickEvent.target) &&
      !mobileMenuButton.contains(clickEvent.target)
    ) {
      mobileMenuPanel.classList.remove("open");
      menuToggleIcon.classList.remove("fa-times");
      menuToggleIcon.classList.add("fa-bars");
      mobileMenuButton.setAttribute("aria-expanded", "false");
    }
  });

  function navigateToSection(targetSectionId) {
    const targetSectionElement = document.getElementById(targetSectionId);

    if (targetSectionElement) {
      if (mobileMenuPanel.classList.contains("open")) {
        mobileMenuPanel.classList.remove("open");
        menuToggleIcon.classList.remove("fa-times");
        menuToggleIcon.classList.add("fa-bars");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }

      targetSectionElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  desktopNavButtons.forEach((navButton) => {
    navButton.addEventListener("click", function () {
      const targetSectionId = this.getAttribute("data-target");
      navigateToSection(targetSectionId);
    });

    navButton.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const targetSectionId = this.getAttribute("data-target");
        navigateToSection(targetSectionId);
      }
    });
  });

  mobileNavigationButtons.forEach((navButton) => {
    navButton.addEventListener("click", function () {
      const targetSectionId = this.getAttribute("data-target");
      navigateToSection(targetSectionId);
    });

    navButton.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const targetSectionId = this.getAttribute("data-target");
        navigateToSection(targetSectionId);
      }
    });
  });

  function updateActiveNavigation() {
    let activeSectionId = "";

    pageSections.forEach((section) => {
      const sectionOffsetTop = section.offsetTop;
      const sectionClientHeight = section.clientHeight;

      if (window.pageYOffset >= sectionOffsetTop - 200) {
        activeSectionId = section.getAttribute("id");
      }
    });

    desktopNavButtons.forEach((navButton) => {
      navButton.classList.remove("active");
      if (navButton.getAttribute("data-target") === activeSectionId) {
        navButton.classList.add("active");
      }
    });

    mobileNavigationButtons.forEach((navButton) => {
      navButton.classList.remove("active");
      if (navButton.getAttribute("data-target") === activeSectionId) {
        navButton.classList.add("active");
      }
    });
  }

  function handleScrollAnimations() {
    updateActiveNavigation();
  }

  initializeScrollProgress();
  initializeBackToTop();
  updateNavigationOnScroll();
  handleScrollAnimations();

  let isScrollUpdatePending = false;
  window.addEventListener("scroll", function () {
    if (!isScrollUpdatePending) {
      requestAnimationFrame(function () {
        updateNavigationOnScroll();
        handleScrollAnimations();
        isScrollUpdatePending = false;
      });
      isScrollUpdatePending = true;
    }
  });
});


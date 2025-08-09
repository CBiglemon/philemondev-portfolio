// Global functions for modal (needed for onclick handlers)
let portfolioApp = null;

function openProjectModal() {
  if (portfolioApp) {
    portfolioApp.openProjectModal();
  }
}

function closeProjectModal() {
  if (portfolioApp) {
    portfolioApp.closeProjectModal();
  }
}

// Enhanced Theme Animation System
class ThemeAnimationManager {
  constructor() {
    this.isTransitioning = false;
    this.mouseX = 50;
    this.mouseY = 50;
    this.init();
  }

  init() {
    this.setupMouseTracking();
    this.enhanceThemeSwitcher();
  }

  // Track mouse position for ripple effect origin
  setupMouseTracking() {
    document.addEventListener("mousemove", (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 100;
      this.mouseY = (e.clientY / window.innerHeight) * 100;

      document.body.style.setProperty("--mouse-x", this.mouseX + "%");
      document.body.style.setProperty("--mouse-y", this.mouseY + "%");
    });
  }

  // Enhanced theme switcher with animations
  enhanceThemeSwitcher() {
    const themeOptions = document.querySelectorAll(".theme-option");

    themeOptions.forEach((option) => {
      // Add click event with animation
      option.addEventListener("click", (e) => {
        if (this.isTransitioning) return;

        const theme = option.dataset.theme;
        this.animateThemeChange(option, theme);
      });

      // Enhanced hover effects - removed preview
      option.addEventListener("mouseenter", () => {
        if (!option.classList.contains("active")) {
          option.style.transform = "scale(1.15)";
          // Preview removed
        }
      });

      option.addEventListener("mouseleave", () => {
        if (!option.classList.contains("active")) {
          option.style.transform = "scale(1)";
        }
      });
    });
  }

  // Main theme change animation
  async animateThemeChange(clickedOption, theme) {
    this.isTransitioning = true;

    // Start transition effects
    document.body.classList.add("theme-transitioning");

    // Animate the clicked theme option
    clickedOption.classList.add("activating");

    // Show loading indicator
    this.showLoadingIndicator();

    // Create ripple effect from click position
    this.createRippleEffect(clickedOption);

    // Wait for ripple animation
    await this.wait(300);

    // Actually change the theme
    this.setTheme(theme);

    // Update active states
    this.updateActiveThemeOption(clickedOption);

    // Animate buttons with shine effect
    this.animateButtons();

    // Regenerate background elements
    if (portfolioApp && portfolioApp.regenerateConstellationBackground) {
      portfolioApp.regenerateConstellationBackground();
    }

    // Wait for theme transition to complete
    await this.wait(500);

    // Cleanup
    this.cleanupTransition(clickedOption);
  }

  // Create expanding ripple effect
  createRippleEffect(clickedOption) {
    const rect = clickedOption.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Update CSS variables for ripple origin
    document.body.style.setProperty("--ripple-x", centerX + "px");
    document.body.style.setProperty("--ripple-y", centerY + "px");
  }

  // Remove theme preview functionality
  showThemePreview(option) {
    // Preview functionality removed as requested
    return;
  }

  // Loading indicator
  showLoadingIndicator() {
    let loader = document.querySelector(".theme-loading");
    if (!loader) {
      loader = document.createElement("div");
      loader.className = "theme-loading";
      document.body.appendChild(loader);
    }
    loader.classList.add("active");

    setTimeout(() => {
      loader.classList.remove("active");
    }, 800);
  }

  // Animate buttons with shine effect
  animateButtons() {
    const buttons = document.querySelectorAll(".btn-primary");
    buttons.forEach((btn, index) => {
      setTimeout(() => {
        btn.classList.add("theme-transitioning");
        setTimeout(() => {
          btn.classList.remove("theme-transitioning");
        }, 600);
      }, index * 100);
    });
  }

  // Set the actual theme
  setTheme(themeName) {
    const html = document.documentElement;
    const themeOptions = document.querySelectorAll(".theme-option");

    // Remove active class from all options
    themeOptions.forEach((option) => option.classList.remove("active"));

    // Add active class to selected theme
    const activeOption = document.querySelector(`[data-theme="${themeName}"]`);
    if (activeOption) {
      activeOption.classList.add("active");
    }

    // Set theme attribute on html element
    html.setAttribute("data-theme", themeName);

    // Save to localStorage
    localStorage.setItem("portfolio-theme", themeName);
  }

  // Update active theme option with animation
  updateActiveThemeOption(clickedOption) {
    const themeOptions = document.querySelectorAll(".theme-option");

    // Remove active from all with fade effect
    themeOptions.forEach((option) => {
      if (option !== clickedOption) {
        option.classList.remove("active");
        option.style.transform = "scale(1)";
      }
    });

    // Add active to clicked option
    clickedOption.classList.add("active");
    clickedOption.style.transform = "scale(1.05)";
  }

  // Cleanup after transition
  cleanupTransition(clickedOption) {
    document.body.classList.remove("theme-transitioning");
    document.body.classList.remove("theme-transition-complete");
    clickedOption.classList.remove("activating");
    this.isTransitioning = false;
  }

  // Utility function for delays
  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Initialize with saved theme
  initializeTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme") || "deep-space";
    this.setTheme(savedTheme);
  }
}

// Enhanced Portfolio JavaScript with constellation background and theme animations
class PortfolioApp {
  constructor() {
    this.cursor = document.getElementById("cursor");
    this.magneticElements = document.querySelectorAll(".magnetic-element");
    this.scrollRevealElements = document.querySelectorAll(".scroll-reveal");
    this.navbar = document.getElementById("navbar");
    this.scrollIndicator = document.getElementById("scrollIndicator");
    this.contactForm = document.getElementById("contactForm");
    this.submitBtn = document.getElementById("submitBtn");
    this.formMessage = document.getElementById("formMessage");

    // Performance optimizations
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.lastScrollY = 0;
    this.isScrolling = false;
    this.rafId = null;
    this.cachedSections = null;
    this.cachedNavLinks = null;

    // Theme animation manager
    this.themeManager = new ThemeAnimationManager();

    // Throttled functions
    this.throttledScrollHandler = this.throttle(
      this.handleScroll.bind(this),
      16
    );
    this.throttledMouseHandler = this.throttle(
      this.handleMouseMove.bind(this),
      16
    );

    this.init();
  }

  init() {
    this.setupCursor();
    this.setupMagneticEffects();
    this.setupScrollAnimations();
    this.setupNavbarEffects();
    this.setupContactForm();
    this.setupSmoothScrolling();
    this.setupKeyboardNavigation();
    this.setupPerformanceOptimizations();
    this.setupProjectModal();
    this.setupThemeSwitcher();
    this.createConstellationBackground();
    this.createCosmicBackground();
  }

  // ==========================================
  // ENHANCED THEME SWITCHER WITH ANIMATIONS
  // ==========================================

  setupThemeSwitcher() {
    // Initialize the theme animation manager
    this.themeManager.initializeTheme();
  }

  setTheme(themeName) {
    const html = document.documentElement;
    const themeOptions = document.querySelectorAll(".theme-option");

    // Remove active class from all options
    themeOptions.forEach((option) => option.classList.remove("active"));

    // Add active class to selected theme
    const activeOption = document.querySelector(`[data-theme="${themeName}"]`);
    if (activeOption) {
      activeOption.classList.add("active");
    }

    // Set theme attribute on html element
    html.setAttribute("data-theme", themeName);

    // Regenerate constellation background with new colors
    this.regenerateConstellationBackground();
  }

  regenerateConstellationBackground() {
    const constellationContainer = document.getElementById("constellation-bg");
    const cosmicContainer = document.getElementById("cosmic-bg");

    if (constellationContainer) {
      // Fade out
      constellationContainer.style.transition = "opacity 0.4s ease";
      constellationContainer.style.opacity = "0";

      setTimeout(() => {
        constellationContainer.innerHTML = "";
        // Recreate background
        this.createConstellationBackground();
        // Fade back in
        constellationContainer.style.opacity = "1";
      }, 400);
    }

    if (cosmicContainer) {
      cosmicContainer.style.transition = "opacity 0.4s ease";
      cosmicContainer.style.opacity = "0";

      setTimeout(() => {
        cosmicContainer.innerHTML = "";
        this.createCosmicBackground();
        cosmicContainer.style.opacity = "1";
      }, 500);
    }
  }

  // ==========================================
  // CONSTELLATION BACKGROUND CREATION
  // ==========================================

  // Create enhanced constellation background elements
  createConstellationBackground() {
    const container = document.getElementById("constellation-bg");
    if (!container) return;

    // Define color classes for variety
    const starColors = [
      "color-blue",
      "color-purple",
      "color-pink",
      "color-orange",
      "color-green",
      "color-white",
    ];
    const particleColors = [
      "color-blue",
      "color-purple",
      "color-pink",
      "color-orange",
    ];
    const shapeColors = [
      "color-blue",
      "color-purple",
      "color-pink",
      "color-orange",
      "color-green",
    ];

    // Create fewer colorful twinkling stars (reduced from 150 to 60)
    for (let i = 0; i < 60; i++) {
      const star = document.createElement("div");
      const size = ["small", "medium", "large"][Math.floor(Math.random() * 3)];
      const color = starColors[Math.floor(Math.random() * starColors.length)];

      star.className = `bg-star ${size} ${color}`;
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 6 + "s";

      // Slower animation duration for more relaxed feel
      star.style.animationDuration = 4 + Math.random() * 4 + "s";

      container.appendChild(star);
    }

    // Create fewer colorful floating particles (reduced from 25 to 8)
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("div");
      const color =
        particleColors[Math.floor(Math.random() * particleColors.length)];

      particle.className = `bg-particle ${color}`;
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 35 + "s";
      particle.style.animationDuration = 30 + Math.random() * 20 + "s";

      container.appendChild(particle);
    }

    // Create fewer colorful floating geometric shapes (reduced from 15 to 6)
    const shapes = ["△", "○", "□", "◇", "✦", "✧"];
    for (let i = 0; i < 6; i++) {
      const shape = document.createElement("div");
      const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];

      shape.className = `floating-shape ${color}`;
      shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      shape.style.left = Math.random() * 100 + "%";
      shape.style.animationDelay = Math.random() * 40 + "s";
      shape.style.animationDuration = 35 + Math.random() * 20 + "s";

      // Consistent smaller size
      shape.style.fontSize = "14px";

      container.appendChild(shape);
    }

    // Create constellation connection lines
    this.createConstellationLines(container);
  }

  // Create cosmic background with trails and enhanced effects
  createCosmicBackground() {
    const container = document.getElementById("cosmic-bg");
    if (!container) return;

    const trailColors = ["color-blue", "color-purple", "color-pink"];

    // Create fewer cosmic trails (reduced from 8 to 3)
    for (let i = 0; i < 3; i++) {
      const trail = document.createElement("div");
      const color = trailColors[Math.floor(Math.random() * trailColors.length)];

      trail.className = `cosmic-trail ${color}`;
      trail.style.left = Math.random() * 100 + "%";
      trail.style.animationDelay = Math.random() * 25 + "s";
      trail.style.animationDuration = 20 + Math.random() * 15 + "s";
      trail.style.height = 50 + Math.random() * 30 + "px";

      container.appendChild(trail);
    }
  }

  // Create subtle constellation connection lines (reduced from 12 to 4)
  createConstellationLines(container) {
    for (let i = 0; i < 4; i++) {
      const line = document.createElement("div");
      line.className = "constellation-line";

      const length = 40 + Math.random() * 60;
      const angle = Math.random() * 360;

      line.style.width = length + "px";
      line.style.left = Math.random() * 90 + "%";
      line.style.top = Math.random() * 90 + "%";
      line.style.transform = `rotate(${angle}deg)`;
      line.style.animationDelay = Math.random() * 6 + "s";
      line.style.animationDuration = "8s";

      container.appendChild(line);
    }
  }

  // ==========================================
  // OPTIMIZED CURSOR SYSTEM
  // ==========================================

  setupCursor() {
    if (!this.cursor) return;

    document.addEventListener("mousemove", this.throttledMouseHandler, {
      passive: true,
    });
    this.animateCursor();
  }

  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  animateCursor() {
    this.cursorX += (this.mouseX - this.cursorX) * 0.1;
    this.cursorY += (this.mouseY - this.cursorY) * 0.1;

    if (this.cursor) {
      // Use transform instead of left/top for better performance
      this.cursor.style.transform = `translate3d(${this.cursorX - 7.5}px, ${
        this.cursorY - 7.5
      }px, 0)`;
    }

    this.rafId = requestAnimationFrame(() => this.animateCursor());
  }

  // ==========================================
  // OPTIMIZED MAGNETIC EFFECTS
  // ==========================================

  setupMagneticEffects() {
    this.magneticElements.forEach((element) => {
      element.addEventListener(
        "mouseenter",
        () => {
          if (this.cursor) this.cursor.classList.add("magnetic");
        },
        { passive: true }
      );

      element.addEventListener(
        "mouseleave",
        () => {
          if (this.cursor) this.cursor.classList.remove("magnetic");
          element.style.transform = "";
        },
        { passive: true }
      );

      element.addEventListener(
        "mousemove",
        (e) => {
          this.handleMagneticMove(e, element);
        },
        { passive: true }
      );
    });

    this.setupOptimizedCardEffects();
  }

  handleMagneticMove(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const moveX = x * 0.15;
    const moveY = y * 0.15;

    // Use translate3d for hardware acceleration
    element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.02)`;
  }

  setupOptimizedCardEffects() {
    // Optimized effects for skill cards and social links
    const cards = [
      ...document.querySelectorAll(".skill-card"),
      ...document.querySelectorAll(".social-link"),
    ];

    cards.forEach((card) => {
      card.addEventListener(
        "mousemove",
        (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;

          // Batch DOM updates
          requestAnimationFrame(() => {
            card.style.setProperty("--mouse-x", x + "%");
            card.style.setProperty("--mouse-y", y + "%");
          });
        },
        { passive: true }
      );
    });
  }

  // ==========================================
  // OPTIMIZED SCROLL ANIMATIONS
  // ==========================================

  setupScrollAnimations() {
    // Use single intersection observer for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            // Stop observing once animated
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    this.scrollRevealElements.forEach((element) => {
      observer.observe(element);
    });

    this.setupStaggeredAnimations();
  }

  setupStaggeredAnimations() {
    const staggerElements = document.querySelectorAll(".skill-card");

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Use setTimeout for staggering instead of complex animations
            setTimeout(() => {
              entry.target.classList.add("animate");
            }, index * 100);
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    staggerElements.forEach((element) => {
      staggerObserver.observe(element);
    });
  }

  // ==========================================
  // OPTIMIZED NAVBAR EFFECTS
  // ==========================================

  setupNavbarEffects() {
    window.addEventListener("scroll", this.throttledScrollHandler, {
      passive: true,
    });
    this.setupMobileNavigation();
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const scrollDirection = scrolled > this.lastScrollY ? "down" : "up";

    // Batch DOM updates
    requestAnimationFrame(() => {
      // Navbar effects
      if (this.navbar) {
        if (Math.abs(scrolled - this.lastScrollY) > 100) {
          if (scrollDirection === "down" && scrolled > 200) {
            this.navbar.classList.add("hidden");
          } else if (scrollDirection === "up") {
            this.navbar.classList.remove("hidden");
          }
        }

        if (scrolled > 100) {
          this.navbar.classList.add("scrolled");
        } else {
          this.navbar.classList.remove("scrolled");
        }
      }

      // Scroll indicator
      if (this.scrollIndicator) {
        if (scrolled > 200) {
          this.scrollIndicator.classList.add("hidden");
        } else {
          this.scrollIndicator.classList.remove("hidden");
        }
      }

      // Optimized parallax with transform3d
      const hero = document.querySelector(".hero");
      if (hero) {
        const rate = scrolled * -0.1; // Reduced parallax intensity
        hero.style.transform = `translate3d(0, ${rate}px, 0)`;
      }
    });

    this.updateActiveNavLink();
    this.lastScrollY = scrolled;
  }

  updateActiveNavLink() {
    // Optimize this by caching selectors and reducing DOM queries
    if (!this.cachedSections) {
      this.cachedSections = document.querySelectorAll("section[id]");
      this.cachedNavLinks = document.querySelectorAll(".nav-links a");
    }

    let current = "";
    this.cachedSections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    this.cachedNavLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  // ==========================================
  // OPTIMIZED MOBILE NAVIGATION
  // ==========================================

  setupMobileNavigation() {
    const navContent = document.querySelector(".nav-content");
    let toggleBtn = document.querySelector(".nav-toggle");

    if (navContent && !toggleBtn) {
      toggleBtn = document.createElement("button");
      toggleBtn.className = "nav-toggle";
      toggleBtn.innerHTML = "☰";
      toggleBtn.setAttribute("aria-label", "Toggle navigation");
      toggleBtn.setAttribute("aria-expanded", "false");
      navContent.appendChild(toggleBtn);
    }

    if (toggleBtn) {
      // Optimized toggle handler
      const toggleHandler = (e) => {
        e.stopPropagation();
        const navLinks = document.querySelector(".nav-links");
        const isActive = navLinks.classList.contains("active");

        // Batch DOM updates
        requestAnimationFrame(() => {
          navLinks.classList.toggle("active");
          toggleBtn.innerHTML = !isActive ? "✕" : "☰";
          toggleBtn.setAttribute("aria-expanded", !isActive);
          toggleBtn.style.transform = !isActive
            ? "rotate(90deg)"
            : "rotate(0deg)";
        });
      };

      // Close menu handler (reusable)
      const closeMenu = () => {
        const navLinks = document.querySelector(".nav-links");
        if (navLinks.classList.contains("active")) {
          requestAnimationFrame(() => {
            navLinks.classList.remove("active");
            toggleBtn.innerHTML = "☰";
            toggleBtn.setAttribute("aria-expanded", "false");
            toggleBtn.style.transform = "rotate(0deg)";
          });
        }
      };

      // Event listeners with passive options
      toggleBtn.addEventListener("click", toggleHandler);

      // Optimized nav link click handler
      document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", closeMenu, { passive: true });
      });

      // Optimized outside click handler
      document.addEventListener(
        "click",
        (e) => {
          if (!navContent.contains(e.target)) {
            closeMenu();
          }
        },
        { passive: true }
      );

      // Escape key handler
      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Escape") {
            closeMenu();
          }
        },
        { passive: true }
      );

      // Optimized resize handler
      const resizeHandler = this.debounce(() => {
        if (window.innerWidth > 768) {
          closeMenu();
        }
      }, 250);

      window.addEventListener("resize", resizeHandler, { passive: true });
    }
  }

  // ==========================================
  // OPTIMIZED CONTACT FORM
  // ==========================================

  setupContactForm() {
    if (!this.contactForm) return;

    this.contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleFormSubmission();
    });

    this.setupFormValidation();
  }

  async handleFormSubmission() {
    // Batch DOM updates for form state
    requestAnimationFrame(() => {
      this.submitBtn.classList.add("loading");
      this.submitBtn.textContent = "Sending...";
    });

    const formData = new FormData(this.contactForm);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      company: formData.get("company"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      // Simulate form submission since no backend endpoint
      await this.simulateFormSubmission(data);

      requestAnimationFrame(() => {
        this.showMessage(
          "Thank you! Your message has been sent successfully. I'll get back to you soon.",
          "success"
        );
        this.contactForm.reset();
        this.submitBtn.classList.remove("loading");
        this.submitBtn.classList.add("success");
        this.submitBtn.textContent = "Message Sent!";
      });

      setTimeout(() => {
        requestAnimationFrame(() => {
          this.submitBtn.classList.remove("success");
          this.submitBtn.textContent = "Send Message";
        });
      }, 3000);
    } catch (error) {
      console.error("Failed to send email:", error);

      requestAnimationFrame(() => {
        this.showMessage(
          "Oops! Something went wrong. Please try again or reach out directly via email.",
          "error"
        );
        this.submitBtn.classList.remove("loading");
        this.submitBtn.textContent = "Send Message";
      });
    }
  }

  simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          console.log("Form submitted:", data);
          resolve();
        } else {
          reject(new Error("Submission failed"));
        }
      }, 1500);
    });
  }

  showMessage(text, type) {
    if (!this.formMessage) return;

    requestAnimationFrame(() => {
      this.formMessage.textContent = text;
      this.formMessage.className = `form-message show ${type}`;
    });

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.formMessage.classList.remove("show");
      });
    }, 5000);
  }

  // ==========================================
  // OPTIMIZED FORM VALIDATION
  // ==========================================

  setupFormValidation() {
    const formInputs = document.querySelectorAll(
      "#contactForm input, #contactForm textarea"
    );

    formInputs.forEach((input) => {
      input.addEventListener("blur", (e) => this.validateField(e), {
        passive: true,
      });
      input.addEventListener("input", (e) => this.clearErrors(e), {
        passive: true,
      });
    });
  }

  validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    field.classList.remove("error");

    if (field.required && !value) {
      this.showFieldError(field, "This field is required");
      return false;
    }

    if (field.type === "email" && value && !this.isValidEmail(value)) {
      this.showFieldError(field, "Please enter a valid email address");
      return false;
    }

    return true;
  }

  clearErrors(e) {
    const field = e.target;
    field.classList.remove("error");
    const errorMsg = field.parentNode.querySelector(".field-error");
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  showFieldError(field, message) {
    requestAnimationFrame(() => {
      field.classList.add("error");

      const existingError = field.parentNode.querySelector(".field-error");
      if (existingError) {
        existingError.remove();
      }

      const errorDiv = document.createElement("div");
      errorDiv.className = "field-error";
      errorDiv.textContent = message;
      field.parentNode.appendChild(errorDiv);

      setTimeout(() => {
        errorDiv.classList.add("show");
      }, 10);
    });
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ==========================================
  // OPTIMIZED SMOOTH SCROLLING
  // ==========================================

  setupSmoothScrolling() {
    // Use event delegation for better performance
    document.addEventListener(
      "click",
      (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute("href"));
          if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth",
            });
          }
        }
      },
      { passive: false }
    );
  }

  // ==========================================
  // KEYBOARD NAVIGATION
  // ==========================================

  setupKeyboardNavigation() {
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Tab") {
          document.body.classList.add("keyboard-nav");
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "mousedown",
      () => {
        document.body.classList.remove("keyboard-nav");
      },
      { passive: true }
    );
  }

  // ==========================================
  // PERFORMANCE OPTIMIZATIONS
  // ==========================================

  setupPerformanceOptimizations() {
    // Respect reduced motion preferences
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      this.disableAnimations();
    }

    // Handle visibility changes for performance
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          // Pause non-essential animations when tab is hidden
          if (this.rafId) {
            cancelAnimationFrame(this.rafId);
          }
        } else {
          // Resume animations when tab becomes visible
          this.animateCursor();
        }
      },
      { passive: true }
    );
  }

  disableAnimations() {
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // ==========================================
  // PROJECT MODAL FUNCTIONALITY
  // ==========================================

  setupProjectModal() {
    // Close modal on escape key
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") {
          this.closeProjectModal();
        }
      },
      { passive: true }
    );
  }

  openProjectModal() {
    const modal = document.getElementById("projectModal");
    const modalContent = modal.querySelector(".case-study-content");

    // Show modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Load case study content
    this.loadCaseStudyContent(modalContent);
  }

  closeProjectModal() {
    const modal = document.getElementById("projectModal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  loadCaseStudyContent(container) {
    // Case study content
    const caseStudyHTML = `
      <h1>Learning Management System Development</h1>
      
      <div style="background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
        <h2 style="margin-top: 0;">Project Overview</h2>
        <p><strong>Role:</strong> Lead Full-Stack Developer & System Architect<br>
        <strong>Duration:</strong> 18 months<br>
        <strong>Client:</strong> Educational Institution, New Zealand<br>
        <strong>Team Size:</strong> Solo Developer</p>
        
        <p>Designed and developed a comprehensive Learning Management System from the ground up, serving as the sole technical architect for a complete educational platform. The system successfully streamlined course management, student enrollment, and assessment workflows for a New Zealand educational institution.</p>
      </div>

      <h2>🎯 The Challenge</h2>
      <p>The institution needed a modern, mobile-first LMS to replace outdated systems and manual processes. Key requirements included:</p>
      <ul>
        <li><strong>Multi-role complexity</strong>: Four distinct user types with different permissions and workflows</li>
        <li><strong>Mobile accessibility</strong>: Staff and students needed full functionality on mobile devices</li>
        <li><strong>Scalability</strong>: System needed to handle growing enrollment and multiple course offerings</li>
        <li><strong>Data integrity</strong>: Critical student records and assessment data required bulletproof security</li>
        <li><strong>Real-time updates</strong>: Instant enrollment status, grade updates, and notifications</li>
      </ul>

      <h2>🛠️ Technical Architecture</h2>
      
      <h3>Backend Infrastructure</h3>
      <pre><code>Go REST API
├── Clean Architecture Pattern
├── Repository Design Pattern
├── JWT Authentication & RBAC
├── PostgreSQL with optimized indexing
├── Docker containerization
└── Comprehensive logging & monitoring</code></pre>

      <h3>Database Design</h3>
      <ul>
        <li><strong>Complex relational schema</strong> handling students, tutors, courses, assessments, and enrollments</li>
        <li><strong>Role-based access control</strong> with granular permissions</li>
        <li><strong>Audit trails</strong> with timestamp tracking and data versioning</li>
        <li><strong>Optimistic locking</strong> to prevent data conflicts</li>
        <li><strong>Strategic indexing</strong> for query performance at scale</li>
      </ul>

      <h3>Mobile Application</h3>
      <ul>
        <li><strong>React Native with Expo</strong> cross-platform development</li>
        <li><strong>Role-based UI rendering</strong> with four distinct dashboards</li>
        <li><strong>Offline capability</strong> for critical student data</li>
        <li><strong>Zustand state management</strong> with seamless API integration</li>
      </ul>

      <h2>📊 Technical Achievements</h2>
      <ul>
        <li><strong>Database Performance</strong>: Query optimization reduced average response time from 800ms to &lt;100ms</li>
        <li><strong>API Efficiency</strong>: Implemented smart pagination and filtering, handling 10k+ records seamlessly</li>
        <li><strong>Mobile Responsiveness</strong>: Achieved &lt;2s load times on 3G networks through optimized bundling</li>
        <li><strong>Zero-Trust Architecture</strong>: Every API endpoint validates JWT tokens and role permissions</li>
        <li><strong>Containerized Deployment</strong>: Docker containers with environment-specific configurations</li>
      </ul>

      <div style="background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); padding: 1.5rem; border-radius: 12px; margin-top: 2rem; text-align: center;">
        <p style="margin: 0; color: white; font-weight: 500;"><em>This project showcased my ability to architect and deliver complex full-stack solutions, from database design to mobile user experience, while maintaining high standards for security, performance, and maintainability.</em></p>
      </div>
    `;

    // Add the content with a slight delay for better UX
    setTimeout(() => {
      container.innerHTML = caseStudyHTML;
    }, 100);
  }
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  portfolioApp = new PortfolioApp();
});

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = PortfolioApp;
}

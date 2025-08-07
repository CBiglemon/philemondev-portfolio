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

// Enhanced Portfolio JavaScript
// Author: Cayla Philemon
// Features: Magnetic effects, scroll animations, contact form

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
    this.setupProjectModal(); // Re-enabled for modal functionality

    console.log("🚀 High-performance portfolio loaded!");
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
      this.cursor.style.transform = `translate3d(${this.cursorX - 10}px, ${
        this.cursorY - 10
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
        const rate = scrolled * -0.2;
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
    const data = Object.fromEntries(formData);

    try {
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
      }, 1500); // Reduced delay for better UX
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
    // The global functions are already defined at the top of the file
    // Just store reference for the global functions to use

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
    // Case study content (converted to HTML from markdown)
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

      <h2>💡 Key Innovations</h2>

      <h3>Dynamic Role-Based Dashboards</h3>
      <p>Instead of a one-size-fits-all interface, I architected role-specific experiences:</p>
      <ul>
        <li><strong>👨‍🎓 Student Portal</strong>: Course progress, assignment tracking, grade visualization</li>
        <li><strong>👩‍🏫 Tutor Interface</strong>: Class management, student progress monitoring, resource sharing</li>
        <li><strong>📋 Assessor Dashboard</strong>: Assessment creation, grading workflows, evaluation analytics</li>
        <li><strong>⚙️ Admin Console</strong>: System administration, user management, institutional reporting</li>
      </ul>

      <h3>Smart Enrollment System</h3>
      <p>Built an intelligent enrollment workflow that:</p>
      <ul>
        <li>Automatically validates prerequisites and capacity limits</li>
        <li>Sends real-time notifications to relevant stakeholders</li>
        <li>Handles waitlists and automated placement algorithms</li>
        <li>Integrates with payment processing and scheduling systems</li>
      </ul>

      <h3>Mobile-First Assessment Tools</h3>
      <p>Developed assessment features optimized for mobile use:</p>
      <ul>
        <li>Touch-friendly grading interfaces for assessors</li>
        <li>Photo-based assignment submissions for students</li>
        <li>Offline assessment capability with sync when connected</li>
        <li>Digital signature integration for formal evaluations</li>
      </ul>

      <h2>📊 Technical Achievements</h2>

      <h3>Performance Optimizations</h3>
      <ul>
        <li><strong>Database Performance</strong>: Query optimization reduced average response time from 800ms to &lt;100ms</li>
        <li><strong>API Efficiency</strong>: Implemented smart pagination and filtering, handling 10k+ records seamlessly</li>
        <li><strong>Mobile Responsiveness</strong>: Achieved &lt;2s load times on 3G networks through optimized bundling</li>
      </ul>

      <h3>Security Implementation</h3>
      <ul>
        <li><strong>Zero-Trust Architecture</strong>: Every API endpoint validates JWT tokens and role permissions</li>
        <li><strong>SQL Injection Prevention</strong>: Parameterized queries and input sanitization across all endpoints</li>
        <li><strong>Data Protection</strong>: Encrypted sensitive student data with audit logging for compliance</li>
        <li><strong>Rate Limiting</strong>: Protected against abuse with intelligent throttling</li>
      </ul>

      <h3>DevOps Excellence</h3>
      <ul>
        <li><strong>Containerized Deployment</strong>: Docker containers with environment-specific configurations</li>
        <li><strong>Automated Migrations</strong>: Zero-downtime database updates with rollback capabilities</li>
        <li><strong>Health Monitoring</strong>: Comprehensive logging with error tracking and performance metrics</li>
        <li><strong>Secrets Management</strong>: Secure configuration handling across development and production</li>
      </ul>

      <h2>🔧 Technologies Used</h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
        <div style="background: rgba(255, 255, 255, 0.03); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: var(--accent-blue); margin-top: 0;">Backend</h3>
          <ul style="margin-left: 0; list-style: none;">
            <li><strong>Go (Golang)</strong> - High-performance REST API development</li>
            <li><strong>PostgreSQL</strong> - Robust relational database with complex queries</li>
            <li><strong>JWT Authentication</strong> - Secure, stateless user sessions</li>
            <li><strong>SMTP Server</strong> - Custom email notification system</li>
            <li><strong>Docker</strong> - Containerized deployment and environment consistency</li>
          </ul>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.03); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: var(--accent-purple); margin-top: 0;">Frontend</h3>
          <ul style="margin-left: 0; list-style: none;">
            <li><strong>React Native with Expo</strong> - Cross-platform mobile development</li>
            <li><strong>Zustand</strong> - Lightweight state management solution</li>
            <li><strong>React Navigation</strong> - Role-based routing and navigation flows</li>
            <li><strong>TypeScript</strong> - Type-safe development environment</li>
          </ul>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.03); padding: 1.5rem; border-radius: 12px;">
          <h3 style="color: var(--accent-pink); margin-top: 0;">DevOps & Tools</h3>
          <ul style="margin-left: 0; list-style: none;">
            <li><strong>Git</strong> - Version control with feature branch workflows</li>
            <li><strong>Docker Compose</strong> - Local development environment management</li>
            <li><strong>Database Migrations</strong> - Version-controlled schema evolution</li>
            <li><strong>API Documentation</strong> - Comprehensive endpoint documentation</li>
          </ul>
        </div>
      </div>

      <h2>🚀 Key Learnings</h2>

      <h3>Technical Insights</h3>
      <ul>
        <li><strong>Clean Architecture pays dividends</strong> - The repository pattern and clear separation of concerns made the codebase incredibly maintainable</li>
        <li><strong>Mobile-first API design</strong> - Designing APIs with mobile constraints in mind led to better performance across all platforms</li>
        <li><strong>Role-based complexity requires careful planning</strong> - Early investment in flexible permission systems prevented major refactoring later</li>
      </ul>

      <h3>Project Management</h3>
      <ul>
        <li><strong>Stakeholder communication is crucial</strong> - Regular demos and feedback sessions prevented scope creep and ensured user adoption</li>
        <li><strong>Incremental delivery approach</strong> - Releasing features in phases allowed for real-world testing and rapid iteration</li>
      </ul>

      <h2>💭 What I'd Do Differently</h2>
      <p>Looking back, I would:</p>
      <ul>
        <li><strong>Implement API versioning from day one</strong> to support future mobile app updates</li>
        <li><strong>Add comprehensive integration testing</strong> earlier in the development cycle</li>
        <li><strong>Include more detailed analytics</strong> for institutional decision-making</li>
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

/* =========================
   AKANKSHA PORTFOLIO
   Interactions + animations
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const progress = document.getElementById("progress");
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const themeToggle = document.getElementById("themeToggle");
  const backToTop = document.getElementById("backToTop");
  const roleText = document.getElementById("roleText");
  const year = document.getElementById("year");

  // Footer year
  if (year) year.textContent = new Date().getFullYear();

  // Theme toggle: preserve the visitor's choice in this browser.
  const savedTheme = localStorage.getItem("akanksha-portfolio-theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
  }

  const updateThemeButton = () => {
    if (!themeToggle) return;
    const isLight = body.classList.contains("light-mode");
    themeToggle.textContent = isLight ? "☾" : "☼";
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
    themeToggle.setAttribute("title", isLight ? "Dark mode" : "Light mode");
  };

  updateThemeButton();

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const theme = body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("akanksha-portfolio-theme", theme);
    updateThemeButton();
  });

  // Mobile navigation
  const closeMenu = () => {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open") ?? false;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (
      navLinks?.classList.contains("open") &&
      !navLinks.contains(event.target) &&
      !menuToggle?.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Scroll progress, sticky header, active navigation and back-to-top.
  const navAnchors = [...document.querySelectorAll(".nav-link[href^='#']")];

  const handleScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    if (progress) progress.style.width = `${amount}%`;
    if (header) header.classList.toggle("scrolled", window.scrollY > 15);
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 450);

    let currentSection = "home";
    document.querySelectorAll("main section[id]").forEach((section) => {
      if (window.scrollY >= section.offsetTop - 150) {
        currentSection = section.id;
      }
    });

    navAnchors.forEach((anchor) => {
      anchor.classList.toggle(
        "active",
        anchor.getAttribute("href") === `#${currentSection}`
      );
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Reveal content when it enters the viewport.
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // Typing effect for the role title.
  if (roleText) {
    const roles = ["Java Developer", "Full Stack Developer", "Web Developer"];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    const typeRole = () => {
      const currentRole = roles[roleIndex];

      if (deleting) {
        charIndex -= 1;
        roleText.textContent = currentRole.slice(0, Math.max(0, charIndex));

        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          window.setTimeout(typeRole, 350);
          return;
        }

        window.setTimeout(typeRole, 45);
      } else {
        const nextRole = roles[roleIndex];
        charIndex += 1;
        roleText.textContent = nextRole.slice(0, charIndex);

        if (charIndex >= nextRole.length) {
          deleting = true;
          window.setTimeout(typeRole, 1600);
          return;
        }

        window.setTimeout(typeRole, 75);
      }
    };

    window.setTimeout(typeRole, 1800);
  }

  // Count-up statistics when visible.
  const counters = document.querySelectorAll("[data-count]");

  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;

    const duration = 1200;
    const startTime = performance.now();

    const updateCounter = (now) => {
      const progressValue = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = String(Math.round(target * eased));

      if (progressValue < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.count;
    });
  }

  // Project category filters.
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = selectedFilter === "all" || category === selectedFilter;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });

    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  // Subtle 3D tilt on larger screens; disabled for touch/reduced-motion.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!reduceMotion && finePointer) {
    projectCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (card.classList.contains("is-hidden")) return;

        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 4;
        const rotateX = (0.5 - y) * 4;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Animated particle background.
  const canvas = document.getElementById("particles");
  const context = canvas?.getContext("2d");

  if (canvas && context && !reduceMotion) {
    let particles = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastFrame = 0;

    const createParticles = () => {
      const amount = Math.min(75, Math.floor((width * height) / 18000));
      particles = Array.from({ length: amount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.4,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.45 + 0.12
      }));
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    const drawParticles = (timestamp) => {
      if (timestamp - lastFrame < 30) {
        animationFrame = requestAnimationFrame(drawParticles);
        return;
      }
      lastFrame = timestamp;

      context.clearRect(0, 0, width, height);
      const lightMode = body.classList.contains("light-mode");
      const color = lightMode ? "109, 75, 209" : "130, 190, 255";

      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${color}, ${particle.alpha * (lightMode ? 0.55 : 1)})`;
        context.fill();

        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 105) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(${color}, ${(1 - distance / 105) * (lightMode ? 0.08 : 0.13)})`;
            context.lineWidth = 0.6;
            context.stroke();
          }
        }
      });

      animationFrame = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    animationFrame = requestAnimationFrame(drawParticles);
    window.addEventListener("resize", resizeCanvas, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
      } else {
        lastFrame = 0;
        animationFrame = requestAnimationFrame(drawParticles);
      }
    });
  }
});

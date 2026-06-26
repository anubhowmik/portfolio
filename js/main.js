// ===== PORTFOLIO MAIN JAVASCRIPT =====

// ===== DOM ELEMENTS =====
const html = document.documentElement;
const preloader = document.getElementById('preloader');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileOverlay = document.getElementById('mobileOverlay');
const navMenu = document.getElementById('navMenu');
const mobileMenu = document.querySelector('.mobile-nav');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const navbar = document.getElementById('navbar');
const footerYear = document.getElementById('footerYear');
const typewriterText = document.getElementById('typewriterText');
const projectsGrid = document.getElementById('projectsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const formFeedback = document.getElementById('formFeedback');

// ===== CONSTANTS =====
const TYPEWRITER_PHRASES = [
  'distributed systems',
  'machine learning',
  'full-stack development',
  'research & innovation'
];

const THEME_KEY = 'portfolio-theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPreloader();
  initScrollBehavior();
  initTypewriter();
  initProjectFilters();
  initSkillBars();
  initStatCounters();
  initContactForm();
  updateFooterYear();
});

// ===== THEME MANAGEMENT =====
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? DARK_THEME : LIGHT_THEME);
  
  setTheme(theme);
  themeToggle.addEventListener('click', toggleTheme);
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  
  const isDark = theme === DARK_THEME;
  themeIcon.classList.remove(isDark ? 'fa-sun' : 'fa-moon');
  themeIcon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
}

function toggleTheme() {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  setTheme(newTheme);
}

// ===== PRELOADER =====
function initPreloader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('hidden');
      }
    }, 500);
  });
}

// ===== SCROLL BEHAVIOR =====
function initScrollBehavior() {
  // Navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Scroll to top button visibility
    if (window.scrollY > 300) {
      scrollTopBtn.removeAttribute('hidden');
    } else {
      scrollTopBtn.setAttribute('hidden', '');
    }
  });

  // Scroll to top button
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Navigation link scrolling
  const allNavLinks = [...navLinks, ...mobileNavLinks];
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          closeMobileMenu();
          target.scrollIntoView({ behavior: 'smooth' });
          updateActiveNavLink(href);
        }
      }
    });
  });

  // Update active nav link on scroll
  window.addEventListener('scroll', () => {
    updateActiveNavLink();
  });
}

function updateActiveNavLink(href = null) {
  if (href) {
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === href);
    });
  } else {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.5 && rect.bottom > 0;
      
      if (isVisible) {
        const href = `#${section.id}`;
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === href);
        });
      }
    });
  }
}

// ===== MOBILE MENU =====
hamburgerBtn.addEventListener('click', () => {
  const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
  hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
  mobileOverlay.classList.toggle('active');
});

mobileOverlay.addEventListener('click', closeMobileMenu);

function closeMobileMenu() {
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileOverlay.classList.remove('active');
}

// ===== TYPEWRITER EFFECT =====
function initTypewriter() {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const phrase = TYPEWRITER_PHRASES[phraseIndex];
    
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    
    typewriterText.textContent = phrase.substring(0, charIndex);
    
    let speed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === phrase.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES.length;
      speed = 500;
    }
    
    setTimeout(type, speed);
  }
  
  type();
}

// ===== PROJECT FILTERS =====
function initProjectFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      filterProjects(filter);
    });
  });
}

function filterProjects(filter) {
  const cards = document.querySelectorAll('.project-card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    if (filter === 'all' || card.getAttribute('data-category') === filter) {
      card.classList.remove('hidden');
      visibleCount++;
    } else {
      card.classList.add('hidden');
    }
  });
  
  // Update filter count
  document.querySelectorAll('.filter-count').forEach(count => {
    const btnFilter = count.closest('.filter-btn').getAttribute('data-filter');
    if (btnFilter === 'all') {
      count.textContent = `(${cards.length})`;
    } else {
      const categoryCount = document.querySelectorAll(`.project-card[data-category="${btnFilter}"]`).length;
      count.textContent = `(${categoryCount})`;
    }
  });
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBar = entry.target.querySelector('.skill-bar-fill');
        if (fillBar) {
          const pct = fillBar.getAttribute('data-pct');
          fillBar.style.width = pct + '%';
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.skill-bar').forEach(bar => {
    observer.observe(bar);
  });
}

// ===== STAT COUNTERS ANIMATION =====
function initStatCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stats = entry.target.querySelectorAll('.stat-value');
        stats.forEach(stat => {
          animateCounter(stat);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  const statsRow = document.querySelector('.hero-stats-row');
  if (statsRow) {
    observer.observe(statsRow);
  }
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 30);
}

// ===== SKILL TABS =====
document.querySelectorAll('[role="tab"]').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabGroup = tab.closest('[role="tablist"]');
    const tabPanels = tab.closest('.skills-tabs-wrap').querySelectorAll('[role="tabpanel"]');
    const controlsId = tab.getAttribute('aria-controls');
    
    // Update all tabs and panels
    tabGroup.querySelectorAll('[role="tab"]').forEach(t => {
      t.setAttribute('aria-selected', t === tab);
    });
    
    tabPanels.forEach(panel => {
      if (panel.id === controlsId) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
      }
    });
  });
});

// ===== CONTACT FORM =====
function initContactForm() {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  
  // Character counter
  messageInput.addEventListener('input', () => {
    const length = messageInput.value.length;
    charCount.textContent = `${length} / 2000`;
  });
  
  // Form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      submitForm();
    }
  });
}

function validateForm() {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  
  let isValid = true;
  
  // Name validation
  if (nameInput.value.trim().length < 2) {
    setFieldError('fg-name', 'Name must be at least 2 characters');
    isValid = false;
  } else {
    clearFieldError('fg-name');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    setFieldError('fg-email', 'Please enter a valid email address');
    isValid = false;
  } else {
    clearFieldError('fg-email');
  }
  
  // Subject validation
  if (subjectInput.value.trim().length < 4) {
    setFieldError('fg-subject', 'Subject must be at least 4 characters');
    isValid = false;
  } else {
    clearFieldError('fg-subject');
  }
  
  // Message validation
  if (messageInput.value.trim().length < 20) {
    setFieldError('fg-message', 'Message must be at least 20 characters');
    isValid = false;
  } else {
    clearFieldError('fg-message');
  }
  
  return isValid;
}

function setFieldError(groupId, message) {
  const group = document.getElementById(groupId);
  const error = group.querySelector('.field-error');
  group.classList.add('error');
  error.textContent = message;
}

function clearFieldError(groupId) {
  const group = document.getElementById(groupId);
  group.classList.remove('error');
}

function submitForm() {
  submitBtn.disabled = true;
  const submitBtnText = document.getElementById('submitBtnText');
  submitBtnText.textContent = 'Sending...';
  
  const formData = new FormData(contactForm);
  
  fetch('php/contact.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showFormFeedback('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      charCount.textContent = '0 / 2000';
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
      });
    } else {
      showFormFeedback(data.message || 'Something went wrong. Please try again.', 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showFormFeedback('Failed to send message. Please try again.', 'error');
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtnText.textContent = 'Send Message';
  });
}

function showFormFeedback(message, type) {
  formFeedback.textContent = message;
  formFeedback.className = `form-feedback ${type}`;
  formFeedback.removeAttribute('hidden');
  
  setTimeout(() => {
    formFeedback.setAttribute('hidden', '');
  }, 5000);
}

// ===== FOOTER YEAR =====
function updateFooterYear() {
  footerYear.textContent = new Date().getFullYear();
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe cards on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card, .project-card, .pub-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.6s ease-out`;
    observer.observe(card);
  });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // ESC to close mobile menu
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
});

console.log('%c✨ Welcome to Anupom\'s Portfolio! ✨', 'color: #6366f1; font-size: 16px; font-weight: bold;');

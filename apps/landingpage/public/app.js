// Initialize Lucide Icons
lucide.createIcons();

// Header background change on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Mobile menu toggle logic
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

function openMenu() {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = 'auto';
}

mobileMenuToggle.addEventListener('click', openMenu);
mobileMenuClose.addEventListener('click', closeMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Segmented Tabs Control
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    tabButtons.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');

    // Get target tab id
    const targetId = `tab-${btn.getAttribute('data-tab')}`;

    // Toggle active classes on panes with a slight transition delay
    tabPanes.forEach(pane => {
      if (pane.id === targetId) {
        pane.style.display = 'block';
        setTimeout(() => {
          pane.classList.add('active');
        }, 50);
      } else {
        pane.classList.remove('active');
        setTimeout(() => {
          pane.style.display = 'none';
        }, 300); // matches the CSS transition delay
      }
    });
  });
});

// FAQ Accordion Controls
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Close all other accordions
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      }
    });

    // Toggle current accordion
    if (isActive) {
      item.classList.remove('active');
      answer.style.maxHeight = null;
    } else {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Simple animation observer for features cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1
});

const cards = document.querySelectorAll('.feature-card, .faq-item, .tab-preview-card');
cards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  observer.observe(card);
});

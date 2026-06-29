// Toggle mobile nav menu
const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('nav-list');

navToggle.addEventListener('click', () => {
  navList.classList.toggle('open');
});

// Close menu when a nav link is clicked (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (navList.classList.contains('open')) {
      navList.classList.remove('open');
    }
  });
});

// Smooth scroll for internal links (modern browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetID = this.getAttribute('href').slice(1);
    const targetAnchor = document.getElementById(targetID);
    if (targetAnchor) {
      targetAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

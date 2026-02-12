// Layout toggle functionality - switch between full-width and constrained layouts

const mainContent = document.getElementById('mainContent');
const layoutToggle = document.getElementById('layoutToggle');

// Initialize from localStorage
function initLayoutToggle() {
  const savedLayout = localStorage.getItem('layoutMode') || 'constrained';
  if (savedLayout === 'full') {
    mainContent.classList.remove('container', 'mx-auto');
    layoutToggle.checked = true;
  } else {
    mainContent.classList.add('container', 'mx-auto');
    layoutToggle.checked = false;
  }
}

// Toggle layout on change
layoutToggle.addEventListener('change', () => {
  if (layoutToggle.checked) {
    // Switch to full width
    mainContent.classList.remove('container', 'mx-auto');
    localStorage.setItem('layoutMode', 'full');
  } else {
    // Switch to constrained width
    mainContent.classList.add('container', 'mx-auto');
    localStorage.setItem('layoutMode', 'constrained');
  }
});

// Initialize on page load
initLayoutToggle();
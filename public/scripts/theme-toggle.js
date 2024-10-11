// toggle-theme.js

document.getElementById('theme-btn').addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme') || 'dark' // Get current theme
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark' // Toggle theme

  // Set the new theme to the document
  document.documentElement.setAttribute('data-theme', newTheme)

  // Save the new theme in localStorage
  localStorage.setItem('theme', newTheme)
})

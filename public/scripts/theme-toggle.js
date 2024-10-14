// toggle-theme.js

const primaryColorScheme = '' // "light" | "dark"

// Get theme data from local storage
const currentTheme = localStorage.getItem('theme')

function getPreferTheme() {
  // Return theme value in local storage if it is set
  if (currentTheme) return currentTheme

  // Return primary color scheme if it is set
  if (primaryColorScheme) return primaryColorScheme

  // Return user device's preferred color scheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

let themeValue = getPreferTheme()

function setPreference() {
  localStorage.setItem('theme', themeValue)
  reflectPreference()
}

function reflectPreference() {
  document.firstElementChild.setAttribute('data-theme', themeValue)
  document.querySelector('#theme-btn')?.setAttribute('aria-label', themeValue)

  const themeButton = document.querySelector('#theme-btn i')
  if (themeButton) {
    themeButton.className =
      themeValue === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'
  }

  // Get a reference to the body element
  const body = document.body

  // Check if the body element exists before using getComputedStyle
  if (body) {
    // Get the computed styles for the body element
    const computedStyles = window.getComputedStyle(body)
    const bgColor = computedStyles.backgroundColor

    // Set the background color in <meta theme-color ... />
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute('content', bgColor)
  }
}

// Set early so no page flashes / CSS is made aware
reflectPreference()

window.onload = () => {
  function setThemeFeature() {
    reflectPreference() // Set on load so screen readers can get the latest value on the button

    // Listen for clicks on the control
    document.querySelector('#theme-btn')?.addEventListener('click', () => {
      themeValue = themeValue === 'light' ? 'dark' : 'light' // Toggle the theme
      setPreference()
    })
  }

  setThemeFeature()

  // Runs on view transitions navigation
  document.addEventListener('astro:after-swap', setThemeFeature)
}

// Sync with system changes
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({ matches: isDark }) => {
    themeValue = isDark ? 'dark' : 'light' // Update theme based on system preference
    setPreference()
  })

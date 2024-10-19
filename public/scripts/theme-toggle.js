// toggle-theme.js

const primaryColorScheme = '' // "light" | "dark"

const currentTheme = localStorage.getItem('theme')

function getPreferTheme() {
  if (currentTheme) return currentTheme

  if (primaryColorScheme) return primaryColorScheme

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

  const themeButton = document.querySelector('#theme-btn svg')
  if (themeButton) {
    const iconId = themeValue === 'light' ? 'moon' : 'sun'
    themeButton.innerHTML = `<svg class="icon"><use href="/icons.svg#${iconId}"></use></svg>`
  }

  const body = document.body

  if (body) {
    const computedStyles = window.getComputedStyle(body)
    const bgColor = computedStyles.backgroundColor

    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute('content', bgColor)
  }
}

reflectPreference()

window.onload = () => {
  function setThemeFeature() {
    reflectPreference()

    document.querySelector('#theme-btn')?.addEventListener('click', () => {
      themeValue = themeValue === 'light' ? 'dark' : 'light'
      setPreference()
    })
  }

  setThemeFeature()

  document.addEventListener('astro:after-swap', setThemeFeature)
}

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({ matches: isDark }) => {
    themeValue = isDark ? 'dark' : 'light'
    setPreference()
  })

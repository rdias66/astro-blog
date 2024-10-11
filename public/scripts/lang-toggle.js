const defaultLanguage = 'en' // Default language: "en" for English, "pt" for Portuguese

// Get language data from local storage
const currentLanguage = localStorage.getItem('language')

function getPreferredLanguage() {
  // Return language value in local storage if it is set
  if (currentLanguage) return currentLanguage

  // Use the server-side language set via the URL path as the fallback
  const serverLanguage = document.documentElement.getAttribute('lang')

  // Return the server-side language or default language
  return serverLanguage || defaultLanguage
}

let languageValue = getPreferredLanguage()

function setLanguagePreference() {
  localStorage.setItem('language', languageValue)
  reflectLanguagePreference()
}

function reflectLanguagePreference() {
  // Update the "lang" attribute in the <html> tag
  document.documentElement.setAttribute('lang', languageValue)

  // Optionally: Update UI elements to reflect the current language (e.g., toggle button text)
  document
    .querySelector('#language-btn')
    ?.setAttribute('aria-label', languageValue)
}

// Set language early so no page flashes or issues with initial language loading
reflectLanguagePreference()

window.onload = () => {
  function setLanguageFeature() {
    // Reflect current language on load
    reflectLanguagePreference()

    // Find and listen for clicks on the language toggle button
    document.querySelector('#language-btn')?.addEventListener('click', () => {
      languageValue = languageValue === 'en' ? 'pt' : 'en'
      setLanguagePreference()

      // Optionally: Reload the page to fetch new content in the selected language
      window.location.reload() // This reloads the page to apply the new language
    })
  }

  setLanguageFeature()

  // Runs on view transitions (Astro specific)
  document.addEventListener('astro:after-swap', setLanguageFeature)
}

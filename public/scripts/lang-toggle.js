const defaultLanguage = 'en'
const currentLanguage = localStorage.getItem('language')

function getPreferredLanguage() {
  if (currentLanguage) return currentLanguage

  const serverLanguage = document.documentElement.getAttribute('lang')

  return serverLanguage || defaultLanguage
}

let languageValue = getPreferredLanguage()

function setLanguagePreference() {
  localStorage.setItem('language', languageValue)
  reflectLanguagePreference()
}

function reflectLanguagePreference() {
  document.documentElement.setAttribute('lang', languageValue)

  document
    .querySelector('#language-btn')
    ?.setAttribute('aria-label', languageValue)
}

reflectLanguagePreference()

window.onload = () => {
  function setLanguageFeature() {
    reflectLanguagePreference()

    document.querySelector('#language-btn')?.addEventListener('click', () => {
      languageValue = languageValue === 'en' ? 'pt' : 'en'
      setLanguagePreference()

      window.location.reload()
    })
  }

  setLanguageFeature()

  document.addEventListener('astro:after-swap', setLanguageFeature)
}

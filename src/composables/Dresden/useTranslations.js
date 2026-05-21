import { ref, reactive } from 'vue'
import { translations as _translations } from '@src/translations.js'

const translations = reactive(_translations)
const currentLocale = ref('de')

function interpolate(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`)
}

export function useTranslations() {
  function getTranslation(key, params = {}) {
    const entry = translations[key]

    if (!entry) {
      return key
    }

    const template = entry[currentLocale.value] ?? entry.de ?? key

    return interpolate(template, params)
  }

  function setTranslation(key, value) {
    if (!translations[key]) translations[key] = {}
    translations[key][currentLocale.value] = value
  }

  function setLocale(locale) {
    currentLocale.value = locale
  }

  return {
    currentLocale,
    getTranslation,
    setTranslation,
    setLocale,
  }
}

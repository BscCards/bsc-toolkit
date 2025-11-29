import { reactive, computed } from 'vue'
import en from './en.js'
import zh from './zh.js'

const messages = {
  en,
  zh
}

const STORAGE_KEY = 'bsc-tools-locale'

function getInitialLocale() {
  const savedLocale = localStorage.getItem(STORAGE_KEY)
  if (savedLocale && messages[savedLocale]) {
    return savedLocale
  }

  try {
    const browserLang = navigator.language || navigator.userLanguage || ''

    if (browserLang.toLowerCase().startsWith('zh')) {
      return 'zh'
    }
  } catch (error) {
    console.warn('Language detection failed:', error)
  }

  return 'en'
}

const state = reactive({
  locale: getInitialLocale(),
  messages
})

export function useI18n() {
  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = state.messages[state.locale]

    for (const k of keys) {
      value = value?.[k]
    }

    if (!value) {
      return key
    }

    let result = value
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue)
    }

    return result
  }

  const setLocale = (locale) => {
    if (messages[locale]) {
      state.locale = locale
      localStorage.setItem(STORAGE_KEY, locale)
    }
  }

  return {
    t,
    locale: computed(() => state.locale),
    setLocale,
    availableLocales: Object.keys(messages)
  }
}

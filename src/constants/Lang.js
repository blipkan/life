export const DEFAULT_LANG_KEY = 'ru'

export const Languages = {
  ru: {
    key: 'ru',
    title: 'Русский',
    caption: 'рус'
  },
  en: {
    key: 'en',
    title: 'English',
    caption: 'en'
  }
}

export const Lang = { ...Languages, default: Languages[DEFAULT_LANG_KEY] }

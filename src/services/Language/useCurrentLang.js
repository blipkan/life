import { useEffect, useState } from 'react'
import { ClientStorage } from '../ClientStorage/ClientStorage'
import LanguageService from './LanguageService'

export const useCurrentLang = () => {
  const [langKey, setLangKey] = useState(LanguageService.getCurrentLangKey())

  const changeLang = langKey => {
    LanguageService.setCurrentLangKey(langKey)
  }

  const doClientStorageChange = e => {
    const {
      detail: { key }
    } = e

    if (key === ClientStorage.Keys.lang) {
      setLangKey(LanguageService.getCurrentLangKey())
    }
  }

  useEffect(() => {
    window.addEventListener(ClientStorage.EVENT_TYPE, doClientStorageChange)
    return () =>
      window.removeEventListener(
        ClientStorage.EVENT_TYPE,
        doClientStorageChange
      )
  }, [])

  return {
    langKey,
    change: changeLang
  }
}

import { useEffect, useState } from 'react'
import emptyOject from 'empty/object'
import flatten from 'flat'

import LanguageService from './LanguageService'
import { useCurrentLang } from './useCurrentLang'

export const useLangMessages = () => {
  const { langKey, change } = useCurrentLang()
  const [data, setData] = useState({
    langKey,
    messages: emptyOject,
    isReady: false
  })

  useEffect(() => {
    LanguageService.getMessagesPromise().then(langMesssages => {
      const flattenMessages = flatten(langMesssages)
      setData({ langKey, messages: flattenMessages, isReady: true })
    })
  }, [langKey])

  return {
    ...data,
    change
  }
}

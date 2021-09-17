import flatten from 'flat'

import includes from 'lodash/includes'
import keys from 'lodash/keys'

import { ClientStorage } from '../ClientStorage/ClientStorage'
import Config from '../Config/Config'
import { Lang, Languages } from 'constants/Lang'
import { Api } from '../../api/Api'

const getCurrentLangKey = () => {
  const fromStorage = ClientStorage.read(ClientStorage.Keys.lang)
  const fromConfig = Config.getValue('defaultLang', Lang.default.key)
  return fromStorage || fromConfig
}

const setCurrentLangKey = langKey => {
  if (includes(keys(Languages), langKey)) {
    ClientStorage.save(ClientStorage.Keys.lang, langKey, true)
  }
}

const getMessagesPromise = () => {
  return Api.Lang.getMessages(getCurrentLangKey()).then(langMesssages =>
    flatten(langMesssages)
  )
}

const LanguageService = {
  getCurrentLangKey,
  setCurrentLangKey,
  getMessagesPromise
}

export default LanguageService

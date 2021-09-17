import { defaultsDeep } from 'lodash'

const configs = {
  default: {
    key: 'default',
    defaultLang: 'ru'
  }
}

configs.ru = configs.default

configs.en = defaultsDeep({
  key: 'en',
  defaultLang: 'en'
})

export default configs

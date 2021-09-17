import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import keys from 'lodash/keys'

import { getValueFromUrlSearch } from '../../utils/url'
import configs from '../../configs'
import { ClientStorage } from '../ClientStorage/ClientStorage'

export const DEFAULT_CONFIG_KEY = 'default'

const configKeys = keys(configs)

const getConfigKey = () => {
  const fromUrl = getValueFromUrlSearch('cfg')
  const fromStorage = ClientStorage.read(
    ClientStorage.Keys.cfg,
    DEFAULT_CONFIG_KEY
  )

  if (
    !isEmpty(fromUrl) &&
    fromUrl !== fromStorage &&
    includes(configKeys, fromUrl)
  ) {
    ClientStorage.save(ClientStorage.Keys.cfg, fromUrl)
  }
  return fromUrl || fromStorage
}

const getConfig = () => configs[getConfigKey()] || configs[DEFAULT_CONFIG_KEY]

const getValue = (key, defaultValue) => {
  return get(getConfig(), key) || defaultValue
}

const Config = {
  getValue
}

export default Config

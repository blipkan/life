import isEqual from 'lodash/isEqual'

const EVENT_TYPE = 'clientStorage'

const StoredKeys = {
  lang: 'lang',
  cfg: 'cfg',
  life: 'life'
}

const ClientStorages = {
  session: window.sessionStorage,
  local: window.localStorage
}

const ClientStorageForKey = {
  [StoredKeys.cfg]: ClientStorages.session,
  [StoredKeys.lang]: ClientStorages.session,
  [StoredKeys.life]: ClientStorages.local
}

const getStorageForKey = key => ClientStorageForKey[key]

const read = (key, defaultValue) => {
  const storage = getStorageForKey(key)
  if (!storage) return defaultValue
  const value = storage.getItem(key)
  return (value && JSON.parse(value)) || defaultValue
}

const save = (key, value, fireChanges = false) => {
  const storage = getStorageForKey(key)
  if (!storage) return

  if (!fireChanges) {
    storage.setItem(key, JSON.stringify(value))
    return
  }

  const oldValue = read(key)
  storage.setItem(key, JSON.stringify(value))
  if (!isEqual(oldValue, value)) {
    const customEvent = new CustomEvent(EVENT_TYPE, {
      detail: { key, oldValue, newValue: value, storage: getStorageForKey(key) }
    })
    window.dispatchEvent(customEvent)
  }
}

const remove = key => {
  const storage = getStorageForKey(key)
  if (!storage) return
  storage.removeItem(key)
}

export const ClientStorage = {
  Keys: StoredKeys,
  read,
  save,
  remove,
  EVENT_TYPE
}

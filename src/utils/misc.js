import keys from 'lodash/keys'
import isObject from 'lodash/isObject'

export const makeId = (length = 16) =>
  parseInt(
    Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace('.', '')
  )

export const uniqArray = (array = []) => [...new Set(array)]

export const compactArray = (array = []) => array.filter(e => e)

export const consoleMessage = (message, messageType) => {
  const consoleMethod = ['error', 'warn', 'log', 'info'].includes(messageType)
    ? messageType
    : 'error'
  console[consoleMethod](message)
}

export const checkKey = (obj, key, errorMessageType, errorMessage) => {
  if (!isObject(obj)) {
    const message =
      errorMessage || `${JSON.stringify(obj)} cannot have key '${key}'`
    consoleMessage(message, errorMessageType)
    return
  }

  let result
  try {
    result = obj[key]
    if (!result) {
      const message =
        errorMessage ||
        `invalid key '${key}' for object: ${JSON.stringify(
          obj
        )}. Available keys: ${keys(obj)}`
      consoleMessage(message, errorMessageType)
    }
  } catch (e) {
    consoleMessage(e.message, errorMessageType)
  }

  return result
}

export const getIntlText = (formatMessage, messages = {}, key) => {
  const message = messages[key]
  return message ? formatMessage(message) : key
}

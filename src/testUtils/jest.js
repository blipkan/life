/* eslint-env jest */
import last from 'lodash/last'
import join from 'lodash/join'
import noop from 'lodash/noop'

export const mockMethod = (
  object,
  methodName,
  customImplementation,
  accessType
) => {
  let method
  const getMethod = () => method

  const getCalls = () => method.mock.calls

  const getCall = (callNumber = -1) => {
    const calls = getCalls()
    return callNumber === -1 ? last(calls) : calls[callNumber]
  }

  beforeAll(() => {
    method = jest.spyOn(object, methodName, accessType)
    if (customImplementation) {
      method.mockImplementation(customImplementation)
    }
  })

  afterEach(() => {
    method.mockClear()
  })

  afterAll(() => {
    method.mockReset()
    method.mockRestore()
  })

  return {
    method,
    getMethod,
    getCall,
    getCalls
  }
}

export const mockConsoleMethod = (
  consoleMethodName,
  customImplementation = noop
) => {
  const DEFAULT_METHOD_NAME = 'error'
  const methodName = ['error', 'warn', 'log', 'info'].includes(
    consoleMethodName
  )
    ? consoleMethodName
    : DEFAULT_METHOD_NAME

  const { method, getMethod, getCall, getCalls } = mockMethod(
    global.console,
    methodName,
    customImplementation
  )

  const getConsoleMessage = callNumber => {
    return join(getCall(callNumber), ' ')
  }

  return { getConsoleMessage, getMethod, method, getCalls }
}

export const spyConsoleMethod = consoleMethodName =>
  mockConsoleMethod(consoleMethodName, null)

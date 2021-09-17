/* eslint-env jest */
import keys from 'lodash/keys'

import {
  makeId,
  uniqArray,
  compactArray,
  checkKey,
  consoleMessage
} from '../misc'
import { mockConsoleMethod } from '../../testUtils/jest'

describe('utils.misc.makeId', () => {
  it('makes uniq ids', () => {
    const arrayOfIds = Array.from({ length: 15 }, makeId)
    expect(arrayOfIds).toBeDistinct()
  })
})

describe('utils.misc.uniqArray', () => {
  it('returns uniq array', () => {
    const inputArray = [
      '222',
      '333',
      '111',
      '111',
      '222',
      '333',
      '333',
      '111',
      '222',
      '333',
      '111',
      '222',
      '222',
      '333',
      '333',
      '333',
      '333'
    ]
    const resultArray = uniqArray(inputArray)
    const expectedArray = ['111', '222', '333']
    expect(resultArray).toBeDistinct()
    expect(resultArray.sort()).toEqual(expectedArray)
    expect(resultArray.length).toEqual(expectedArray.length)
  })
})

describe('utils.misc.compactArray', () => {
  it('returns compact array', () => {
    const inputArray = [
      false,
      null,
      undefined,
      '',
      0,
      undefined,
      null,
      '111',
      '222',
      '333',
      false,
      null,
      undefined,
      ''
    ]
    const resultArray = compactArray(inputArray)
    const expectedArray = ['111', '222', '333']
    expect(resultArray).toBeDistinct()
    expect(resultArray).toEqual(expectedArray)
    expect(resultArray.length).toEqual(expectedArray.length)
  })
})

describe('utils.misc.consoleMessage', () => {
  const callFunc = (...args) => consoleMessage(...args)
  const testMessage = 'some message'
  const getActualMessage = method => method.mock.calls[0][0]

  const runTest = methodName => {
    const method = jest
      .spyOn(console, methodName || 'error')
      .mockImplementation()

    callFunc(testMessage, methodName)
    expect(method).toHaveBeenCalledTimes(1)
    expect(getActualMessage(method)).toBe(testMessage)
    method.mockRestore()
  }

  it('console.default', () => {
    runTest()
  })

  it('console.error', () => {
    const methodName = 'error'
    runTest(methodName)
  })

  it('console.warn', () => {
    const methodName = 'warn'
    runTest(methodName)
  })

  it('console.log', () => {
    const methodName = 'log'
    runTest(methodName)
  })

  it('console.info', () => {
    const methodName = 'info'
    runTest(methodName)
  })
})

describe('utils.misc.checkKey', () => {
  const callFunc = (...args) => checkKey(...args)
  const { getConsoleMessage, getMethod } = mockConsoleMethod()

  const TestEnum = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3'
  }

  it('existing key', () => {
    const theKey = Object.keys(TestEnum)[0]
    const result = callFunc(TestEnum, theKey)
    expect(result).toBe(TestEnum[theKey])
  })

  it('object=null -> undefined, console.error', () => {
    const theKey = Object.keys(TestEnum)[0]
    const wrongEnum = null
    const result = callFunc(wrongEnum, theKey)
    expect(result).toBeUndefined()
    expect(getMethod()).toHaveBeenCalledTimes(1)
    const message = getConsoleMessage()
    expect(message).toContain(theKey)
    expect(message).toContain(wrongEnum)
  })

  it('object=undefined -> undefined, console.error', () => {
    const theKey = Object.keys(TestEnum)[0]
    const wrongEnum = undefined
    const result = callFunc(wrongEnum, theKey)
    expect(result).toBeUndefined()
    expect(getMethod()).toHaveBeenCalledTimes(1)
    const message = getConsoleMessage()
    expect(message).toContain(theKey)
    expect(message).toContain(wrongEnum)
  })

  it('object=number -> undefined, console.error', () => {
    const theKey = Object.keys(TestEnum)[0]
    const wrongEnum = 1111.11
    const result = callFunc(wrongEnum, theKey)
    expect(result).toBeUndefined()
    expect(getMethod()).toHaveBeenCalledTimes(1)
    const message = getConsoleMessage()
    expect(message).toContain(theKey)
    expect(message).toContain(wrongEnum)
  })

  it('object=string -> undefined, console.error', () => {
    const theKey = Object.keys(TestEnum)[0]
    const wrongEnum = 'some string'
    const result = callFunc(wrongEnum, theKey)
    expect(result).toBeUndefined()
    expect(getMethod()).toHaveBeenCalledTimes(1)
    const message = getConsoleMessage()
    expect(message).toContain(theKey)
    expect(message).toContain(wrongEnum)
  })

  it('wrong key -> undefined, console.error', () => {
    const wrongKey = 'wrongKey'
    const result = callFunc(TestEnum, wrongKey)
    expect(result).toBeUndefined()
    expect(getMethod()).toHaveBeenCalledTimes(1)
    const message = getConsoleMessage()
    expect(message).toContain(wrongKey)
    expect(message).toContain(keys(TestEnum))
  })

  it('undefined key -> undefined, console.error', () => {
    const wrongKey = 'undefined'
    const result = callFunc(TestEnum)
    expect(result).toBeUndefined()
    expect(getMethod()).toHaveBeenCalledTimes(1)
    const message = getConsoleMessage()
    expect(message).toContain(wrongKey)
    expect(message).toContain(keys(TestEnum))
  })

  it('wrong key with custom error message -> undefined, console.error', () => {
    const wrongKey = 'wrongKey'
    const customMessage = 'customMessage'
    const result = callFunc(TestEnum, wrongKey, null, customMessage)
    expect(result).toBeUndefined()
    expect(getMethod()).toHaveBeenCalledTimes(1)
    const message = getConsoleMessage()
    expect(message).toBe(customMessage)
  })
})

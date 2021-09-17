/* eslint-env jest */

import isEqual from 'lodash/isEqual'

import WorldItem from '../WorldItem'
import { mockConsoleMethod, spyConsoleMethod } from '../../testUtils/jest'
import { DeserializeException } from '../../exceptions/DeserializeException'

const ParamName = {
  typeKey: 'typeKey',
  statusKey: 'statusKey'
}

const TestType = WorldItem.Type.LIFE
const TestStatus = WorldItem.Status.PROCESSED
const callConstructor = (...args) => new WorldItem(...args)
const callCreate = (...args) => WorldItem.create(...args)
const createInstance = () => callCreate(TestType.key)

describe('WorldItem.constructor SUCCESS', () => {
  it('constructor - uniq id', () => {
    const instance = callConstructor(TestType.key)
    const instance2 = callConstructor(TestType.key)
    expect(instance.id).not.toBe(instance2.id)
  })

  it('constructor - valid typeKey', () => {
    const instance = callConstructor(TestType.key)
    expect(instance.typeKey).toBe(TestType.key)
    expect(instance.iconKey).toBe(TestType.iconKey)
    expect(instance.continuousCount).toBe(TestType.continuousCount)
  })

  it('constructor - valid statusKey', () => {
    const instance = callConstructor(TestType.key, TestStatus.key)
    expect(instance.statusKey).toBe(TestStatus.key)
    expect(instance.statusIntValue).toBe(TestStatus.intValue)
  })

  it('constructor - undefined statusKey (default=NEW)', () => {
    const defaultStatus = WorldItem.Status.NEW
    const instance = callConstructor(TestType.key)
    expect(instance.statusKey).toBe(defaultStatus.key)
    expect(instance.statusIntValue).toBe(defaultStatus.intValue)
  })
})

describe('WorldItem.constructor WRONG', () => {
  mockConsoleMethod()

  it('constructor - undefined typeKey (throw Error)', () => {
    const expectation = expect(() => callConstructor())
    expectation.toThrowError(ParamName.typeKey)
    expectation.toThrowError('undefined')
    expectation.toThrowErrorMatchingSnapshot()
  })

  it('constructor - wrong typeKey (throw Error)', () => {
    const wrongTypeKey = 'wrongTypeKey'
    const expectation = expect(() => callConstructor(wrongTypeKey))
    expectation.toThrowError(ParamName.typeKey)
    expectation.toThrowError(wrongTypeKey)
    expectation.toThrowErrorMatchingSnapshot()
  })

  it('constructor - wrong statusKey (throw Error)', () => {
    const wrongStatusKey = 'wrongStatusKey'
    const expectation = expect(() =>
      callConstructor(TestType.key, wrongStatusKey)
    )
    expectation.toThrowError(ParamName.statusKey)
    expectation.toThrowError(wrongStatusKey)
    expectation.toThrowErrorMatchingSnapshot()
  })

  it('constructor - wrong typeKey AND wrong statusKey (throw Error)', () => {
    const wrongTypeKey = 'wrongTypeKey'
    const wrongStatusKey = 'wrongStatusKey'
    const expectation = expect(() =>
      callConstructor(wrongTypeKey, wrongStatusKey)
    )
    expectation.toThrowError(ParamName.typeKey)
    expectation.toThrowError(wrongTypeKey)
    expectation.toThrowError(ParamName.statusKey)
    expectation.toThrowError(wrongStatusKey)
    expectation.toThrowErrorMatchingSnapshot()
  })
})

describe('WorldItem.create SUCCESS', () => {
  it('create - uniq id', () => {
    const instance = callCreate(TestType.key)
    const instance2 = callCreate(TestType.key)
    expect(instance.id).not.toBe(instance2.id)
  })

  it('create - valid typeKey', () => {
    const instance = callCreate(TestType.key)
    expect(instance.typeKey).toBe(TestType.key)
    expect(instance.iconKey).toBe(TestType.iconKey)
    expect(instance.continuousCount).toBe(TestType.continuousCount)
  })

  it('create - valid statusKey', () => {
    const instance = callCreate(TestType.key, TestStatus.key)
    expect(instance.statusKey).toBe(TestStatus.key)
    expect(instance.statusIntValue).toBe(TestStatus.intValue)
  })

  it('create - undefined statusKey (default=NEW)', () => {
    const defaultStatus = WorldItem.Status.NEW
    const instance = callCreate(TestType.key)
    expect(instance.statusKey).toBe(defaultStatus.key)
    expect(instance.statusIntValue).toBe(defaultStatus.intValue)
  })
})

describe('WorldItem.create - WRONG', () => {
  const { getConsoleMessage, getMethod } = mockConsoleMethod()

  const performChecks = (paramName, paramValue, callTimes, instance) => {
    expect(instance).toBeUndefined()
    expect(getMethod()).toHaveBeenCalledTimes(callTimes)
    expect(getConsoleMessage(0)).toContain(paramValue)
    const message = getConsoleMessage()
    expect(message).toContain(paramName)
    expect(message).toContain(paramValue)
  }

  it('create - undefined typeKey (undefined instance, console.error)', () => {
    const instance = callCreate()
    performChecks(ParamName.typeKey, undefined, 2, instance)
  })

  it('create - wrong typeKey (undefined instance, console.error)', () => {
    const wrongTypeKey = 'wrongTypeKey'
    const instance = callCreate(wrongTypeKey)
    performChecks(ParamName.typeKey, wrongTypeKey, 2, instance)
  })

  it('create - wrong statusKey (undefined instance, console.error)', () => {
    const wrongStatusKey = 'wrongStatusKey'
    const instance = callCreate(TestType.key, wrongStatusKey)
    performChecks(ParamName.statusKey, wrongStatusKey, 2, instance)
  })

  it('create - wrong typeKey AND wrong statusKey (undefined instance, console.error)', () => {
    const wrongTypeKey = 'wrongTypeKey'
    const wrongStatusKey = 'wrongStatusKey'
    const instance = callCreate(wrongTypeKey, wrongStatusKey)
    performChecks(ParamName.typeKey, wrongTypeKey, 3, instance)
    expect(getConsoleMessage(1)).toContain(wrongStatusKey)
    const message = getConsoleMessage()
    expect(message).toContain(ParamName.statusKey)
    expect(message).toContain(wrongStatusKey)
  })
})

describe('WorldItem.clone SUCCESS', () => {
  it('clone', () => {
    const instance = createInstance()
    const cloned = instance.clone()
    expect(instance).not.toBe(cloned)
    expect(instance.id).not.toBe(cloned.id)
    expect(instance).toEqual(cloned)
    expect(isEqual(instance, cloned)).toBe(true)
  })
})

describe('WorldItem.update SUCCESS', () => {
  it('update', () => {
    const newStatusKey = WorldItem.Status.PROCESSED.key
    const instance = createInstance()
    instance.update({
      [ParamName.statusKey]: newStatusKey
    })
    expect(instance.statusKey).toBe(newStatusKey)
  })

  it('update readOnly - throw Error', () => {
    const newTypeKey = WorldItem.Type.DEAD.key
    const instance = createInstance()
    const expectation = expect(() =>
      instance.update({
        [ParamName.typeKey]: newTypeKey
      })
    )
    expectation.toThrowError()
    expectation.toThrowErrorMatchingSnapshot()
  })
})

describe('WorldItem.serialize', () => {
  const testSerialize = (type, status) => {
    const expectedSerialized =
      status === WorldItem.Status.NEW
        ? type.intValue
        : `${type.intValue}${WorldItem.SERIALIZE_DELIMITER}${status.intValue}`

    const instance = callCreate(type.key, status.key)
    const serialized = instance.serialize()
    expect(serialized).toBe(expectedSerialized)
  }

  describe('WorldItem.serialize [Type]', () => {
    const theStatus = TestStatus

    it('serialize type = LIVE', () => {
      const theType = WorldItem.Type.LIVE
      testSerialize(theType, theStatus)
    })

    it('serialize type = DEAD', () => {
      const theType = WorldItem.Type.DEAD
      testSerialize(theType, theStatus)
    })

    it('serialize type = LIFE', () => {
      const theType = WorldItem.Type.LIFE
      testSerialize(theType, theStatus)
    })
  })

  describe('WorldItem.serialize [Status]', () => {
    const theType = TestType

    it('serialize type = NEW', () => {
      const theStatus = WorldItem.Status.NEW
      testSerialize(theType, theStatus)
    })

    it('serialize type = PROCESSED', () => {
      const theStatus = WorldItem.Status.PROCESSED
      testSerialize(theType, theStatus)
    })

    it('serialize type = DELETED', () => {
      const theStatus = WorldItem.Status.DELETED
      testSerialize(theType, theStatus)
    })
  })
})

describe('WorldItem.deserialize', () => {
  const testDeserialize = (type, status) => {
    const serialized =
      status === WorldItem.Status.NEW
        ? `${type.intValue}`
        : `${type.intValue}${WorldItem.SERIALIZE_DELIMITER}${status.intValue}`

    const instance = WorldItem.deserialize(serialized)
    expect(instance).toBeDefined()
    expect(instance.typeKey).toBe(type.key)
    expect(instance.statusKey).toBe(status.key)
  }

  describe('WorldItem.deserialize [Type]', () => {
    const theStatus = TestStatus

    it('deserialize type = LIVE', () => {
      const theType = WorldItem.Type.LIVE
      testDeserialize(theType, theStatus)
    })

    it('deserialize type = DEAD', () => {
      const theType = WorldItem.Type.DEAD
      testDeserialize(theType, theStatus)
    })

    it('deserialize type = LIFE', () => {
      const theType = WorldItem.Type.LIFE
      testDeserialize(theType, theStatus)
    })
  })

  describe('WorldItem.deserialize [Status]', () => {
    const theType = TestType

    it('deserialize type = NEW', () => {
      const theStatus = WorldItem.Status.NEW
      testDeserialize(theType, theStatus)
    })

    it('deserialize type = PROCESSED', () => {
      const theStatus = WorldItem.Status.PROCESSED
      testDeserialize(theType, theStatus)
    })

    it('deserialize type = DELETED', () => {
      const theStatus = WorldItem.Status.DELETED
      testDeserialize(theType, theStatus)
    })
  })

  describe('WorldItem.deserialize [WRONG input string]', () => {
    mockConsoleMethod()

    const runTest = wrongString => {
      const expectation = expect(() => WorldItem.deserialize(wrongString))
      expectation.toThrowError(DeserializeException)
      expectation.toThrowError('WorldItem')
      expectation.toThrowError(`${wrongString}`)
    }

    it('deserialize from wrong string', () => {
      runTest('some unparsible string')
    })

    it('deserialize from empty string', () => {
      runTest('')
    })

    it('deserialize from null string', () => {
      runTest(null)
    })

    it('deserialize from undefined string', () => {
      runTest(undefined)
    })
  })
})

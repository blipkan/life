/* eslint-env jest */

import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import reduce from 'lodash/reduce'
import values from 'lodash/values'
import map from 'lodash/map'
import last from 'lodash/last'
import first from 'lodash/first'
import join from 'lodash/join'

import { mockConsoleMethod } from '../../testUtils/jest'
import { World } from '../World'
import WorldItem from '../WorldItem'
import { DeserializeException } from '../../exceptions/DeserializeException'

const makeDefaultTypeStatusKeys = () => {
  return reduce(
    values(WorldItem.Type),
    (acc, type) => {
      const byStatuses = reduce(
        values(WorldItem.Status),
        (acc, status) => {
          return [...acc, [type.key, status.key]]
        },
        []
      )
      return [...acc, ...byStatuses]
    },
    []
  )
}

const createItemsByTypeStatusKeys = keys => {
  return map(keys || makeDefaultTypeStatusKeys(), ([type, status]) => {
    const typeKey = isString(type) ? type : type.key
    const statusKey = isString(status) ? status : status?.key

    return WorldItem.create(typeKey, statusKey)
  })
}

const createSerializableItems = keys => {
  return createItemsByTypeStatusKeys(keys).filter(
    item => item.statusKey !== WorldItem.Status.DELETED.key
  )
}

const serializeItems = (items = []) =>
  join(map(items, item => item.serialize()), World.SERIALIZE_DELIMITER)

const isItemSame = (item1 = {}, item2 = {}) => {
  return item1.typeKey === item2.typeKey && item1.statusKey === item2.statusKey
}

const isItemsSame = (items1 = [], items2 = []) => {
  return items1.every((item, index) => {
    return isItemSame(item, items2[index])
  })
}

const item2string = item => {
  return `${item.typeKey}:${item.statusKey}`
}

const items2string = items => map(items, item => item2string(item))

const world2string = world => map(world.items, item => item2string(item))

describe('World.addItem-STATUS', () => {
  it('addItem-STATUS - create LIFE', () => {
    const initialTypes = [[WorldItem.Type.LIVE]]
    const initialItems = createItemsByTypeStatusKeys(initialTypes)

    const instance = World.getInstance()
    instance.__test_setItems(initialItems)
    instance.addItem(WorldItem.Type.LIVE.key)
    expect(last(instance.items).typeKey).toBe(WorldItem.Type.LIFE.key)
    expect(instance.items.length).toBe(initialItems.length + 2)
  })

  it('addItem-STATUS - remove LIFE', () => {
    const initialTypes = [
      [WorldItem.Type.LIFE],
      [WorldItem.Type.DEAD],
      [WorldItem.Type.DEAD]
    ]
    const initialItems = createItemsByTypeStatusKeys(initialTypes)

    const instance = World.getInstance()
    instance.__test_setItems(initialItems)
    instance.addItem(WorldItem.Type.DEAD.key)
    expect(first(instance.items).statusKey).toBe(WorldItem.Status.DELETED.key)
    expect(last(instance.items).typeKey).toBe(WorldItem.Type.DEAD.key)
    expect(instance.items.length).toBe(initialItems.length + 1)
  })
})

describe('World.addItem', () => {
  mockConsoleMethod()

  const testAddItem = (instance, typeKey) => {
    const prevCount = instance.items.length
    const expectedLastItem = WorldItem.create(typeKey, WorldItem.Status.NEW.key)
    instance.addItem(typeKey)
    expect(instance.items.length).toBe(prevCount + 1)
    expect(isItemSame(last(instance.items), expectedLastItem)).toBe(true)
  }

  it('addItem - valid types', () => {
    const instance = World.getInstance()
    testAddItem(instance, WorldItem.Type.LIVE.key)
    testAddItem(instance, WorldItem.Type.DEAD.key)
  })

  it('addItem - invalid typeKey', () => {
    const wrongTypeKey = 'wrongTypeKey'
    const instance = World.getInstance()
    const prevCount = instance.items.length
    instance.addItem(wrongTypeKey)
    expect(instance.items.length).toBe(prevCount)
  })

  it('addItem - non addable type', () => {
    const NonAddableType = WorldItem.Type.LIFE
    const instance = World.getInstance()
    const prevCount = instance.items.length
    instance.addItem(NonAddableType.key)
    expect(instance.items.length).toBe(prevCount)
  })
})

describe('World.serialize', () => {
  mockConsoleMethod()
  it('serialize items', () => {
    const worldItems = createSerializableItems()
    const expectedSerialized = serializeItems(worldItems)
    const world = World.getInstance()
    world.__test_setItems(worldItems)
    const serialized = world.serialize()
    expect(serialized).toBeDefined()
    expect(serialized).toBe(expectedSerialized)
  })

  it('serialize empty', () => {
    const world = World.getInstance().clear()
    const serialized = world.serialize()
    expect(serialized).toBe('')
  })
})

describe('World.deserialize', () => {
  describe('World.deserialize SUCCESS', () => {
    it('deserialize', () => {
      const worldItems = createSerializableItems()

      const serialized = World.serializeItems(worldItems)
      const instance = World.deserialize(serialized)
      expect(instance).toBeDefined()
      const checkSame = isItemsSame(worldItems, instance.items)
      expect(checkSame).toBe(true)
    })
  })

  describe('World.deserialize WRONG part of input string', () => {
    const { getConsoleMessage, getMethod } = mockConsoleMethod()
    it('deserialize parse error', () => {
      const worldItems = createSerializableItems()
      const validPartOfString = World.serializeItems(worldItems)
      const invalidPartOfString = 'AAA,BBB'

      const serialized = `${validPartOfString}${
        World.SERIALIZE_DELIMITER
      }${invalidPartOfString}${World.SERIALIZE_DELIMITER}${validPartOfString}`

      const instance = World.deserialize(serialized)
      expect(instance.items).toStrictEqual([])
      expect(getMethod()).toHaveBeenCalled()
      const message = getConsoleMessage()
      expect(message).toContain('World')
      expect(message).toContain(DeserializeException.name)
    })
  })

  describe('World.deserialize [INVALID input string]', () => {
    const { getConsoleMessage, getMethod } = mockConsoleMethod()

    const runTest = wrongString => {
      const instance = World.deserialize(wrongString)

      expect(instance.items).toStrictEqual([])
      if (!isEmpty(wrongString)) {
        expect(getMethod()).toHaveBeenCalled()
        const message = getConsoleMessage()
        expect(message).toContain('World')
        expect(message).toContain(`${wrongString}`)
        expect(message).toContain(DeserializeException.name)
      }
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

import WorldItem from './WorldItem'

import map from 'lodash/map'
import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'

import { consoleMessage } from '../utils/misc'

const serialize = (worldItems = []) => {
  return map(
    filter(
      worldItems,
      ({ statusKey }) => statusKey !== WorldItem.Status.DELETED.key
    ),
    worldItem => {
      return worldItem.serialize()
    }
  ).join(World.SERIALIZE_DELIMITER)
}

const deserialize = (serialized = '') => {
  if (isEmpty(serialized)) {
    return []
  }

  const serializedItems = serialized.split(World.SERIALIZE_DELIMITER)
  try {
    // TODO: map
    return reduce(
      serializedItems,
      (acc, serializedItem) => {
        const deserialisedItem = WorldItem.deserialize(serializedItem)
        return deserialisedItem ? acc.concat(deserialisedItem) : acc
      },
      []
    )
  } catch (e) {
    const message = `cannot deserialize World from string '${serialized}' due to : ${
      e.stack
    }`
    consoleMessage(message)
  }
  return []
}

// TODO: provide singleton with config (factory?)
export class World {
  static intance
  #items = []

  static SERIALIZE_DELIMITER = ';'

  constructor() {
    if (World.intance) {
      return World.intance
    }
    World.intance = this
    return this
  }

  static getInstance() {
    return new World()
  }

  get items() {
    return this.#items
  }

  addRandomItem() {
    return this.addItem(World.getRandomTypeKey())
  }

  addItem(typeKey) {
    if (!World.ADDABLE_KEYS.includes(typeKey)) {
      return this
    }
    const newItem = WorldItem.create(typeKey)
    if (!newItem) return this

    const newWorldItems = this.#items.concat(newItem)
    const isDead = typeKey === WorldItem.Type.DEAD.key
    const continuousCount = newItem.continuousCount

    const lastContinuousCount = World.getLastContinuousCountOfType(
      newWorldItems,
      typeKey
    )

    // const lastContinuousCount = this.getLastContinuousCountOfType(typeKey)
    let resultItems = newWorldItems

    if (lastContinuousCount >= continuousCount) {
      newItem.statusKey = WorldItem.Status.PROCESSED.key
      if (isDead) {
        const lastIndexOfLife = World.getLastIndexOfLife(newWorldItems)
        if (lastIndexOfLife >= 0) {
          resultItems = newWorldItems.map((item, i) => {
            if (i !== lastIndexOfLife) {
              return item
            }
            return item
              .clone()
              .update({ statusKey: WorldItem.Status.DELETED.key })
          })
        }
      } else {
        resultItems = newWorldItems.concat(
          WorldItem.create(WorldItem.Type.LIFE.key)
        )
      }
    }
    this.#items = resultItems
    return this
  }

  serialize() {
    return serialize(this.#items)
  }

  deserialize(serialized = '') {
    this.#items = deserialize(serialized)
    return this
  }

  clear() {
    this.#items = []
    return this
  }

  __test_setItems(items) {
    this.#items = items
    return this
  }
}

World.getRandomTypeKey = () => {
  const keys = World.ADDABLE_KEYS
  return keys[Math.floor(Math.random() * keys.length)]
}

World.getLastIndexOfLife = items => {
  let i = items.length - 1
  for (i; i >= 0; i--) {
    const worldItem = items[i]
    if (
      worldItem.typeKey === WorldItem.Type.LIFE.key &&
      worldItem.statusKey !== WorldItem.Status.DELETED.key
    ) {
      break
    }
  }
  return i
}

World.getLastContinuousCountOfType = (items, typeKey) => {
  let count = 0
  for (let i = items.length - 1; i >= 0; i--) {
    const worldItem = items[i]
    if (
      worldItem.typeKey === typeKey &&
      worldItem.statusKey !== WorldItem.Status.PROCESSED.key
    ) {
      count++
    } else {
      return count
    }
  }
  return count
}

World.deserialize = serialized => {
  return World.getInstance().deserialize(serialized)
}

World.serializeItems = items => {
  return serialize(items)
}

World.ADDABLE_KEYS = [WorldItem.Type.DEAD.key, WorldItem.Type.LIVE.key]

// export default new World()
export default World.getInstance()

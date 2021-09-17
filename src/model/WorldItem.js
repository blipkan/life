/* eslint-disable no-debugger */
import find from 'lodash/find'
import values from 'lodash/values'
import split from 'lodash/split'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'

import { checkKey, consoleMessage, makeId } from '../utils/misc'
import { DeserializeException } from '../exceptions/DeserializeException'

const WorldItemTypeKey = {
  DEAD: 'DEAD',
  LIVE: 'LIVE',
  LIFE: 'LIFE'
}

const WorldItemStatusKey = {
  DELETED: 'DELETED',
  NEW: 'NEW',
  PROCESSED: 'PROCESSED'
}

const WorldItemStatus = {
  [WorldItemStatusKey.NEW]: {
    key: WorldItemStatusKey.NEW,
    intValue: 0
  },
  [WorldItemStatusKey.DELETED]: {
    key: WorldItemStatusKey.DELETED,
    intValue: 1
  },
  [WorldItemStatusKey.PROCESSED]: {
    key: WorldItemStatusKey.PROCESSED,
    intValue: 2
  }
}

const WorldItemType = {
  [WorldItemTypeKey.LIVE]: {
    key: WorldItemTypeKey.LIVE,
    iconKey: 'live',
    continuousCount: 2,
    displayOrder: 1,
    intValue: 1
  },

  [WorldItemTypeKey.DEAD]: {
    key: WorldItemTypeKey.DEAD,
    iconKey: 'dead',
    continuousCount: 3,
    displayOrder: 2,
    intValue: 2
  },

  [WorldItemTypeKey.LIFE]: {
    key: WorldItemTypeKey.LIFE,
    iconKey: 'birth',
    continuousCount: 0,
    displayOrder: 0,
    intValue: 3
  }
}

class WorldItem {
  #id
  #statusKey
  #type

  static SERIALIZE_DELIMITER = ','

  constructor(typeKey, statusKey = WorldItem.Status.NEW.key) {
    this.checkConstructorArgs(typeKey, statusKey)

    this.#id = makeId()
    this.#statusKey = statusKey
    this.#type = WorldItemType[typeKey]
  }

  checkConstructorArgs(typeKey, statusKey) {
    const invalidArgs = this.constructor.validateConstructorArgs(
      typeKey,
      statusKey
    )

    if (!isEmpty(invalidArgs)) {
      throw new Error(
        `Cannot create ${this.constructor.name} by arguments: ${map(
          invalidArgs,
          arg => `${arg.name}:${arg.value}`
        )}`
      )
    }
  }

  get id() {
    return this.#id
  }

  get iconKey() {
    return this.#type.iconKey
  }

  get continuousCount() {
    return this.#type.continuousCount
  }

  get typeKey() {
    return this.#type.key
  }

  get statusKey() {
    return this.#statusKey
  }

  set statusKey(statusKey) {
    this.#statusKey = statusKey || WorldItem.Status.NEW.key
  }

  get statusIntValue() {
    return WorldItemStatus[this.statusKey].intValue
  }

  clone() {
    return WorldItem.create(this.typeKey, this.statusKey)
  }

  update(valuesMap = {}) {
    Object.entries(valuesMap).forEach(([key, value]) => {
      this[key] = value
    })
    return this
  }

  serialize() {
    const typeValue = this.#type.intValue
    const statusValue = this.statusIntValue

    return statusValue === WorldItem.Status.NEW.intValue
      ? typeValue
      : [typeValue, statusValue].join(WorldItem.SERIALIZE_DELIMITER)
  }
}

WorldItem.deserialize = serialized => {
  try {
    const storedValues = split(serialized, WorldItem.SERIALIZE_DELIMITER)
    const typeValue = storedValues[0] ? +storedValues[0] : undefined
    const statusValue = +storedValues[1]

    const typeKey = find(values(WorldItemType), { intValue: typeValue })?.key
    const statusKey = find(values(WorldItemStatus), { intValue: statusValue })
      ?.key

    return new WorldItem(typeKey, statusKey)
  } catch (e) {
    throw new DeserializeException({
      className: WorldItem.prototype.constructor.name,
      sourceString: serialized,
      causeError: e
    })
  }
}

WorldItem.isTypeKeyValid = typeKey => checkKey(WorldItem.Type, typeKey)
WorldItem.isStatusKeyValid = statusKey => checkKey(WorldItem.Status, statusKey)

WorldItem.validateConstructorArgs = (typeKey, statusKey) => {
  const invalidArgs = []

  if (!WorldItem.isTypeKeyValid(typeKey)) {
    invalidArgs.push({ name: 'typeKey', value: typeKey })
  }

  if (!WorldItem.isStatusKeyValid(statusKey)) {
    invalidArgs.push({ name: 'statusKey', value: statusKey })
  }

  return invalidArgs
}

WorldItem.create = (typeKey, statusKey = WorldItem.Status.NEW.key) => {
  try {
    return new WorldItem(typeKey, statusKey)
  } catch (e) {
    consoleMessage(e.message)
  }
}

WorldItem.Type = WorldItemType
WorldItem.Status = WorldItemStatus

export default WorldItem

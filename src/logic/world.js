import WorldItem from '../model/WorldItem'

const getInitialTypesCounters = () => {
  const types = Object.keys(WorldItem.Type).reduce((acc, key) => {
    return { ...acc, [key]: 0 }
  }, {})
  return types
}

const initialTypesCounters = getInitialTypesCounters()

const getInitialStatsCounters = () => {
  return {
    total: 0,
    types: { ...initialTypesCounters }
  }
}

const getStatsIncrement = worldItem => {
  return worldItem.statusKey !== WorldItem.Status.DELETED.key ? 1 : 0
}

const getStats = (worldItems = []) => {
  const stats = worldItems.reduce((acc, item) => {
    const { typeKey } = item
    const { types } = acc
    const itemIncrement = getStatsIncrement(item)
    const total = acc.total + itemIncrement
    const updatedType = { [typeKey]: types[typeKey] + itemIncrement }
    return {
      ...acc,
      total,
      types: {
        ...types,
        ...updatedType
      }
    }
  }, getInitialStatsCounters())

  return stats
}

export { getStats }

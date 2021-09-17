import { useEffect, useState } from 'react'

import world, { World } from '../../model/World'

import { ClientStorage } from '../../services/ClientStorage/ClientStorage'

export const useLife = props => {
  const [worldItems, setWorldItems] = useState([])

  const clear = () => {
    setWorldItems(World.getInstance().clear().items)
    ClientStorage.remove(ClientStorage.Keys.life)
  }

  const createWorldItem = () => {
    setWorldItems(world.addRandomItem().items)
    const serialized = world.serialize()
    ClientStorage.save(ClientStorage.Keys.life, serialized)
  }

  const doLoad = () => {
    const stored = ClientStorage.read(ClientStorage.Keys.life)
    // setWorldItems(World.getInstance().deserialize(stored).items)
    setWorldItems(World.deserialize(stored).items)
  }

  useEffect(() => {
    doLoad()
  }, [])

  return {
    // TODO:
    worldItems,
    // worldItems: world.items,
    createWorldItem,
    clear
  }
}

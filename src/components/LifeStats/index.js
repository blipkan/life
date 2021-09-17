import React, { useMemo } from 'react'
import * as PropTypes from 'prop-types'

import { createCompose } from 'utils/compose'
import WorldItem from '../../model/WorldItem'

import CageIcon from 'controls/CageIcon'

import './index.scss'

export const Defaults = {
  className: 'life-stats',
  domId: 'life-stats'
}

const LifeStats = props => {
  const {
    stats: { total, types = [] }
  } = props

  const compose = createCompose(props, Defaults)

  const preparedTypes = useMemo(() => {
    const valuesWithDescriptor = Object.entries(types).map(
      ([type, value], index) => {
        const descriptor = WorldItem.Type[type]
        return {
          descriptor,
          value
        }
      }
    )

    return valuesWithDescriptor.sort((a, b) =>
      a.descriptor.displayOrder > b.descriptor.displayOrder ? 0 : -1
    )
  }, [types])

  return (
    <div className={compose.className()} id={compose.id()}>
      <div className={compose.className('total')} title="total">
        {total}
      </div>
      {preparedTypes.map((item, index) => {
        const {
          descriptor,
          descriptor: { key },
          value
        } = item

        return (
          <div className={compose.className('item')} key={descriptor.key}>
            <CageIcon
              className={compose.className('item', 'icon')}
              iconKey={descriptor.iconKey}
              domId={compose.id('item', key, 'icon', index)}
            />
            <span
              className={compose.className('item', 'value')}
              id={compose.id('item', key, 'value', index)}
            >
              {value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

LifeStats.propTypes = {
  domId: PropTypes.string,
  className: PropTypes.string,
  iconKey: PropTypes.string,
  hint: PropTypes.string
}

export default LifeStats

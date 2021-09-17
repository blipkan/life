import React from 'react'
import * as PropTypes from 'prop-types'
import classnames from 'classnames'

import CageItem from '../CageItem'
import './index.scss'

const CageList = props => {
  const { items = [], hasScrollBar } = props

  return (
    <div className={classnames('cage-list', { scrolled: hasScrollBar })}>
      {items.map((item, index) => (
        <CageItem worldItem={item} key={item.id} index={index} />
      ))}
    </div>
  )
}

CageList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  hasScrollBar: PropTypes.bool
}

export default CageList

import React from 'react'
import * as PropTypes from 'prop-types'

import { createCompose } from 'utils/compose'
import getIcon from 'images/icons'

import './index.scss'

export const Defaults = {
  className: 'icon',
  domId: 'icon',
  iconKey: 'blank'
}

const Icon = props => {
  const { iconKey = Defaults.iconKey, hint } = props

  const compose = createCompose(props, Defaults)

  const title = hint || iconKey

  return (
    <div className={compose.className()} id={compose.id()} title={title}>
      <img
        src={getIcon(iconKey)}
        title={title}
        alt={title}
        id={compose.id('img')}
      />
    </div>
  )
}

Icon.propTypes = {
  domId: PropTypes.string,
  className: PropTypes.string,
  iconKey: PropTypes.string,
  hint: PropTypes.string
}

export default Icon

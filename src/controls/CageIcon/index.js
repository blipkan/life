import React from 'react'
import * as PropTypes from 'prop-types'

import { createCompose } from '../../utils/compose'

import Icon from '../common/Icon'

import './index.scss'

export const Defaults = {
  className: 'cage-icon',
  domId: 'cage-icon'
}

const CageIcon = props => {
  const { iconKey } = props

  const compose = createCompose(props, Defaults)

  return (
    <Icon
      className={compose.classNameAndModifier(iconKey)}
      domId={compose.id(iconKey)}
      iconKey={iconKey}
    />
  )
}

CageIcon.propTypes = {
  className: PropTypes.string,
  domId: PropTypes.string,
  iconKey: PropTypes.string
}

export default CageIcon

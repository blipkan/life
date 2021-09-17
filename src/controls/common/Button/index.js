import React from 'react'
import * as PropTypes from 'prop-types'

import { createCompose } from 'utils/compose'

import './index.scss'

export const Defaults = {
  className: 'button',
  domId: 'button'
}

const Button = props => {
  const { caption, hint, onClick } = props

  const compose = createCompose(props, Defaults)

  const doClick = e => {
    e.stopPropagation()
    if (typeof onClick === 'function') onClick(e)
  }

  return (
    <div
      className={compose.className()}
      id={compose.id()}
      title={hint || caption}
      onClick={doClick}
    >
      {caption}
    </div>
  )
}

Button.propTypes = {
  domId: PropTypes.string,
  className: PropTypes.string,
  caption: PropTypes.string,
  hint: PropTypes.string,
  onClick: PropTypes.func
}

export default Button

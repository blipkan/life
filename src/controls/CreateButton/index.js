import React from 'react'
import * as PropTypes from 'prop-types'
import { defineMessages, useIntl } from 'react-intl'

import { createCompose } from 'utils/compose'
import Button from 'controls/common/Button'

import './index.scss'

export const Defaults = {
  className: 'button-create',
  domId: 'button-create'
}

const messages = defineMessages({
  caption: {
    id: 'controls.CreateButton.caption',
    defaultMessage: 'СОТВОРИТЬ'
  },
  hint: {
    id: 'controls.CreateButton.hint',
    defaultMessage: 'Создать новую клетку...'
  }
})

const CreateButton = props => {
  const { onClick } = props

  const { formatMessage } = useIntl()

  const compose = createCompose(props, Defaults)

  const doClick = e => {
    if (typeof onClick === 'function') onClick()
  }

  return (
    <Button
      className={compose.className()}
      domId={compose.id()}
      onClick={doClick}
      caption={formatMessage(messages.caption)}
      hint={formatMessage(messages.hint)}
    />
  )
}

CreateButton.propTypes = {
  onClick: PropTypes.func
}

export default CreateButton

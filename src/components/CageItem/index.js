import React from 'react'
import classnames from 'classnames'
import * as PropTypes from 'prop-types'
import { defineMessages, useIntl } from 'react-intl'

import { createCompose } from 'utils/compose'
import { getIntlText } from 'utils/misc'

import WorldItem from 'model/WorldItem'

import CageIcon from 'controls/CageIcon'

import './index.scss'

export const Defaults = {
  className: 'cage-item',
  domId: 'cage-item'
}

const messages = {
  titles: defineMessages({
    [WorldItem.Type.DEAD.key]: {
      id: 'WorldItem.DEAD.title',
      defaultMessage: 'Мёртвая'
    },
    [WorldItem.Type.LIVE.key]: {
      id: 'WorldItem.LIVE.title',
      defaultMessage: 'Живая'
    },
    [WorldItem.Type.LIFE.key]: {
      id: 'WorldItem.LIFE.title',
      defaultMessage: 'Жизнь'
    }
  }),
  descriptions: defineMessages({
    [WorldItem.Type.DEAD.key]: {
      id: 'WorldItem.DEAD.description',
      defaultMessage: 'или прикидывается'
    },
    [WorldItem.Type.LIVE.key]: {
      id: 'WorldItem.LIVE.description',
      defaultMessage: 'и шевелится!'
    },
    [WorldItem.Type.LIFE.key]: {
      id: 'WorldItem.LIFE.description',
      defaultMessage: 'Ку-ку!'
    }
  })
}

const CageItem = props => {
  const {
    index,
    worldItem: { iconKey, statusKey, typeKey }
  } = props

  const { formatMessage } = useIntl()
  const compose = createCompose(props, Defaults)

  const title = getIntlText(formatMessage, messages.titles, typeKey)
  const description = getIntlText(formatMessage, messages.descriptions, typeKey)

  const doAnimationEnd = e => {
    // console.log('onAnimationEnd===CageItem::::', e)
  }

  return (
    <div
      className={classnames(compose.className(), {
        [compose.modifier('deleted')]:
          statusKey === WorldItem.Status.DELETED.key,
        [compose.modifier('processed')]:
          statusKey === WorldItem.Status.PROCESSED.key
      })}
      onAnimationEnd={e => {
        e.persist()
        doAnimationEnd(e)
      }}
    >
      <CageIcon iconKey={iconKey} domId={compose.id('cage-icon', index)} />
      <div className={compose.className('details')}>
        <div className={compose.className('details', 'title')}>{title}</div>
        <div className={compose.className('details', 'description')}>
          {description}
        </div>
      </div>
    </div>
  )
}

// TODO: restucure
CageItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
  index: PropTypes.number
}

export default CageItem

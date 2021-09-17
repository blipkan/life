import React, { useMemo } from 'react'
import * as PropTypes from 'prop-types'

import map from 'lodash/map'
import values from 'lodash/values'

import { createCompose } from 'utils/compose'

import { useCurrentLang } from 'services/Language/useCurrentLang'

import './index.scss'

import { Languages } from 'constants/Lang'

export const Defaults = {
  className: 'lang-switcher',
  domId: 'lang-switcher'
}

const LangSwitcher = props => {
  const compose = createCompose(props, Defaults)
  const { langKey, change } = useCurrentLang()

  const items = useMemo(() => {
    return map(values(Languages), descriptor => ({
      descriptor,
      isSelected: langKey === descriptor.key
    }))
  })

  const doItemClick = item => {
    if (item.isSelected) return
    change(item.descriptor.key)
  }

  return (
    <div className={compose.className()} id={compose.id()}>
      {items.map(item => {
        const {
          isSelected,
          descriptor: { key, caption, title }
        } = item

        const className = isSelected
          ? compose.classNameAndModifier('selected', 'item')
          : compose.className('item')

        return (
          <span
            className={className}
            id={compose.id('item')}
            key={key}
            title={title}
            onClick={e => {
              e.stopPropagation()
              doItemClick(item)
            }}
          >
            {caption}
          </span>
        )
      })}
    </div>
  )
}

LangSwitcher.propTypes = {
  domId: PropTypes.string,
  className: PropTypes.string
}

export default LangSwitcher

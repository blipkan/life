import React, { useEffect, useRef, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'

import * as logic from 'logic/world'
import { createCompose } from 'utils/compose'

import LangSwitcher from 'components/LangSwitcher'
import CageList from 'components/CageList'
import CreateButton from 'controls/CreateButton'
import LifeStats from 'components/LifeStats'

import { useLife } from './useLife'

import './index.scss'

export const Defaults = {
  className: 'life',
  domId: 'life'
}

const messages = defineMessages({
  headerCaption: {
    id: 'header.titleBar.caption',
    defaultMessage: 'Клеточное наполнение'
  },
  headerHint: {
    id: 'header.titleBar.hint',
    defaultMessage: 'Вернуться в начало...'
  },

  cleareButtonCaption: {
    id: 'header.controls.cleareButton.caption',
    defaultMessage: '[X]'
  },
  cleareButtonHint: {
    id: 'header.controls.cleareButton.hint',
    defaultMessage: 'Очистить историю жизни...'
  }
})

const Life = props => {
  const { formatMessage } = useIntl()
  const compose = createCompose(props, Defaults)

  const containerRef = useRef()
  const innerRef = useRef()

  const manager = useLife()

  const [hasScrollBar, setHasScrollBar] = useState(false)

  const createCage = () => {
    manager.createWorldItem()
  }

  const scrollDown = () => {
    const container = containerRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
    container.scrollTop = container.scrollHeight
    setHasScrollBar(container.scrollHeight > container.clientHeight)
  }

  const scrollTop = () => {
    innerRef.current.scrollIntoView()
  }

  useEffect(() => {
    scrollDown()
  }, [manager.worldItems])

  const doHeaderClick = () => {
    scrollTop()
  }

  const doFooterClick = () => {
    scrollDown()
  }

  const doClearClick = e => {
    e.stopPropagation()
    manager.clear()
  }

  const doAnimationEnd = e => {
    console.log('onAnimationEnd===', e)
  }

  const stats = logic.getStats(manager.worldItems)

  const headerTitle = formatMessage(messages.headerHint)

  return (
    <div className={compose.className()}>
      <header
        className={compose.className('header')}
        onClick={doHeaderClick}
        title={headerTitle}
      >
        <LangSwitcher />
        <span className={compose.className('header', 'title')}>
          {formatMessage(messages.headerCaption)}
        </span>
        <span
          onClick={doClearClick}
          className={compose.className('header', 'clear')}
          title={formatMessage(messages.cleareButtonHint)}
        >
          {formatMessage(messages.cleareButtonCaption)}
        </span>
      </header>
      <div
        className={compose.className('content')}
        ref={containerRef}
        onAnimationEnd={e => {
          e.persist()
          doAnimationEnd(e)
        }}
      >
        <div className={compose.className('content', 'inner')} ref={innerRef}>
          <CageList items={manager.worldItems} hasScrollBar={hasScrollBar} />
        </div>
      </div>
      <footer className={compose.className('footer')} onClick={doFooterClick}>
        <CreateButton onClick={createCage} />
        <LifeStats stats={stats} />
      </footer>
    </div>
  )
}

export default Life

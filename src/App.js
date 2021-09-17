import React from 'react'
import { IntlProvider } from 'react-intl'

import Life from 'components/Life'
import { useLangMessages } from 'services/Language/useLangMessages'

import './App.scss'

const App = () => {
  const { langKey, messages, isReady: isLangReady } = useLangMessages()

  if (!isLangReady) {
    return null
  }

  return (
    <IntlProvider
      textComponent={React.Fragment}
      locale={langKey}
      defaultLocale={langKey}
      messages={messages}
    >
      <Life />
    </IntlProvider>
  )
}

export default App

import React from 'react'
import { IntlProvider } from 'react-intl'
import flatten from 'flat'

const defaultLocale = 'ru'
const locale = defaultLocale

const messages = require(`../../src/messages/${locale}.json`)

export const withIntl = component => {
  return (
    <IntlProvider locale={locale} messages={flatten(messages)}>
      {React.cloneElement(component)}
    </IntlProvider>
  )
}

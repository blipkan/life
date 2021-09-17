/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { withIntl } from 'utils/intl-enzyme'

import App from '../App'

describe('App', () => {
  it('render component', () => {
    const component = shallow(withIntl(<App />))
    expect(component).toMatchSnapshot()
  })
})

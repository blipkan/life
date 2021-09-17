/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { withIntl } from 'utils/intl-enzyme'

import Life from '../index'

describe('Life', () => {
  it('render component', () => {
    const component = shallow(withIntl(<Life />))
    expect(component).toMatchSnapshot()
  })
})

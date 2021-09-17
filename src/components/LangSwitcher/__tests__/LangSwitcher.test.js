/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import LangSwitcher from '../index'

describe('LangSwitcher', () => {
  it('render component', () => {
    const component = shallow(<LangSwitcher />)
    expect(component).toMatchSnapshot()
  })
})

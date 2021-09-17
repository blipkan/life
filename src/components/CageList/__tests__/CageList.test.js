/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import CageList from '../index'

describe('CageList', () => {
  it('render component', () => {
    const component = shallow(<CageList />)
    expect(component).toMatchSnapshot()
  })
})

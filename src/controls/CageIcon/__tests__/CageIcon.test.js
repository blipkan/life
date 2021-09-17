/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import CageIcon from '../index'

describe('CageIcon', () => {
  const DOMID = 'DOMID'
  const CLASSNAME = 'CLASSNAME'
  const onClick = jest.fn(e => e)

  const Properties = {
    className: CLASSNAME,
    domId: DOMID,
    onClick
  }

  it('render component', () => {
    const component = shallow(<CageIcon />)
    expect(component).toMatchSnapshot()
  })

  it('render props', () => {
    const props = { ...Properties }
    const component = shallow(<CageIcon {...props} />)
    expect(component).toMatchSnapshot()
  })
})

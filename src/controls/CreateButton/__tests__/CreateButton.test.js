/* eslint-env jest */

import React from 'react'
import { shallow, mount } from 'enzyme'
import { withIntl } from '../../../utils/intl-enzyme'
import { createCompose } from '../../../utils/compose'

import CreateButton, { Defaults } from '../index'

describe('CreateButton', () => {
  const DOMID = 'DOMID'
  const CLASSNAME = 'CLASSNAME'
  const onClick = jest.fn(e => e)

  const Properties = {
    className: CLASSNAME,
    domId: DOMID,
    onClick
  }

  it('render component', () => {
    const component = shallow(withIntl(<CreateButton />))
    expect(component).toMatchSnapshot()
  })

  it('render props', () => {
    const props = { ...Properties }
    const compose = createCompose(props, Defaults)
    const component = mount(withIntl(<CreateButton {...props} />))
    const div = component.find('div')
    expect(div.prop('id')).toBe(compose.id())
    expect(div.prop('className')).toContain(compose.className())
  })

  it('call onClick', () => {
    const props = { ...Properties }

    const component = mount(withIntl(<CreateButton {...props} />))
    const div = component.find('div')
    div.simulate('click')

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

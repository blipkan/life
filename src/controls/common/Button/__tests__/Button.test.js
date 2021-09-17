/* eslint-env jest */

import React from 'react'
import { mount, shallow, render } from 'enzyme'

import Button, { Defaults } from '../index'
import { createCompose } from '../../../../utils/compose'

describe('Button', () => {
  const mockEventClick = { stopPropagation: jest.fn() }

  const DOMID = 'DOMID'
  const CLASSNAME = 'CLASSNAME'
  const CAPTION = 'CAPTION'
  const HINT = 'HINT'
  const onClick = jest.fn(e => e)

  const Properties = {
    className: CLASSNAME,
    domId: DOMID,
    caption: CAPTION,
    hint: HINT,
    onClick
  }

  it('render component', () => {
    const component = shallow(<Button />)
    expect(component).toMatchSnapshot()
  })

  it('render props', () => {
    const props = { ...Properties }
    const compose = createCompose(props, Defaults)

    const component = shallow(<Button {...props} />)

    expect(component).toMatchSnapshot()
    expect(component.prop('title')).toBe(props.hint)
    expect(component.prop('children')).toBe(props.caption)
    expect(component.prop('id')).toBe(compose.id())
    expect(component.prop('className')).toBe(compose.className())
  })

  it('handle empty hint (show caption)', () => {
    const props = { ...Properties, hint: null }
    const component = shallow(<Button {...props} />)
    const expectedHint = props.caption

    expect(component.prop('title')).toBe(expectedHint)
  })

  it('render empty caption', () => {
    const props = { ...Properties, caption: undefined }
    const component = shallow(<Button {...props} />)

    expect(component.prop('children')).not.toBe(expect.anything())
  })

  it('render composite className', () => {
    const props = { ...Properties, className: 'AAA BBB' }
    const component = shallow(<Button {...props} />)
    const compose = createCompose(props, Defaults)

    expect(component.prop('className')).toBe(compose.className())
  })

  it('call onClick', () => {
    const props = { ...Properties }
    const component = shallow(<Button {...props} />)
    component.simulate('click', mockEventClick)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

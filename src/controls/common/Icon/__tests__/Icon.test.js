/* eslint-env jest */

import React from 'react'
import { mount, shallow, render } from 'enzyme'

import { createCompose } from 'utils/compose'

import Icon, { Defaults } from '../index'

describe('Icon', () => {
  const DOMID = 'DOMID'
  const CLASSNAME = 'CLASSNAME'
  const ICON_KEY = 'ICON_KEY'
  const HINT = 'HINT'
  const Properties = {
    className: CLASSNAME,
    domId: DOMID,
    iconKey: ICON_KEY,
    hint: HINT
  }

  it('render component', () => {
    const component = shallow(<Icon />)
    expect(component).toMatchSnapshot()
  })

  it('render props', () => {
    const props = { ...Properties }
    const compose = createCompose(props, Defaults)

    const component = shallow(<Icon {...props} />)
    const div = component.find('div')
    const img = component.find('img')

    expect(component).toMatchSnapshot()

    expect(div.prop('id')).toBe(compose.id())
    expect(div.prop('className')).toBe(compose.className())
    expect(div.prop('title')).toBe(props.hint)

    expect(img.prop('id')).toBe(compose.id('img'))
    expect(img.prop('alt')).toBe(props.hint)
    expect(img.prop('title')).toBe(props.hint)
  })

  it('handle empty hint (show iconKey)', () => {
    const props = { ...Properties, hint: undefined }
    const component = shallow(<Icon {...props} />)
    const div = component.find('div')
    const img = component.find('img')

    const expectedHint = props.iconKey
    expect(div.prop('title')).toBe(expectedHint)
    expect(img.prop('alt')).toBe(expectedHint)
    expect(img.prop('title')).toBe(expectedHint)
  })

  it('handle empty iconKey (use default=blank)', () => {
    const props = { ...Properties, iconKey: undefined, hint: null }
    const component = shallow(<Icon {...props} />)

    const div = component.find('div')
    const img = component.find('img')

    const expectedHint = Defaults.iconKey
    expect(div.prop('title')).toBe(expectedHint)
    expect(img.prop('alt')).toBe(expectedHint)
    expect(img.prop('title')).toBe(expectedHint)
    expect(typeof img.prop('src')).toBe('string')
  })
})

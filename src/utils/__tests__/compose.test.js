/* eslint-env jest */

import { createCompose, Delimiter } from '../compose'

describe('createCompose', () => {
  const DEFAULT_DOM_ID = 'DEFAULTDOMID'
  const DEFAULT_CLASSNAME = 'DEFAULTCLASSNAMETEST'
  const DOM_ID = 'DOMID'
  const CLASSNAME = 'CLASSNAME1'
  const MODIFIEER = 'MODIFIEER'

  const Defaults = {
    domId: DEFAULT_DOM_ID,
    className: DEFAULT_CLASSNAME
  }

  it('creates from defaults', () => {
    const compose = createCompose({}, Defaults)

    expect(compose.id()).toBe(Defaults.domId)
    expect(compose.className()).toBe(Defaults.className)
  })

  it('creates from props', () => {
    const props = {
      domId: DOM_ID,
      className: CLASSNAME
    }

    const compose = createCompose(props, Defaults)

    expect(compose.id()).toBe(props.domId)
    expect(compose.className()).toBe(`${DEFAULT_CLASSNAME} ${CLASSNAME}`)
    expect(compose.className()).toContain(DEFAULT_CLASSNAME)
    expect(compose.className()).toContain(CLASSNAME)
  })

  it('creates from composed props.className', () => {
    const CLASSNAME2 = 'CLASSNAME2'
    const COMPOSED_CLASSNAME = `${CLASSNAME} ${CLASSNAME2}`
    const props = {
      domId: DOM_ID,
      className: COMPOSED_CLASSNAME
    }

    const compose = createCompose(props, Defaults)

    const actualClassName = compose.className()
    const actualModifier = compose.modifier(MODIFIEER)

    expect(actualClassName).toContain(DEFAULT_CLASSNAME)
    expect(actualClassName).toContain(CLASSNAME)
    expect(actualClassName).toContain(CLASSNAME2)
    expect(actualModifier).toContain(
      `${DEFAULT_CLASSNAME}${Delimiter.MODIFIER}${MODIFIEER}`
    )
    expect(actualModifier).toContain(
      `${CLASSNAME}${Delimiter.MODIFIER}${MODIFIEER}`
    )
    expect(actualModifier).toContain(
      `${CLASSNAME2}${Delimiter.MODIFIER}${MODIFIEER}`
    )
  })

  it('creates from composed props.domId', () => {
    const props = {
      domId: `${DOM_ID} Composed`,
      className: CLASSNAME
    }

    const compose = createCompose(props, Defaults)
    expect(compose.id()).toBe(props.domId)
  })
})

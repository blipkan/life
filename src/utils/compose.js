import { compactArray, uniqArray } from './misc'

export const Delimiter = {
  CLASSNAME: '__',
  MODIFIER: '_',
  ID: '_'
}

const createArrayCompositor = (
  base,
  delimiter = Delimiter.CLASSNAME,
  whiteSpaceAsDelimiter
) => {
  const strings = Array.isArray(base) ? uniqArray(compactArray(base)) : [base]

  const roots = !whiteSpaceAsDelimiter
    ? strings
    : strings.reduce((acc, string) => {
        return acc.concat(...string.split(' '))
      }, [])

  return (...siffixes) => {
    const path = siffixes.join(delimiter)
    return roots.map(
      id => `${id || ''}${id && path ? delimiter : ''}${path || ''}`
    )
  }
}

const createCompositor = (base, delimiter = Delimiter.CLASSNAME) => {
  const arrayCompositor = createArrayCompositor(base, delimiter)
  return (...siffixes) => arrayCompositor(...siffixes).join(' ')
}

const createCompositors = (
  className,
  id,
  {
    classNameDelimiter = Delimiter.CLASSNAME,
    idDelimiter = Delimiter.ID,
    modifierDelimiter = Delimiter.MODIFIER
  } = {}
) => {
  const classNameArrayCompositor = createArrayCompositor(
    className,
    classNameDelimiter,
    true
  )
  const classNameCompositor = (...siffixes) =>
    classNameArrayCompositor(...siffixes).join(' ')

  const modifierCompositor = (modifier, ...siffixes) => {
    const paths = classNameArrayCompositor(...siffixes)
    return paths
      .map(
        path =>
          `${path || ''}${
            modifier && path ? modifierDelimiter : ''
          }${modifier || ''}`
      )
      .join(' ')
  }

  const classNameAndModifierCompositor = (modifier, ...siffixes) => {
    const classNameString = classNameCompositor(...siffixes)
    const modifierString = modifierCompositor(modifier, ...siffixes)
    return `${classNameString} ${modifierString}`
  }

  const idCompositor = createCompositor(id, idDelimiter)

  return {
    id: idCompositor,
    className: classNameCompositor,
    modifier: modifierCompositor,
    classNameAndModifier: classNameAndModifierCompositor
  }
}

export const createCompose = (props = {}, defaults = {}) => {
  const { className, domId } = props
  return createCompositors(
    [defaults.className, className],
    domId || defaults.domId
  )
}

/* eslint-env jest */

// import '@testing-library/jest-dom/extend-expect'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

expect.extend({
  toBeDistinct(received) {
    const pass =
      Array.isArray(received) && new Set(received).size === received.length
    if (pass) {
      return {
        message: () => `expected array is unique [${received}]`,
        pass: true
      }
    } else {
      return {
        message: () => `expected array is not to unique [${received}] `,
        pass: false
      }
    }
  }
})

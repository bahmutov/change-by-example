const { finds } = require('./utils')
/* global describe, it */
describe('custom transforms', () => {
  it('doubles value', () => {
    const source = {
      n: 10
    }
    const destination = {
      n: 20
    }
    const double = x => x * 2
    const options = { transforms: [double] }

    finds(source, destination, options)
  })
})

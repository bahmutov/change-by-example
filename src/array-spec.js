const { finds } = require('./utils')
/* global describe, it */
describe('arrays', () => {
  it('extracts from an array', () => {
    const source = {
      foo: [{ bar: 'bar' }]
    }
    const destination = {
      bar: 'bar'
    }
    finds(source, destination)
  })
})

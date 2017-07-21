const { finds } = require('./utils')
/* global describe, it */
describe('delete property', () => {
  const source = {
    foo: 'f',
    bar: 'b',
    baz: 'baz',
    list: [1, 'foo']
  }
  const destination = {
    bar: 'b',
    baz: 'baz',
    list: [1, 'foo']
  }

  it('deletes properties', () => {
    finds(source, destination)
  })
})

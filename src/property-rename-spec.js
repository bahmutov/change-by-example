const { finds } = require('./utils')
/* global describe, it */
describe('rename', () => {
  it('renames 1 property', () => {
    // notice the value stays the same
    const source = {
      bar: 'b'
    }
    const destination = {
      BAR: 'b'
    }
    finds(source, destination)
  })

  it('renames several properties', () => {
    const source = {
      foo: 'f',
      bar: 'b',
      baz: 'baz'
    }
    const destination = {
      BAR: 'b',
      newBaz: 'baz'
    }
    finds(source, destination)
  })
})

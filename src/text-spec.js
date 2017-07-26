const snapshot = require('snap-shot')

/* global describe, it */
describe('found transform', () => {
  const change = require('.')
  const input = {
    name: 'foo'
  }
  const output = {
    name: 'FOO'
  }

  it('has toString', () => {
    const t = change(input, output)
    const text = t.toString()
    snapshot(text)
  })
})

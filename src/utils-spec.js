const R = require('ramda')
const snapshot = require('snap-shot')

/* global describe, it */
describe('utils', () => {
  describe('lenses', () => {
    const s = {
      foo: 'bar   '
    }

    it('reads', () => {
      const fooLens = R.lensProp('foo')
      const read = R.view(fooLens)
      snapshot(read(s))
    })

    it('reads and transforms', () => {
      const fooLens = R.lensProp('foo')
      const read = R.view(fooLens)
      const change = R.compose(R.toUpper, read)
      const result = change(s)
      snapshot(result)
    })

    it('reads, transforms and sets', () => {
      // input lense
      const fooLens = R.lensProp('foo')
      const read = R.view(fooLens)
      const change = R.compose(R.toUpper, read)

      // output lens
      const barLens = R.lensProp('bar')
      const write = R.set(barLens)

      // prepare value to write
      const set = write(change(s))
      // write it into an empty object
      const result = set({})
      snapshot(result)
    })
  })
})

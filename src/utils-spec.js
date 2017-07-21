const R = require('ramda')
const snapshot = require('snap-shot')
const is = require('check-more-types')
const la = require('lazy-ass')

/* global describe, it */
describe('utils', () => {
  describe('allPaths', () => {
    const { allPaths } = require('./utils')

    it('is a function', () => {
      la(is.fn(allPaths))
    })

    it('works for non-objects', () => {
      snapshot(allPaths('foo'))
    })

    it('works for flat object', () => {
      snapshot(allPaths({ foo: 1, bar: 2 }))
    })

    it('works for nested object', () => {
      snapshot(allPaths({ foo: { bar: 2 } }))
    })

    it('example', () => {
      const o = {
        age: 21,
        name: {
          first: 'joe',
          last: 'smith'
        }
      }
      const paths = allPaths(o)
      snapshot(paths)
    })

    it('allows arrays', () => {
      const o = [{ foo: 'bar' }]
      const paths = allPaths(o)
      snapshot(paths)
    })
  })

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

    it('works with array indices', () => {
      const list = ['foo', 'bar']
      const read = R.view(R.lensPath(['1']))
      const value = read(list)
      la(value === 'bar', 'invalid value', value)
    })
  })
})

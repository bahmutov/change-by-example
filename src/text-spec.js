const snapshot = require('snap-shot')
const R = require('ramda')
const _ = require('lodash')

/* global describe, it */
describe('found transform', () => {
  const change = require('.')

  it('has toString', () => {
    const input = {
      name: 'foo'
    }
    const output = {
      name: 'FOO'
    }
    const t = change(input, output)
    const text = t.toString()
    snapshot(text)
  })

  it('two properties', () => {
    const input = {
      name: 'foo',
      age: 42
    }
    const output = {
      name: 'FOO',
      age: 42
    }
    const t = change(input, output)
    const text = t.toString()
    snapshot(text)
  })

  it('nested source properties', () => {
    const input = {
      name: {
        first: 'foo'
      }
    }
    const output = {
      name: 'foo'
    }
    const t = change(input, output)
    const text = t.toString()
    snapshot(text)
  })

  it('nested destination properties', () => {
    const input = {
      name: 'foo',
      other: {
        info: {
          age: '42'
        }
      }
    }
    const output = {
      name: {
        first: 'foo'
      },
      age: 42
    }
    const t = change(input, output)
    const text = t.toString()
    snapshot(text)
  })

  it('works on readme example', () => {
    const source = {
      name: 'john',
      age: '42',
      occupation: 'mechanic'
    }
    const destination = {
      name: 'John',
      age: 42
    }
    const t = change(source, destination)
    const text = t.toString()
    snapshot(text)
  })

  it('can eval a function', () => {
    // for example for this transform
    // name.first: R.identity(name)
    // age: _.parseInt(other.info.age)
    function f (source) {
      return R.mergeAll([
        R.assocPath(
          ['name', 'first'],
          R.identity(R.view(R.lensPath(['name']), source)),
          {}
        ),
        R.assocPath(
          ['age'],
          _.parseInt(R.view(R.lensPath(['other', 'info', 'age']), source)),
          {}
        )
      ])
    }
    const input = {
      name: 'foo',
      other: {
        info: {
          age: '42'
        }
      }
    }
    const output = f(input)
    snapshot(output)
  })
})

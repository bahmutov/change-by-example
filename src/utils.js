const R = require('ramda')
const debug = require('debug')('change-by-example')
const is = require('check-more-types')
const la = require('lazy-ass')
const diff = require('variable-diff')

const stringTransforms = require('./string-transforms')()

const otherTransforms = [
  {
    f: R.identity,
    name: 'R.identity'
  }
]

const transforms = otherTransforms.concat(stringTransforms)

// combinations of two transforms
const combine = (t, s) => {
  // some edge cases
  if (t.f === R.identity && s.f === R.identity) {
    return t
  }
  const combined = {
    f: R.compose(t.f, s.f),
    name: `${t.name} * ${s.name}`
  }
  return combined
}
const transforms2 = R.flatten(
  transforms.map(t => transforms.map(s => combine(t, s)))
)

// returns transform function that is Transform(get view lens)
const findTransform = source => value => {
  // given source object and desired value
  // find T and key such that T(source[sourcePath]) = value
  // where sourcePath is nested path (via lensPath)
  let sourcePath
  let transform

  const paths = allPaths(source)
  la(Array.isArray(paths), 'could not compute list of paths from', source)

  paths.some(path => {
    const sourceValue = R.view(R.lensPath(path), source)
    const foundTransform = transforms2.some(t => {
      try {
        const out = t.f(sourceValue)
        if (R.equals(value, out)) {
          sourcePath = path
          transform = t
          return true
        }
      } catch (e) {}
    })
    return foundTransform
  })

  if (sourcePath && transform) {
    const sourceValue = R.view(R.lensPath(sourcePath), source)
    debug('%s( [%s]:%s ) -> %s', transform.name, sourcePath, sourceValue, value)

    const read = R.view(R.lensPath(sourcePath))
    const change = R.compose(transform.f, read)
    return change
  }
}

// given an object returns list of all possible paths in it
// allPaths({foo: {bar: 42}})
// [['foo'], ['foo', 'bar']]
function allPaths (object, previousPath = [], paths = []) {
  let keys

  if (is.object(object)) {
    keys = Object.keys(object)
  } else if (Array.isArray(object)) {
    keys = R.range(0, object.length)
  }

  if (!keys) {
    return paths
  }

  keys.forEach(key => {
    const pathWithKey = [].concat(previousPath).concat(key)
    paths.push(pathWithKey)
    allPaths(object[key], pathWithKey, paths)
  })
  return paths
}

// good way to check if we can find transformation
function finds (source, destination) {
  const change = require('.')
  const f = change(source, destination)
  const result = f(source)
  la(
    R.equals(result, destination),
    diff(destination, result).text,
    'result',
    result,
    'expected',
    destination
  )
  return f
}

module.exports = { findTransform, allPaths, finds }

const R = require('ramda')
const debug = require('debug')('change-by-example')
const is = require('check-more-types')
const la = require('lazy-ass')

const stringTransforms = require('./string-transforms')()

const otherTransforms = [
  {
    f: R.identity,
    name: 'R.identity'
  }
]

const transforms = otherTransforms.concat(stringTransforms)

// returns transform function that is Transform(get view lens)
const findTransform = source => value => {
  // given source object and desired value
  // find T and key such that T(source[sourcePath]) = value
  // where sourcePath is nested path (via lensPath)
  let sourcePath
  let transform

  const paths = allPaths(source)
  la(Array.isArray(paths), 'could not compute list of paths from', source)

  // R.keys(source).some(key => {
  paths.some(path => {
    const sourceValue = R.view(R.lensPath(path), source)
    const foundTransform = transforms.some(t => {
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
  if (!is.object(object)) {
    return paths
  }
  const keys = Object.keys(object)

  keys.forEach(key => {
    const pathWithKey = [].concat(previousPath).concat(key)
    paths.push(pathWithKey)
    allPaths(object[key], pathWithKey, paths)
  })
  return paths
}

module.exports = { findTransform, allPaths }

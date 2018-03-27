const R = require('ramda')
const debug = require('debug')('change-by-example')
const la = require('lazy-ass')
const diff = require('variable-diff')
const allPaths = require('@bahmutov/all-paths')

const stringTransforms = require('./string-transforms')()

const otherTransforms = [
  {
    f: R.identity,
    name: 'R.identity'
  }
]

// combinations of two transforms
const combine = (t, s) => {
  const combined = {
    f: R.compose(t.f, s.f),
    name: `${t.name} * ${s.name}`
  }
  return combined
}
const transforms2 = R.flatten(
  stringTransforms.map(t => stringTransforms.map(s => combine(t, s)))
)
// first simple transforms, then combinations
const transforms = otherTransforms.concat(stringTransforms).concat(transforms2)

const wrapCustomTransforms = fns =>
  fns.map(f => {
    return {
      f,
      name: f.name
    }
  })

// returns transform function that is Transform(get view lens)
const findTransform = (source, customTransforms = []) => value => {
  // given source object and desired value
  // find T and key such that T(source[sourcePath]) = value
  // where sourcePath is nested path (via lensPath)
  let sourcePath
  let transform

  const allTransforms = []
    .concat(transforms)
    .concat(wrapCustomTransforms(customTransforms))

  const paths = allPaths(source)
  la(Array.isArray(paths), 'could not compute list of paths from', source)

  paths.some(path => {
    const sourceValue = R.view(R.lensPath(path), source)
    const foundTransform = allTransforms.some(t => {
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
    const named = {
      f: change,
      name: `${transform.name}(${sourcePath.join('.')})`
    }
    return named
  }
}

// good way to check if we can find transformation
function finds (source, destination, options) {
  const change = require('.')
  const f = change(source, destination, options)
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

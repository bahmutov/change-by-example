const R = require('ramda')
const debug = require('debug')('change-by-example')

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
  // find T and key such that T(source[key]) = value
  let sourceKey
  let transform

  R.keys(source).some(key => {
    const sourceValue = source[key]
    const foundTransform = transforms.some(t => {
      try {
        const out = t.f(sourceValue)
        if (R.equals(value, out)) {
          sourceKey = key
          transform = t
          return true
        }
      } catch (e) {}
    })
    return foundTransform
  })

  if (sourceKey && transform) {
    debug(
      '%s( %s:%s ) -> %s',
      transform.name,
      sourceKey,
      source[sourceKey],
      value
    )

    const read = R.view(R.lensProp(sourceKey))
    const change = R.compose(transform.f, read)
    return change
  }
}

module.exports = { findTransform }

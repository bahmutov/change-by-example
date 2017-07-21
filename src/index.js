const is = require('check-more-types')
const la = require('lazy-ass')
const R = require('ramda')
const debug = require('debug')('change-by-example')
const pluralize = require('pluralize')

const stringTransforms = require('./string-transforms')()

const otherTransforms = [
  {
    f: R.identity,
    name: 'R.identity'
  }
]

const transforms = otherTransforms.concat(stringTransforms)

function o2o (source, destination) {
  la(is.object(source), 'expected an object', source)
  la(is.object(destination), 'expected an object', destination)

  // look at each destination property
  const destinationPropertyTransforms = []

  // returns transform function that is Transform(get view lens)
  const findTransform = value => {
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

  R.keys(destination).forEach(key => {
    const destinationValue = destination[key]
    const readTransform = findTransform(destinationValue)
    if (readTransform) {
      const write = R.set(R.lensProp(key))
      const readAndWrite = (from, to) => write(readTransform(from), to)
      destinationPropertyTransforms.push(readAndWrite)
    }
  })

  if (is.unempty(destinationPropertyTransforms)) {
    debug(
      'output transform with %s',
      pluralize('function', destinationPropertyTransforms.length, true)
    )
    // hmm, we can probably simplify this using merge
    const transform = from => {
      return destinationPropertyTransforms.reduce((out, t) => {
        return t(from, out)
      }, {})
    }
    return transform
  }
}

module.exports = o2o

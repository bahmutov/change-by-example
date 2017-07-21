const is = require('check-more-types')
const la = require('lazy-ass')
const R = require('ramda')
const debug = require('debug')('change-by-example')
const pluralize = require('pluralize')
const { findTransform } = require('./utils')

function o2o (source, destination) {
  la(is.object(source), 'expected an object', source)
  la(is.object(destination), 'expected an object', destination)

  const findTransformTo = findTransform(source)

  // look at each destination property
  const destinationPropertyTransforms = []

  R.keys(destination).forEach(key => {
    const destinationValue = destination[key]
    const readTransform = findTransformTo(destinationValue)
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

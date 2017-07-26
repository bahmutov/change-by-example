const is = require('check-more-types')
const la = require('lazy-ass')
const R = require('ramda')
const debug = require('debug')('change-by-example')
const pluralize = require('pluralize')
const { allPaths, findTransform } = require('./utils')

function o2o (source, destination, options = {}) {
  la(is.object(source), 'expected an object', source)
  la(is.object(destination), 'expected an object', destination)

  const customTransforms = Array.isArray(options.transforms)
    ? options.transforms
    : []

  const findTransformTo = findTransform(source, customTransforms)

  // look at each destination property
  const destinationPropertyTransforms = []

  const paths = allPaths(destination)
  la(Array.isArray(paths), 'could not compute list of paths from', destination)

  paths.forEach(path => {
    const destinationValue = R.view(R.lensPath(path), destination)
    const readTransform = findTransformTo(destinationValue)
    if (readTransform) {
      const write = R.set(R.lensPath(path))
      const readAndWrite = (from, to) => write(readTransform.f(from), to)
      const named = {
        f: readAndWrite,
        name: `${path}: ${readTransform.name}`
      }
      destinationPropertyTransforms.push(named)
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
        return t.f(from, out)
      }, {})
    }
    transform.toString = () => {
      return destinationPropertyTransforms.map(t => t.name).join('\n')
    }
    return transform
  }
}

module.exports = o2o

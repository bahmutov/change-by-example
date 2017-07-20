const is = require('check-more-types')
const la = require('lazy-ass')
const R = require('ramda')
const _ = require('lodash')
const debug = require('debug')('change-by-example')

function o2o (source, destination) {
  la(is.object(source), 'expected an object', source)
  la(is.object(destination), 'expected an object', destination)

  const evolver = {}
  const deleted = []

  const stringTransforms = [
    R.trim,
    R.toLower,
    R.toUpper,
    _.camelCase,
    _.capitalize,
    _.deburr,
    _.escape,
    _.kebabCase,
    _.lowerFirst,
    _.parseInt,
    _.snakeCase,
    _.startCase,
    _.trimEnd,
    _.trimStart,
    _.unescape,
    _.upperFirst,
    _.words
  ]
  const stringTransformsNames = [
    'R.trim',
    'R.toLower',
    'R.toUpper',
    '_.camelCase',
    '_.capitalize',
    '_.deburr',
    '_.escape',
    '_.kebabCase',
    '_.lowerFirst',
    '_.parseInt',
    '_.snakeCase',
    '_.startCase',
    '_.trimEnd',
    '_.trimStart',
    '_.unescape',
    '_.upperFirst',
    '_.words'
  ]

  // move unchanged keys
  R.keys(source).forEach(key => {
    if (R.equals(source[key], destination[key])) {
      debug('key "%s" is unchanged', key)
      evolver[key] = R.identity
    } else if (key in destination) {
      // find transform that "moves" the value correctly
      // do this later as a "generative key"
    } else {
      // assume we are deleting this key
      debug('deleting key "%s"', key)
      deleted.push(key)
    }
  })

  // remaining destination properties must be generated
  const knownKeys = R.concat(R.keys(evolver), deleted)
  debug('known source keys', knownKeys)
  const generatedDestinationKeys = R.without(knownKeys, R.keys(destination))
  debug('destination keys to generate', generatedDestinationKeys)

  // find source value that matches - maybe it is a rename?
  // or maybe it is one of the other simple string transforms,
  // like trim or lower case?
  const renames = []
  generatedDestinationKeys.forEach(destKey => {
    const destValue = destination[destKey]
    R.keys(source).forEach((key, index) => {
      stringTransforms.forEach((transform, k) => {
        if (R.equals(transform(source[key]), destValue)) {
          const transformName = stringTransformsNames[k]
          debug(
            'source key "%s" and destination key "%s" have same value',
            key,
            destKey
          )
          debug('when using transform', transformName)
          // TODO use lenses here
          const rename = from => {
            const value = transform(source[key])
            return R.merge(from, { [destKey]: value })
          }
          renames.push(rename)
        }
      })
    })
  })

  const transforms = [R.identity]
  if (is.unempty(evolver)) {
    transforms.push(R.evolve(evolver))
  }
  if (is.unempty(deleted)) {
    transforms.push(R.omit(deleted))
  }
  if (is.unempty(renames)) {
    const renameAll = source => {
      return renames.reduce((from, rename) => {
        return rename(from)
      }, source)
    }
    transforms.push(renameAll)
  }

  const transform = R.pipe.apply(null, transforms)

  return transform
}

module.exports = o2o

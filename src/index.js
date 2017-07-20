const is = require('check-more-types')
const la = require('lazy-ass')
const R = require('ramda')
const debug = require('debug')('change-by-example')

const stringTransforms = require('./string-transforms')()

function o2o (source, destination) {
  la(is.object(source), 'expected an object', source)
  la(is.object(destination), 'expected an object', destination)

  const copied = []
  const deleted = []

  // move unchanged keys
  R.keys(source).forEach(key => {
    if (R.equals(source[key], destination[key])) {
      debug('key "%s" is unchanged', key)
      copied.push(key)
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
  const knownKeys = R.concat(copied, deleted)
  debug('known source keys', knownKeys)
  const generatedDestinationKeys = R.without(knownKeys, R.keys(destination))
  debug('destination keys to generate', generatedDestinationKeys)

  // find source value that matches - maybe it is a rename?
  // or maybe it is one of the other simple string transforms,
  // like trim or lower case?
  const renames = []
  generatedDestinationKeys.forEach(destKey => {
    const destValue = destination[destKey]
    R.keys(source).some((key, index) => {
      return stringTransforms.some(transform => {
        if (R.equals(transform.f(source[key]), destValue)) {
          const transformName = transform.name
          if (typeof destValue === 'string') {
            debug(
              'found %s("%s:%s") -> "%s:%s"',
              transformName,
              key,
              source[key],
              destKey,
              destValue
            )
          } else {
            debug('key "%s" -> "%s" have same value', key, destKey)
            debug('  when using transform', transformName)
          }

          // TODO use lenses here
          const rename = from => {
            const value = transform.f(from[key])
            const renamed = { [destKey]: value }
            console.log('merging', from)
            console.log('with', renamed)
            return R.merge(from, renamed)
          }
          renames.push(rename)
          return true
        }
      })
    })
  })

  const transforms = [R.identity]
  if (is.unempty(renames)) {
    const renameAll = source => {
      return renames.reduce((from, rename) => {
        return rename(from)
      }, source)
    }
    transforms.push(renameAll)
  }

  if (is.unempty(copied)) {
    const copyAll = R.pick(copied)
    const copyAndMerge = source => {
      const copied = copyAll(source)
      return R.merge(source, copied)
    }
    transforms.push(copyAndMerge)
  }

  if (is.unempty(deleted)) {
    transforms.push(R.omit(deleted))
  }

  // console.log('transform pipe', transforms.map(t => t.name).join(' -> '))
  const transform = R.pipe.apply(null, transforms)

  return transform
}

module.exports = o2o

const la = require('lazy-ass')
const R = require('ramda')
const _ = require('lodash')

const transforms = [
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
const names = [
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

la(transforms.length === names.length, 'different transform lengths')

const namedFunction = (f, name) => ({ f, name })

function getStringTransforms () {
  return R.zipWith(namedFunction, transforms, names)
}

module.exports = getStringTransforms

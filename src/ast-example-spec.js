const change = require('.')
const R = require('ramda')

describe.only('transform AST jsons', () => {
  it('transforms add function', () => {
    /*
      source literally is AST json of
      function add(a, b) {
        return a + b
      }
      without start, end indices
    */
    const source = require('./add-a-b-ast.json')
    /*
      destination is AST json of
      function add(a, b) {
        return a - b
      }
      without start, end indices
    */
    const destination = require('./sub-a-b-ast.json')

    // since one of the changes is from "+" to "-"
    // make it intro custom transform
    const plusToMinus = s => s === '+' ? '-' : s
    const options = { transforms: [plusToMinus] }

    const f = change(source, destination, options)
    const out = f(source)
    console.log(JSON.stringify(out, null, 2))
    console.log('output is destination?', R.equals(out, destination))
    // escodegen should be able to generate code from the AST tree
    // var escodegen = require('escodegen')
    // escodegen.generate(out)
  })
})

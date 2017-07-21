const change = require('.')

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
    const f = change(source, destination)
    const out = f(source)
    console.log(out)
  })
})

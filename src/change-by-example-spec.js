const change = require('.')
const is = require('check-more-types')
const la = require('lazy-ass')
const R = require('ramda')
const diff = require('variable-diff')

/* global describe, it */
describe('change-by-example', () => {
  function finds (source, destination) {
    const f = change(source, destination)
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

  it('works on readme example', () => {
    const source = {
      name: 'john',
      age: '42',
      occupation: 'mechanic'
    }
    const destination = {
      name: 'John',
      age: 42
    }
    const f = finds(source, destination)
    const newSource = {
      name: 'mary',
      age: '30',
      occupation: 'engineer'
    }
    const output = f(newSource)
    const expected = {
      name: 'Mary',
      age: 30
    }
    la(R.equals(output, expected), diff(expected, output).text)
  })

  it.skip('should generate non-flat object', () => {
    const source = {
      name: {
        first: 'joe',
        last: 'smith'
      }
    }
    const destination = {
      name: {
        first: 'joe'
      }
    }
    finds(source, destination)
  })

  it('works with nested objects', () => {
    const source = {
      age: 42,
      name: {
        first: 'joe',
        last: 'smith'
      }
    }
    const destination = {
      first: 'Joe',
      last: 'Smith'
    }
    finds(source, destination)
  })

  describe('delete property', () => {
    const source = {
      foo: 'f',
      bar: 'b',
      baz: 'baz',
      list: [1, 'foo']
    }
    const destination = {
      bar: 'b',
      baz: 'baz',
      list: [1, 'foo']
    }

    it('finds transform', () => {
      const f = change(source, destination)
      la(is.fn(f))
    })

    it('transform works', () => {
      finds(source, destination)
    })
  })

  describe('rename property', () => {
    const source = {
      foo: 'f',
      bar: 'b',
      baz: 'baz'
    }
    const destination = {
      BAR: 'b'
    }

    it('works', () => {
      finds(source, destination)
    })
  })

  describe('generate property', () => {
    describe('strings', () => {
      describe('trim', () => {
        const source = {
          text: ' f    '
        }
        const destination = {
          text: 'f'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('trim with rename', () => {
        const source = {
          name: ' f    '
        }
        const destination = {
          cleanName: 'f'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('upper case', () => {
        const source = {
          title: 'mr.'
        }
        const destination = {
          title: 'MR.'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('lower case', () => {
        const source = {
          greeting: 'Hello'
        }
        const destination = {
          greeting: 'hello'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('_.trimEnd', () => {
        const source = {
          greeting: 'Hello    '
        }
        const destination = {
          greeting: 'Hello'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('_.trimStart', () => {
        it('works', () => {
          const source = {
            greeting: '    hello there '
          }
          const destination = {
            greeting: 'hello there '
          }
          finds(source, destination)
        })

        it('works with several fields', () => {
          const source = {
            greeting: '    hello there ',
            bye: ' good bye '
          }
          const destination = {
            greeting: 'hello there ',
            bye: 'good bye '
          }
          finds(source, destination)
        })
      })

      describe('_.camelCase', () => {
        const source = {
          greeting: 'foo bar--baz '
        }
        const destination = {
          greeting: 'fooBarBaz'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('_.deburr', () => {
        const source = {
          text: 'déjà vu'
        }
        const destination = {
          text: 'deja vu'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('_.escape', () => {
        const source = {
          text: 'fred, barney, & pebbles'
        }
        const destination = {
          text: 'fred, barney, &amp; pebbles'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('_.kebabCase', () => {
        const source = {
          one: 'Foo Bar',
          two: 'fooBar',
          three: '__FOO_BAR__'
        }
        const destination = {
          one: 'foo-bar',
          two: 'foo-bar',
          three: 'foo-bar'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('_.parseInt', () => {
        const source = {
          age: '42'
        }
        const destination = {
          age: 42
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('_.snakeCase', () => {
        const source = {
          one: 'Foo Bar',
          two: 'fooBar',
          three: '__FOO_BAR__'
        }
        const destination = {
          one: 'foo_bar',
          two: 'foo_bar',
          three: 'foo_bar'
        }

        it('works', () => {
          finds(source, destination)
        })
      })

      describe('misc text', () => {
        it('works for several fields', () => {
          const source = {
            one: '  abc  ',
            two: '  abc  ',
            three: 'fred, barney, &amp; pebbles',
            four: 'fred',
            five: 'fred, barney, & pebbles'
          }
          const destination = {
            one: '  abc',
            two: 'abc  ',
            three: 'fred, barney, & pebbles',
            four: 'Fred',
            five: ['fred', 'barney', 'pebbles']
          }
          finds(source, destination)
        })

        it('works for two fields', () => {
          const source = {
            one: 'abc',
            two: '  abc  '
          }
          const destination = {
            one: 'abc',
            two: 'abc  '
          }
          finds(source, destination)
        })

        it('works for few fields', () => {
          const source = {
            one: '  abc  ',
            two: '  abc  '
          }
          const destination = {
            one: '  abc',
            two: 'abc  '
          }
          finds(source, destination)
        })
      })
    })
  })
})

# change-by-example

> Finds a function that transforms a given object into another given object.

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]
[![next-update-travis badge][nut-badge]][nut-readme]

## Install

Requires [Node](https://nodejs.org/en/) version 6 or above.

```sh
npm install --save change-by-example
```

## Use

Imagine we have two objects: a source object and a destination object.
If we want to transform the source into destination, we have to write the
transform function ourselves. We could use shortcuts like
[Ramda.evolve](http://ramdajs.com/docs/#evolve) or use one of the libs helping
us write the tranform (like [map-factory](https://github.com/midknight41/map-factory),
[xform](https://github.com/dvdln/xform), [mapper.js](https://github.com/Jokero/mapper.js).
[transformo](https://github.com/lutowolk/transformo)). All this is complicated.

Why can't the computer *compute* the transform that from source -> destination
pair? Well, `change-by-example` is an attempt to do this.

Give it two objects and get back and transform function

```js
const change = require('change-by-example')
const source = {
  name: 'john',
  age: '42',
  occupation: 'mechanic'
}
const destination = {
  name: 'John',
  age: 42
}
const f = change(source, destination)
```

If you call this transform function with original source object, you get
back destination again

```js
console.log(f(source))
// {name: "John", age: 42}
```

But if you give it an object of the *same shape as source*, it will transform
it **the same way**.

```js
console.log(f({
  name: 'mary',
  age: '30',
  occupation: 'engineer'
}))
// {name: 'Mary', age: 30}
```

## Advanced

You can nest source and destination objects and even pass additional
unary value transform functions to try. See [spec](src/custom-transforms-spec.js).

## Examples

* Extracting GitHub repo information [by example](examples/github.js)

## Supported

* [x] generates transformation function string representation [#1][1]
* [x] property delete [spec](src/property-delete-spec.js)
* [x] property rename [spec](src/property-rename-spec.js)
* [x] simple string transforms from [Ramda](http://ramdajs.com/docs/)
  and [Lodash](https://lodash.com/docs/)
* [x] deep source paths [#3][3]
* [x] deep destination paths [#7][7]
* [x] compound transforms like `trim + toLower` [#8][8]
* [x] extracting from arrays [#9][9] [spec](src/array-spec.js)
* [x] passing custom transforms to use [#10][10] [spec](src/custom-transforms-spec.js)
* [ ] combining values like `.fullName = .first` + `.last`

[1]: https://github.com/bahmutov/change-by-example/issues/1
[3]: https://github.com/bahmutov/change-by-example/issues/3
[7]: https://github.com/bahmutov/change-by-example/issues/7
[8]: https://github.com/bahmutov/change-by-example/issues/8
[9]: https://github.com/bahmutov/change-by-example/issues/9
[10]: https://github.com/bahmutov/change-by-example/issues/10

## Debugging

Run with environment variable `DEBUG=change-by-example ...`

## Human text

You can see the human-friendly transformation by printing the
returned transform's function. It shows for each destination property
the transform and the source property. For above example it would print

```js
const source = {
  name: 'john',
  age: '42',
  occupation: 'mechanic'
}
const destination = {
  name: 'John',
  age: 42
}
const change = require('change-by-example')
const t = change(source, destination)
console.log(t.toString())
/*
name: _.capitalize(name)
age: _.parseInt(age)
*/
```

Similarly, deep paths will be shown using dots

```js
const input = {
  name: 'foo',
  other: {
    info: {
      age: '42'
    }
  }
}
const output = {
  name: {
    first: 'foo'
  },
  age: 42
}
const t = change(input, output)
console.log(t.toString())
/*
name.first: R.identity(name)
age: _.parseInt(other.info.age)
*/
```

## Related

This is much simpler problem that general value to value mapping like I
am trying to do in [Rambo](https://github.com/bahmutov/rambo)

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/change-by-example/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/change-by-example.svg?downloads=true
[npm-url]: https://npmjs.org/package/change-by-example
[ci-image]: https://travis-ci.org/bahmutov/change-by-example.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/change-by-example
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
[nut-badge]: https://img.shields.io/badge/next--update--travis-%E2%9C%94%EF%B8%8F-green.svg
[nut-readme]: https://github.com/bahmutov/next-update-travis#readme

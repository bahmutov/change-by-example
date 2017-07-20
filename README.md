# change-by-example

> Finds a function that transforms a given object into another given object.

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

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
it like you wanted!

```js
console.log(f({
  name: 'mary',
  age: '30',
  occupation: 'engineer'
}))
// {name: 'Mary', age: 30}
```

## Supported

* [x] property delete
* [x] property rename
* [x] simple string transforms from [Ramda](http://ramdajs.com/docs/)
  and [Lodash](https://lodash.com/docs/)
* [ ] deep paths
* [ ] compound transforms like `trim + toLower`
* [ ] combining values like `.fullName = .first` + `.last`

## Debugging

Run with environment variable `DEBUG=change-by-example ...`

## Related

This is much simpler problem that general value to value mapping like I
am trying to do in [Rambo](bahmutov/rambo)

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

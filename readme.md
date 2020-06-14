# tsv-json [![Build Status](https://travis-ci.com/papb/tsv-json.svg?branch=master)](https://travis-ci.com/papb/tsv-json)

> Convert between TSV and JSON (`string[][]`)


## Highlights

* Zero dependencies
* Simple and to the point
* Written in TypeScript


## Install

```
$ npm install tsv-json
```


## Usage

```js
const { tsv2json, json2tsv } = require('tsv-json');

console.log(json2tsv([
	['foo', 'bar'],
	['baz', 'qux']
]));
//=> 'foo\tbar\nbaz\tqux'

console.log(tsv2json('foo\tbar\nbaz\tqux'));
//=> [['foo', 'bar'], ['baz', 'qux']]
```

Handles tabs, newlines and double-quotes correctly.

Asserts the input is of the expected type (`string[][]` for `json2tsv`, `string` for `tsv2json`).

## License

MIT © [Pedro Augusto de Paula Barbosa](https://github.com/papb)

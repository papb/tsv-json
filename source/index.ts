import { json2tsv } from './json2tsv';
export { json2tsv } from './json2tsv';

import { tsv2json } from './tsv2json';
export { tsv2json } from './tsv2json';

// eslint-disable-next-line import/no-anonymous-default-export
export default { json2tsv, tsv2json };

// For CommonJS default export support
module.exports = { json2tsv, tsv2json };
module.exports.default = { json2tsv, tsv2json };

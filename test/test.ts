import test from 'ava';
import { json2tsv, tsv2json } from '../source';

const json = [
	['foo', 'bar'],
	['baz', 'qux']
];
const unquotedTsv = 'foo\tbar\nbaz\tqux';
const quotedTsv = '"foo"\t"bar"\n"baz"\t"qux"';

test('json2tsv', t => {
	t.is(json2tsv(json), quotedTsv);
});

test('json2tsv throws on invalid input', t => {
	t.throws(() => json2tsv('foobarbaz'));
});

test('tsv2json', t => {
	t.deepEqual(tsv2json(unquotedTsv), json);
	t.deepEqual(tsv2json(quotedTsv), json);
});

test('tsv2json throws on invalid input', t => {
	t.throws(() => tsv2json(1234));
});

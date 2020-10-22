import test from 'ava';
import { json2tsv, tsv2json } from '../source';

const json = [
	['foo', 'bar'],
	['baz', 'qux']
];
const unquotedTsv = 'foo\tbar\nbaz\tqux';
const quotedTsv = '"foo"\t"bar"\n"baz"\t"qux"';
const partiallyQuotedTsv = '"foo"\tbar\nbaz\t"qux"';

const complexJson = [['', '\t"_'], ['a'], [], ['foo\nbar', '"hey"']];
const complexFullyQuotedTsv = '""\t"\t""_"\n"a"\n\n"foo\nbar"\t"""hey"""';
const complexQuotedAsNeededTsv = '\t"\t""_"\na\n\n"foo\nbar"\t"""hey"""';

test('json2tsv', t => {
	t.is(json2tsv(json), unquotedTsv);
	t.is(json2tsv(complexJson), complexQuotedAsNeededTsv);
});

test('json2tsv throws on invalid input', t => {
	t.throws(() => json2tsv('foobarbaz'));
});

test('tsv2json', t => {
	t.deepEqual(tsv2json(unquotedTsv), json);
	t.deepEqual(tsv2json(quotedTsv), json);
	t.deepEqual(tsv2json(partiallyQuotedTsv), json);

	t.deepEqual(tsv2json('""\t""'), [['', '']]);
	t.deepEqual(tsv2json('"a"\t""'), [['a', '']]);
	t.deepEqual(tsv2json('""a\t""'), [['a', '']]);

	t.deepEqual(tsv2json('\tabc\ndef\tghi'), [['', 'abc'], ['def', 'ghi']]);
	t.deepEqual(tsv2json('\tabc\ndef'), [['', 'abc'], ['def']]);
	t.deepEqual(tsv2json('abc\n\tdef\nghi\t\tjkl\t"\tmno"'), [['abc'], ['', 'def'], ['ghi', '', 'jkl', '\tmno']]);

	t.deepEqual(tsv2json('""hey""'), [['hey""']]);
	t.deepEqual(tsv2json('"""hey"""'), [['"hey"']]);
	t.deepEqual(tsv2json('"aa\tbb'), [['aa\tbb']]);
	t.deepEqual(tsv2json('"aa\nbb'), [['aa\nbb']]);
	t.deepEqual(tsv2json('"aa\nbb"cc'), [['aa\nbbcc']]);

	const complexJsonWithPreparedEmptyRow = complexJson.map(x => x.length === 0 ? [''] : x);
	t.deepEqual(tsv2json(complexFullyQuotedTsv), complexJsonWithPreparedEmptyRow);
	t.deepEqual(tsv2json(complexQuotedAsNeededTsv), complexJsonWithPreparedEmptyRow);
});

test('tsv2json throws on invalid input', t => {
	// @ts-expect-error
	t.throws(() => tsv2json(1234));
});

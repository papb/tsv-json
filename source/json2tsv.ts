function assertString2DArray(arg: any): asserts arg is string[][] {
	if (!Array.isArray(arg)) {
		throw new TypeError(`Expected string[][], got ${typeof arg}`);
	}

	for (const x of arg) {
		if (!Array.isArray(x)) {
			throw new TypeError(`Expected string[][], got ${typeof x}[]`);
		}

		for (const y of x) {
			if (typeof y !== 'string') {
				throw new TypeError(`Expected string[][], got ${typeof y}[][]`);
			}
		}
	}
}

export function json2tsv(json: any): string {
	assertString2DArray(json);

	return json.map(row => {
		return row.map(cell => {
			return `"${cell.replace(/\t/g, ' '.repeat(4)).replace(/"/g, '""')}"`;
		}).join('\t');
	}).join('\n');
}

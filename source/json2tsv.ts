function assertString2DArray(arg: unknown): asserts arg is string[][] {
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

const SPECIAL_CHAR_REGEX = /[\t\n"]/;

function hasSpecialChar(string: string): boolean {
	return SPECIAL_CHAR_REGEX.test(string);
}

export function json2tsv(json: unknown): string {
	assertString2DArray(json);

	return json.map(row => {
		return row.map(cell => {
			return hasSpecialChar(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
		}).join('\t');
	}).join('\n');
}

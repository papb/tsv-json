function getInexistentSubstring(str: string): string {
	const chunk = '§¬¢£#';
	let result = `!${chunk}!`;

	while (str.includes(result)) {
		result = `${result}${chunk}!`;
	}

	return result;
}

export function tsv2json(tsv: any): string[][] {
	if (typeof tsv !== 'string') {
		throw new TypeError(`Expected string, got ${typeof tsv}`);
	}

	tsv = tsv.trim().replace(/\r\n/g, '\n');
	const DOUBLE_COMMA_REPLACEMENT = getInexistentSubstring(tsv);
	tsv = tsv.replace(/""/g, DOUBLE_COMMA_REPLACEMENT);

	const reg = /\n|"|\t|[^\n\t"]+/g;

	const result = [];
	let currentlyBuildingString = '';
	let currentlyBuildingRow = [];
	let isInsideQuotes = false;

	function commitCell() {
		const str = currentlyBuildingString.replace(new RegExp(DOUBLE_COMMA_REPLACEMENT, 'g'), '"');
		currentlyBuildingRow.push(str);
		currentlyBuildingString = '';
	}

	function commitRow() {
		commitCell();
		result.push(currentlyBuildingRow);
		currentlyBuildingRow = [];
	}

	let execResult: RegExpExecArray;
	// eslint-disable-next-line no-cond-assign
	while (execResult = reg.exec(tsv)) {
		if (execResult[0] === '"') {
			isInsideQuotes = !isInsideQuotes;
		} else if (isInsideQuotes) {
			currentlyBuildingString += execResult[0];
		} else if (execResult[0] === '\t') {
			commitCell();
		} else if (execResult[0] === '\n') {
			commitRow();
		} else {
			currentlyBuildingString += execResult[0];
		}
	}

	commitRow();

	return result;
}

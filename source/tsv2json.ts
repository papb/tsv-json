type NonemptyArray<T> = [T, ...T[]];
type CellExtractionResult = { cell: string; lineIsOver: boolean };

/**
 * Modifies the given array, removing the extracted prefix.
 *
 * Assumes the array is nonempty.
 *
 * Here's how it works:
 * If a cell does not start with ", it is a 'raw' cell and everything is read verbatim until a \t or \n is found, which ends the cell.
 * If a cell starts with ", it starts in 'escaped' mode, ignoring this first ". In escaped mode, \t and \n are treated as normal characters. Once another " is found, unless it is not a "", the escaped mode is over (but the cell isn't necessarily over yet - it will be over on the next \t or \n).
 * If the full tsv data finishes with a cell in escaped mode, then that cell is over.
 */
function extractFirstCell(tsvCharacters: NonemptyArray<string>): CellExtractionResult {
	const result: string[] = [];

	let escapedMode = tsvCharacters[0] === '"';
	let index = escapedMode ? 1 : 0;

	function done(lineIsOver: boolean) {
		tsvCharacters.splice(0, index + 1);
		return { cell: result.join(''), lineIsOver };
	}

	while (index < tsvCharacters.length) {
		const char = tsvCharacters[index];

		if (escapedMode) {
			if (char === '"') {
				if (tsvCharacters[index + 1] === '"') {
					result.push('"');
					index++;
				} else {
					escapedMode = false;
				}
			} else {
				result.push(char);
			}
		} else {
			if (char === '\n') return done(true);
			if (char === '\t') return done(false);
			result.push(char);
		}

		index++;
	}

	return done(true);
}

export function tsv2json(tsv: string): string[][] {
	if (typeof tsv !== 'string') throw new TypeError(`Expected string, got ${typeof tsv}`);
	if (tsv === '') return [[]];

	const characters = [...tsv]; // Account for surrogate pairs

	const result: string[][] = [];
	let currentRow: string[] = [];

	while (characters.length > 0) {
		const { cell, lineIsOver } = extractFirstCell(characters as NonemptyArray<string>);
		currentRow.push(cell);
		if (lineIsOver) {
			result.push(currentRow);
			currentRow = [];
		}
	}

	return result;
}

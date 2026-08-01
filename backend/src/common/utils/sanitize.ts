import * as sanitizeHtml from 'sanitize-html';

export function sanitize(value: string): string {
	return sanitizeHtml(value);
}

export function sanitizeOptional(
	value?: string
): string | undefined {

	return value
		? sanitizeHtml(value)
		: undefined;

}
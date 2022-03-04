/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { Document as Parse5Document, Element, ParentNode, parse, TextNode } from 'parse5';
import adapter from 'parse5/lib/tree-adapters/default';
import parseStyle from 'style-parser';

declare global {
	// eslint-disable-next-line no-var, vars-on-top
	var INTERWEAVE_SSR_POLYFILL: (() => Document | undefined) | undefined;
}

function patchTextNodeInChildren(parentNode: ParentNode) {
	parentNode.childNodes.forEach((node) => {
		if (node.nodeName === '#text' && !(node as unknown as HTMLElement).textContent) {
			Object.defineProperties(node, {
				nodeType: { value: 3 },
				textContent: {
					value: (node as TextNode).value,
					writable: true,
				},
				value: {
					get() {
						return (this as HTMLElement).textContent;
					},
					set(value) {
						(this as HTMLElement).textContent = value;
					},
				},
			});
		}
	});
}

function createStyleDeclaration(decls: string) {
	const object = parseStyle(decls);
	const style = Object.keys(object);

	Object.assign(style, object);

	return style;
}

const treeAdapter: typeof adapter = {
	...adapter,
	createCommentNode(data) {
		return {
			...adapter.createCommentNode(data),
			nodeType: 8,
		};
	},
	createElement(tagName, namespace, attrs) {
		let attributes = [...attrs];

		const element = {
			...adapter.createElement(tagName, namespace, attrs),
			attributes,
			getAttribute(name: string): string | null {
				const result = attributes.find((attr) => attr.name === name);

				return result ? result.value : null;
			},
			hasAttribute(name: string): boolean {
				return attributes.some((attr) => attr.name === name);
			},
			nodeType: 1,
			protocol: '',
			removeAttribute(name: string) {
				attributes = attributes.filter((attr) => attr.name !== name);
			},
			setAttribute(name: string, value: string) {
				const result = attributes.find((attr) => attr.name === name);

				if (result) {
					result.value = value;
				} else {
					attributes.push({ name, value });
				}
			},
			style: [] as string[],
			tagName,
			textContent: '',
		};

		const style = element.getAttribute('style');

		if (style) {
			element.style = createStyleDeclaration(style);
		}

		if (element.nodeName === 'a') {
			element.protocol = ':';
		}

		return element;
	},
	insertText(parentNode, text) {
		adapter.insertText(parentNode, text);
		patchTextNodeInChildren(parentNode);
	},
	insertTextBefore(parentNode, text, referenceNode) {
		adapter.insertTextBefore(parentNode, text, referenceNode);
		patchTextNodeInChildren(parentNode);
	},
};

function parseHTML(markup: string): Parse5Document {
	return parse(markup, { treeAdapter });
}

function createHTMLDocument(): Document {
	const doc = parseHTML('<!DOCTYPE html><html><head></head><body></body></html>');
	const html = doc.childNodes[1];
	const body = (html as Element).childNodes[1];

	Object.defineProperty(html, 'body', { value: body });

	Object.defineProperty(body, 'innerHTML', {
		set(value) {
			// #document -> html -> body -> tag
			// @ts-expect-error Allow types
			this.childNodes = parseHTML(String(value)).childNodes[0]?.childNodes[1]?.childNodes;
		},
	});

	return html as unknown as Document;
}

export function polyfill() {
	global.INTERWEAVE_SSR_POLYFILL = createHTMLDocument;
}

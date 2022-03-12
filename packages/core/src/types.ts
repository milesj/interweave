import React from 'react';

declare global {
	// eslint-disable-next-line no-var, vars-on-top
	var INTERWEAVE_SSR_POLYFILL: (() => Document | undefined) | undefined;
}

export interface CommonInternals<Props, Options = {}> {
	onAfterParse?: OnAfterParse<Props>;
	onBeforeParse?: OnBeforeParse<Props>;
	options: Partial<Options>;
}

export type TagName = keyof React.ReactHTML | 'rb' | 'rtc';

export type WildTagName = TagName | '*';

export interface TagConfig {
	// Only children
	children: TagName[];
	// Children content type
	content: number;
	// Invalid children
	invalid: TagName[];
	// Only parent
	parent: TagName[];
	// Can render self as a child
	self: boolean;
	// HTML tag name
	tagName: TagName | null;
	// Self content type
	type: number;
	// Self-closing tag
	void: boolean;
}

export type TagConfigMap = Record<string, Partial<TagConfig>>;

export type AttributeValue = boolean | number | object | string;

export type Attributes = Record<string, AttributeValue>;

export type Node = NonNullable<React.ReactNode>;

export type OnAfterParse<Props> = (content: Node, props: Props) => Node;

export type OnBeforeParse<Props> = (content: string, props: Props) => string;

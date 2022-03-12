import { CommonInternals, Node, OnAfterParse, OnBeforeParse, TagName, WildTagName } from './types';

export type InferElement<K> = K extends '*'
	? HTMLElement
	: K extends keyof HTMLElementTagNameMap
	? HTMLElementTagNameMap[K]
	: HTMLElement;

export type TransformerFactory<Element> = <Props extends object>(
	element: Element,
	props: Props,
	children: Node[],
) => Element | React.ReactElement | null | undefined | void;

export interface TransformerOptions {
	tagName?: TagName;
	onAfterParse?: OnAfterParse;
	onBeforeParse?: OnBeforeParse;
}

export interface Transformer<Element> extends CommonInternals {
	extend: (
		factory?: TransformerFactory<Element> | null,
		options?: Partial<TransformerOptions>,
	) => Transformer<Element>;
	factory: TransformerFactory<Element>;
	tagName: WildTagName;
}

export function createTransformer<K extends WildTagName>(
	tagName: K,
	options: TransformerOptions,
	factory: TransformerFactory<InferElement<K>>,
): Transformer<InferElement<K>> {
	return {
		extend(customFactory, customOptions) {
			return createTransformer(
				tagName,
				{
					...options,
					...customOptions,
				},
				customFactory ?? factory,
			);
		},
		factory,
		onAfterParse: options.onAfterParse,
		onBeforeParse: options.onBeforeParse,
		tagName: options.tagName ?? tagName,
	};
}

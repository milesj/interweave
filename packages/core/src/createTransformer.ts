import {
	CommonInternals,
	Node,
	OnAfterParse,
	OnBeforeParse,
	PassthroughProps,
	TagName,
	WildTagName,
} from './types';

export type InferElement<K> = K extends '*'
	? HTMLElement
	: K extends keyof HTMLElementTagNameMap
	? HTMLElementTagNameMap[K]
	: HTMLElement;

export type TransformerFactory<Element, Props extends object> = (
	element: Element,
	props: Props,
	children: Node[],
) => Element | React.ReactElement | null | undefined | void;

export interface TransformerOptions<Props extends object> {
	tagName?: TagName;
	onAfterParse?: OnAfterParse<Props>;
	onBeforeParse?: OnBeforeParse<Props>;
}

export interface Transformer<Element, Props extends object> extends CommonInternals<Props> {
	extend: (
		factory?: TransformerFactory<Element, Props> | null,
		options?: Partial<TransformerOptions<Props>>,
	) => Transformer<Element, Props>;
	factory: TransformerFactory<Element, Props>;
	tagName: WildTagName;
}

export function createTransformer<K extends WildTagName, Props extends object = PassthroughProps>(
	tagName: K,
	options: TransformerOptions<Props>,
	factory: TransformerFactory<InferElement<K>, Props>,
): Transformer<InferElement<K>, Props> {
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

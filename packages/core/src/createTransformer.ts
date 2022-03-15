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

export interface TransformerOptions<Props extends object, Config extends object>
	extends CommonInternals<Props, Config> {
	tagName?: TagName;
}

export interface Transformer<Element, Props extends object, Config extends object>
	extends CommonInternals<Props, Config> {
	extend: (
		config?: Partial<Config>,
		factory?: TransformerFactory<Element, Props>,
	) => Transformer<Element, Props, Config>;
	factory: TransformerFactory<Element, Props>;
	tagName: WildTagName;
}

export function createTransformer<
	K extends WildTagName,
	Props extends object = PassthroughProps,
	Config extends object = {},
>(
	tagName: K,
	factory: TransformerFactory<InferElement<K>, Props>,
	options: TransformerOptions<Props, Config> = {},
): Transformer<InferElement<K>, Props, Config> {
	return {
		config: options.config,
		extend(customConfig, customFactory) {
			return createTransformer<K, Props, Config>(tagName, customFactory ?? factory, {
				...options,
				config: {
					...(options.config as Config),
					...customConfig,
				},
			});
		},
		factory,
		onAfterParse: options.onAfterParse,
		onBeforeParse: options.onBeforeParse,
		tagName: options.tagName ?? tagName,
	};
}

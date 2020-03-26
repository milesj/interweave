import {
  WildTagName,
  InferElement,
  Transformer,
  TransformerFactory,
  TransformerOptions,
} from './types';

export default function createTransformer<K extends WildTagName, Props = {}, Options = {}>(
  tagName: K,
  factory: TransformerFactory<InferElement<K>, Props>,
  options: TransformerOptions<Props, Options> = {},
): Transformer<InferElement<K>, Props, Options> {
  return {
    extend(customFactory, customOptions) {
      return createTransformer(tagName, customFactory || factory, {
        ...options,
        ...customOptions,
      });
    },
    factory,
    onAfterParse: options.onAfterParse,
    onBeforeParse: options.onBeforeParse,
    options: options.options || {},
    tagName: options.tagName || tagName,
  };
}

import { WildTagName, InferElement, Transformer, TransformerFactory } from './types';

export default function createTransformer<
  K extends WildTagName,
  Element = InferElement<K>,
  Props = {}
>(tagName: K, factory: TransformerFactory<Element, Props>): Transformer<Element, Props> {
  return {
    factory,
    tagName,
  };
}

import { ElementName, InferElement, Transformer, TransformerFactory } from './types';

export default function createTransformer<
  K extends ElementName,
  Element = InferElement<K>,
  Props = {}
>(tagName: K, factory: TransformerFactory<Element, Props>): Transformer<Element, Props> {
  return {
    factory,
    tagName,
  };
}

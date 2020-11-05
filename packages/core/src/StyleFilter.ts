import Filter from './Filter';
import { ElementAttributes } from './types';

const INVALID_STYLES = /(url|image|image-set)\(/i;

export default class StyleFilter extends Filter {
  attribute<K extends keyof ElementAttributes>(
    name: K,
    value: ElementAttributes[K],
  ): ElementAttributes[K] {
    if (name === 'style') {
      Object.keys(value).forEach((key) => {
        if (String(value[key]).match(INVALID_STYLES)) {
          // eslint-disable-next-line no-param-reassign
          delete value[key];
        }
      });
    }

    return value;
  }
}

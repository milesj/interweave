import Filter from './Filter';

const INVALID_STYLES = /(url|image|image-set)\(/i;

export default class StyleFilter extends Filter {
  attribute(name: string, value: unknown): unknown {
    if (name === 'style' && typeof value === 'object' && value) {
      const styles = value as CSSStyleDeclaration;

      Object.keys(styles).forEach(key => {
        const prop = key as keyof CSSStyleDeclaration;

        if (String(styles[prop]).match(INVALID_STYLES)) {
          // eslint-disable-next-line no-param-reassign
          delete styles[prop];
        }
      });
    }

    return value;
  }
}

import Filter from './Filter';

const INVALID_STYLES = /(url|image|image-set)\(/i;

export default class StyleFilter extends Filter {
  attribute(name: string, value: any): any {
    if (name === 'style') {
      Object.keys(value).forEach(key => {
        if (String(value[key]).match(INVALID_STYLES)) {
          // eslint-disable-next-line no-param-reassign
          delete value[key];
        }
      });
    }

    return value;
  }
}

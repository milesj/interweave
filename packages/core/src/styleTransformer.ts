import createTransformer from './createTransformer';

const INVALID_STYLES = /(url|image|image-set)\(/i;

export default createTransformer('*', element => {
  Object.keys(element.style).forEach(k => {
    const key = k as keyof typeof element.style;

    if (String(element.style[key]).match(INVALID_STYLES)) {
      // eslint-disable-next-line no-param-reassign
      delete element.style[key];
    }
  });
});

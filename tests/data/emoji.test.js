import { UNICODE_TO_SHORTNAME, SHORTNAME_TO_UNICODE } from '../../src/data/emoji';
import { VALID_EMOJIS } from '../mocks';

describe('data/emoji', () => {
  VALID_EMOJIS.forEach(([hexcode, unicode, shortname]) => {
    it(`maps unicode to shortname: ${shortname}`, () => {
      expect(UNICODE_TO_SHORTNAME[unicode]).toBe(shortname);
    });

    it(`maps shortname to unicode: ${shortname}`, () => {
      expect(SHORTNAME_TO_UNICODE[shortname]).toBe(unicode);
    });
  });
});

import { expect } from 'chai';
// import Parser from '../../lib/Parser';
import EmailMatcher from '../../lib/matchers/Email';
// import { EMAIL_PATTERN } from '../../lib/constants';
// import { TOKEN_LOCATIONS } from '../mocks';

const VALID_EMAILS = [
  'user@domain.com',
  'user.name@domain.com',
  'user+name@domain.com',
  'user123@domain.com',
  'user.name123@domain.com',
  'user+name123@domain.com',
  'user@sub.domain.com',
  'user@domain.superlongtld',
  'user@www.domain.net',
  'user@domain-name.com',
  'user@domain123.com',
  'username@sub.domain123.whattldisthis',
  'user~with$special&chars@domain.com',
  'user#with?more|chars@domain.com',
  'email@example.com',
  'firstname.lastname@example.com',
  'email@subdomain.example.com',
  'first.name+lastname@example.com',
  'an"email"here@example.com',
  '1234567890@example.com',
  'email@example-one.com',
  '_______@example.com',
  'email@example.name',
  'email@example.museum',
  'email@example.co.jp',
  'firstname-lastname@example.com',

  // These are valid emails but I do not want to support them.
  // 'email@123.123.123.123',
  // 'email@[123.123.123.123]',
  // 'much."more\ unusual"@example.com',
  // 'very.unusual."@".unusual.com@example.com',
  // 'very."(),:;<>[]".VERY."very@\\\\\\ \"very".unusual@strange.example.com',
];

const INVALID_EMAILS = [
  'plainaddress',
  '#@%^%#$@#$@#.com',
  '@example.com',
  'email.example.com',
  'email@example@example.com',
  '.email@example.com',
  'email.@example.com',
  'email..email@example.com',
  'あいうえお@example.com',
  'email@example.com (Joe Smith)',
  'email@example',
  'email@-example.com',
  'email@example.web',
  'email@111.222.333.44444',
  'email@example..com',
  'Abc..123@example.com',
  '"(),:;<>[]@example.com',
  'this is"really"not\\\\allowed@example.com',
];

describe('matchers/Email', () => {
  const matcher = new EmailMatcher('email');
  // const pattern = new RegExp(EMAIL_PATTERN);

  /*
  describe('does match valid email:', () => {
    VALID_EMAILS.forEach((email) => {
      it(email, () => {
        const parts = email.split('@');
        const expected = [
          email,
          parts[0],
          parts[1],
        ];
        expected.index = 0;
        expected.input = email;

        expect(email.match(pattern)).to.deep.equal(expected);
      });
    });
  });

  describe('doesnt match invalid email:', () => {
    INVALID_EMAILS.forEach((email) => {
      it(email, () => {
        expect(email.match(pattern)).to.equal(null);
      });
    });
  });

  describe('matches all emails in a string', () => {
    const create = email => matcher.factory(email);
    const parser = new Parser('', {}, [matcher]);

    VALID_EMAILS.forEach((email) => {
      const expected = [
        'no tokens',
        [create(email)],
        [' ', create(email), ' '],
        [create(email), ' pattern at beginning'],
        ['pattern at end ', create(email)],
        ['pattern in ', create(email), ' middle'],
        [create(email), ' pattern at beginning and end ', create(email)],
        [create(email), ' pattern on ', create(email), ' all sides ', create(email)],
        ['pattern ', create(email), ' used ', create(email), ' multiple ', create(email), ' times'],
        ['tokens next ', create(email), ' ', create(email), ' ', create(email), ' to each other'],
        ['tokens without ', create(email), create(email), create(email), ' spaces'],
      ];

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${email} - ${location}`, () => {
          const tokenString = location.replace(/\{token\}/g, email);
          const actual = parser.applyMatchers(tokenString);

          if (i === 0) {
            expect(actual).to.equal(expected[0]);
          } else {
            expect(actual).to.deep.equal(expected[i]);
          }
        });
      });
    });
  });
  */

  describe('match()', () => {
    it('returns null for invalid match', () => {
      expect(matcher.match(INVALID_EMAILS[0])).to.equal(null);
    });

    it('returns object for valid match', () => {
      const parts = VALID_EMAILS[0].split('@');

      expect(matcher.match(VALID_EMAILS[0])).to.deep.equal({
        match: VALID_EMAILS[0],
        username: parts[0],
        domain: parts[1],
      });
    });
  });

  describe('obfuscate()', () => {
    it('scrambles emails', () => {
      expect(matcher.obfuscate(VALID_EMAILS[0])).to.equal('&#117;&#115;&#101;&#114;&#64;&#100;&#111;&#109;&#97;&#105;&#110;&#46;&#99;&#111;&#109;');
    });
  });
});

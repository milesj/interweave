import { Parser } from 'interweave';
import { TOKEN_LOCATIONS, createExpectedToken, parentConfig } from 'interweave/lib/testing';
import EmailMatcher from '../src/EmailMatcher';
import { EMAIL_PATTERN } from '../src/constants';

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
  'USER@DOMAIN123.com',
  'username@sub.domain123.whattldisthis',
  'user~with$special&chars@domain.com',
  'user#with?more|chars@domain.com',
  'email@example.com',
  'firstname.lastname@example.com',
  'email@subdomain.example.com',
  'email@sub-domain.example.com',
  'first.name+lastname@example.com',
  '1234567890@example.com',
  'email@example-one.com',
  'email@example.name',
  'email@example.museum',
  'email@example.co.jp',
  'firstname-lastname@example.com',
  'multi.ple.dots.in.name@example.com',
  'multiple.dots+plus@example.com',
  'start.z@example.com',
  'a.end@domain.com',
];

// Some of these are valid emails but I do not want to support them.
const INVALID_EMAILS = [
  'plainaddress',
  '#@%^%#$@#$@#.com',
  '@example.com',
  'email.example.com',
  'email@example@example.com',
  '.email@example.com',
  'email.@example.com',
  // 'email..email@example.com',
  'あいうえお@example.com',
  'email@example.com (Joe Smith)',
  'email@example',
  'email@-example.com',
  'email@111.222.333.44444',
  'email@example..com',
  // 'Abc..123@example.com',
  '"(),:;<>[]@example.com',
  'this is"really"not\\\\allowed@example.com',
  'an"email"here@example.com',
  '_______@example.com',
  'much."more unusual"@example.com',
  'very.unusual."@".unusual.com@example.com',
  'very."(),:;<>[]".VERY."very@\\\\\\ "very".unusual@strange.example.com',
];

describe('matchers/EmailMatcher', () => {
  const matcher = new EmailMatcher('email');
  const pattern = new RegExp(`^${EMAIL_PATTERN.source}$`, 'i');

  describe('does match valid email:', () => {
    VALID_EMAILS.forEach((email) => {
      it(`${email}`, () => {
        const parts = email.split('@');
        const expected: RegExpMatchArray = [email, parts[0], parts[1]];
        expected.index = 0;
        expected.input = email;

        expect(email.match(pattern)).toEqual(expected);
      });
    });
  });

  describe('doesnt match invalid email:', () => {
    INVALID_EMAILS.forEach((email) => {
      it(`${email}`, () => {
        expect(email.match(pattern)).toBeNull();
      });
    });
  });

  describe('matches all emails in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const createEmail = (email: string, key: number) => {
      const parts = email.split('@');

      return matcher.replaceWith(email, {
        children: email,
        email,
        emailParts: {
          username: parts[0],
          host: parts[1],
        },
        key,
      });
    };

    VALID_EMAILS.forEach((email) => {
      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${email} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/{token}/g, email);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).toBe(createExpectedToken(email, createEmail, 0));
          } else {
            expect(actual).toEqual(createExpectedToken(email, createEmail, i));
          }
        });
      });
    });
  });

  describe('match()', () => {
    it('returns null for invalid match', () => {
      expect(matcher.match('notanemail')).toBeNull();
    });

    it('returns object for valid match', () => {
      expect(matcher.match('user@domain.com')).toEqual({
        index: 0,
        length: 15,
        match: 'user@domain.com',
        email: 'user@domain.com',
        emailParts: {
          username: 'user',
          host: 'domain.com',
        },
        valid: true,
        void: false,
      });
    });
  });
});

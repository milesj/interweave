import { expect } from 'chai';
import formatName from '../../lib/matchers/Email';

describe('matchers/Email', () => {
  const EMAIL_TYPES = [
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
  ];
});

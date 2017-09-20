import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { shallow } from 'enzyme';
import Interweave from '../../interweave/src/Interweave';
import Element from '../../interweave/src/Element';
import Email from '../src/Email';
import Hashtag from '../src/Hashtag';
import Url from '../src/Url';
import EmailMatcher from '../src/EmailMatcher';
import HashtagMatcher from '../src/HashtagMatcher';
import UrlMatcher from '../src/UrlMatcher';
import IpMatcher from '../src/IpMatcher';
import { EXTRA_PROPS } from '../../../tests/mocks';

describe('Interweave (with autolinking)', () => {
  const urlParts = {
    scheme: 'http',
    auth: '',
    host: '',
    port: '',
    path: '',
    query: '',
    fragment: '',
  };

  it('renders large blocks of text with all matchers', () => {
    const wrapper = shallow((
      <Interweave
        tagName="div"
        matchers={[
          new EmailMatcher('email'),
          new HashtagMatcher('hashtag'),
          new IpMatcher('ip'),
          new UrlMatcher('url'),
        ]}
        content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. email@domain.com. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. #interweave Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, www.domain.com.

Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. https://127.0.0.1/foo Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (http://domain.com/some/path?with=query). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.

#blessed #interweave #milesj`}
      />
    )).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. ',
      <Email key="0" {...EXTRA_PROPS} emailParts={{ username: 'email', host: 'domain.com' }}>email@domain.com</Email>,
      '. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. ',
      <Hashtag key="1" {...EXTRA_PROPS} hashtagName="interweave">#interweave</Hashtag>,
      ' Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, ',
      <Url key="2" {...EXTRA_PROPS} urlParts={{ ...urlParts, host: 'www.domain.com' }}>www.domain.com</Url>,
      '.',
      <Element key="3" tagName="br" selfClose>{[]}</Element>,
      <Element key="4" tagName="br" selfClose>{[]}</Element>,
      'Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. ',
      <Url key="5" {...EXTRA_PROPS} urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
      ' Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (',
      <Url key="6" {...EXTRA_PROPS} urlParts={{ ...urlParts, host: 'domain.com', path: '/some/path', query: '?with=query' }}>http://domain.com/some/path?with=query</Url>,
      '). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.',
      <Element key="7" tagName="br" selfClose>{[]}</Element>,
      <Element key="8" tagName="br" selfClose>{[]}</Element>,
      <Hashtag key="9" {...EXTRA_PROPS} hashtagName="blessed">#blessed</Hashtag>,
      ' ',
      <Hashtag key="10" {...EXTRA_PROPS} hashtagName="interweave">#interweave</Hashtag>,
      ' ',
      <Hashtag key="11" {...EXTRA_PROPS} hashtagName="milesj">#milesj</Hashtag>,
    ]);
  });

  it('renders HTML text with all matchers', () => {
    const wrapper = shallow((
      <Interweave
        tagName="div"
        matchers={[
          new EmailMatcher('email'),
          new HashtagMatcher('hashtag'),
          new IpMatcher('ip'),
          new UrlMatcher('url'),
        ]}
        content={`<h1>Lorem ipsum dolor sit amet</h1>

<p><b>Consectetur adipiscing elit.</b> Donec massa lorem, mollis non commodo quis, ultricies at elit. email@domain.com. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. #interweave Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, <a href="www.domain.com">www.domain.com</a>.</p>

<div>Curabitur lectus odio, <em>tempus quis velit vitae, cursus sagittis nulla</em>. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. https://127.0.0.1/foo Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (http://domain.com/some/path?with=query). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.</div>

<section>#blessed #interweave #milesj</section>`}
      />
    )).shallow();

    expect(wrapper.prop('children')).toEqual([
      <Element key="0" tagName="h1">{['Lorem ipsum dolor sit amet']}</Element>,
      '\n\n',
      <Element key="1" tagName="p">
        {[
          <Element key="2" tagName="b">{['Consectetur adipiscing elit.']}</Element>,
          ' Donec massa lorem, mollis non commodo quis, ultricies at elit. ',
          <Email key="3" {...EXTRA_PROPS} emailParts={{ username: 'email', host: 'domain.com' }}>email@domain.com</Email>,
          '. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. ',
          <Hashtag key="4" {...EXTRA_PROPS} hashtagName="interweave">#interweave</Hashtag>,
          ' Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, ',
          <Element key="5" tagName="a" attributes={{ href: 'www.domain.com' }}>{['www.domain.com']}</Element>,
          '.',
        ]}
      </Element>,
      '\n\n',
      <Element key="6" tagName="div">
        {[
          'Curabitur lectus odio, ',
          <Element key="7" tagName="em">{['tempus quis velit vitae, cursus sagittis nulla']}</Element>,
          '. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. ',
          <Url key="8" {...EXTRA_PROPS} urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
          ' Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (',
          <Url key="9" {...EXTRA_PROPS} urlParts={{ ...urlParts, host: 'domain.com', path: '/some/path', query: '?with=query' }}>http://domain.com/some/path?with=query</Url>,
          '). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.',
        ]}
      </Element>,
      '\n\n',
      <Element key="10" tagName="section">
        {[
          <Hashtag key="11" {...EXTRA_PROPS} hashtagName="blessed">#blessed</Hashtag>,
          ' ',
          <Hashtag key="12" {...EXTRA_PROPS} hashtagName="interweave">#interweave</Hashtag>,
          ' ',
          <Hashtag key="13" {...EXTRA_PROPS} hashtagName="milesj">#milesj</Hashtag>,
        ]}
      </Element>,
    ]);
  });

  it('doesnt render anchor links within anchor links', () => {
    const wrapper = shallow((
      <Interweave
        tagName="div"
        matchers={[
          new EmailMatcher('email'),
          new HashtagMatcher('hashtag'),
          new IpMatcher('ip'),
          new UrlMatcher('url'),
        ]}
        content={`- https://127.0.0.1/foo
- <a href="www.domain.com">www.domain.com</a>
- (http://domain.com/some/path?with=query)
- <a href="http://domain.com">This text should stay</a>`}
      />
    )).shallow();

    expect(wrapper.prop('children')).toEqual([
      '- ',
      <Url key="0" {...EXTRA_PROPS} urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
      '\n- ',
      <Element key="1" tagName="a" attributes={{ href: 'www.domain.com' }}>{['www.domain.com']}</Element>,
      '\n- (',
      <Url key="2" {...EXTRA_PROPS} urlParts={{ ...urlParts, host: 'domain.com', path: '/some/path', query: '?with=query' }}>http://domain.com/some/path?with=query</Url>,
      ')\n- ',
      <Element key="3" tagName="a" attributes={{ href: 'http://domain.com' }}>{['This text should stay']}</Element>,
    ]);
  });

  describe('server side rendering', () => {
    it('supports complex content', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave
          tagName="div"
          matchers={[
            new EmailMatcher('email'),
            new HashtagMatcher('hashtag'),
            new IpMatcher('ip'),
            new UrlMatcher('url'),
          ]}
          content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. email@domain.com. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. #interweave Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, www.domain.com.

Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. https://127.0.0.1/foo Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (http://domain.com/some/path?with=query). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.

#blessed #interweave #milesj`}
        />,
      );

      expect(actual).toBe('<div class="interweave">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. <a href="mailto:email@domain.com" class="interweave__link" rel="noopener noreferrer">email@domain.com</a>. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. <a href="interweave" class="interweave__link" rel="noopener noreferrer">#interweave</a> Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, <a href="http://www.domain.com" class="interweave__link" rel="noopener noreferrer">www.domain.com</a>.<br/><br/>Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. <a href="https://127.0.0.1/foo" class="interweave__link" rel="noopener noreferrer">https://127.0.0.1/foo</a> Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (<a href="http://domain.com/some/path?with=query" class="interweave__link" rel="noopener noreferrer">http://domain.com/some/path?with=query</a>). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.<br/><br/><a href="blessed" class="interweave__link" rel="noopener noreferrer">#blessed</a> <a href="interweave" class="interweave__link" rel="noopener noreferrer">#interweave</a> <a href="milesj" class="interweave__link" rel="noopener noreferrer">#milesj</a></div>');
    });
  });
});

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { render } from 'rut';
import Interweave, { InterweaveProps } from 'interweave';
import EmailMatcher from '../src/EmailMatcher';
import HashtagMatcher from '../src/HashtagMatcher';
import UrlMatcher from '../src/UrlMatcher';
import IpMatcher from '../src/IpMatcher';

describe('Interweave (with autolinking)', () => {
  it('renders large blocks of text with all matchers', () => {
    const result = render<InterweaveProps>(
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

    expect(result).toMatchSnapshot();
  });

  it('renders HTML text with all matchers', () => {
    const result = render<InterweaveProps>(
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
      />,
    );

    expect(result).toMatchSnapshot();
  });

  it('doesnt render anchor links within anchor links', () => {
    const result = render<InterweaveProps>(
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
      />,
    );

    expect(result).toMatchSnapshot();
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

      expect(actual).toBe(
        '<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. <a href="mailto:email@domain.com" rel="noopener noreferrer">email@domain.com</a>. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. <a href="interweave" rel="noopener noreferrer">#interweave</a> Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, <a href="http://www.domain.com" rel="noopener noreferrer">www.domain.com</a>.<br/><br/>Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. <a href="https://127.0.0.1/foo" rel="noopener noreferrer">https://127.0.0.1/foo</a> Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (<a href="http://domain.com/some/path?with=query" rel="noopener noreferrer">http://domain.com/some/path?with=query</a>). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.<br/><br/><a href="blessed" rel="noopener noreferrer">#blessed</a> <a href="interweave" rel="noopener noreferrer">#interweave</a> <a href="milesj" rel="noopener noreferrer">#milesj</a></div>',
      );
    });
  });
});

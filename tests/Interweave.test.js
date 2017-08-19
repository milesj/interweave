/* eslint-disable comma-dangle */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { shallow } from 'enzyme';
import Interweave from '../src/Interweave';
import { Element, Email, Emoji, Hashtag, Url } from '../src/components';
import { EmailMatcher, EmojiMatcher, HashtagMatcher, IpMatcher, UrlMatcher } from '../src/matchers';
import { SHORTCODE_TO_UNICODE } from '../src/data/emoji';
import { MOCK_INVALID_MARKUP, HrefFilter, CodeTagMatcher } from './mocks';

describe('Interweave', () => {
  const extraProps = {
    disableWhitelist: false,
    disableLineBreaks: false,
    noHtml: false,
    noHtmlExceptMatchers: false,
  };

  const urlParts = {
    scheme: 'http',
    auth: '',
    host: '',
    port: '',
    path: '',
    query: '',
    fragment: '',
  };

  it('sets the `noHtml` class name', () => {
    const wrapper = shallow(
      <Interweave
        noHtml
        content="Foo Bar"
      />
    );

    expect(wrapper.prop('className')).toBe('interweave--no-html');
  });

  it('sets the `noHtmlExceptMatchers` class name', () => {
    const wrapper = shallow(
      <Interweave
        noHtmlExceptMatchers
        content="Foo Bar"
      />
    );

    expect(wrapper.prop('className')).toBe('interweave--no-html');
  });

  it('can pass filters through props', () => {
    const wrapper = shallow(
      <Interweave
        filters={[new HrefFilter()]}
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element tagName="a" key="0" attributes={{ href: 'bar.net' }}>{['Bar']}</Element>,
      ' Baz',
    ]);
  });

  it('can disable all filters using `disableFilters`', () => {
    const wrapper = shallow(
      <Interweave
        filters={[new HrefFilter()]}
        disableFilters
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element tagName="a" key="0" attributes={{ href: 'foo.com' }}>{['Bar']}</Element>,
      ' Baz',
    ]);
  });

  it('can pass matchers through props', () => {
    const wrapper = shallow(
      <Interweave
        matchers={[new CodeTagMatcher('b', '1')]}
        content="Foo [b] Bar Baz"
      />
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element {...extraProps} tagName="span" key="1" customProp="foo">B</Element>,
      ' Bar Baz',
    ]);
  });

  it('can disable all matchers using `disableMatchers', () => {
    const wrapper = shallow(
      <Interweave
        matchers={[new CodeTagMatcher('b', '1')]}
        disableMatchers
        content="Foo [b] Bar Baz"
      />
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo [b] Bar Baz',
    ]);
  });

  it('allows empty `content` to be passed', () => {
    const wrapper = shallow(<Interweave content={null} />);

    expect(wrapper.prop('children')).toBe(null);
  });

  it('will render the `emptyContent` if no content exists', () => {
    const empty = <div>Foo</div>;
    const wrapper = shallow(<Interweave content="" emptyContent={empty} />);

    expect(wrapper.contains(empty)).toBe(true);
  });

  describe('parseMarkup()', () => {
    it('errors if onBeforeParse doesnt return a string', () => {
      expect(() => {
        shallow(<Interweave onBeforeParse={() => 123} content="Foo" />);
      }).toThrow('Interweave `onBeforeParse` must return a valid HTML string.');
    });

    it('errors if onAfterParse doesnt return an array', () => {
      expect(() => {
        shallow(<Interweave onAfterParse={() => 123} content="Foo" />);
      }).toThrow('Interweave `onAfterParse` must return an array of strings and React elements.');
    });

    it('can modify the markup using onBeforeParse', () => {
      const wrapper = shallow(
        <Interweave
          onBeforeParse={content => content.replace(/b>/g, 'i>')}
          content={'Foo <b>Bar</b> Baz'}
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'Foo ',
        <Element tagName="i" key="0">{['Bar']}</Element>,
        ' Baz',
      ]);
    });

    it('can modify the tree using onAfterParse', () => {
      const wrapper = shallow(
        <Interweave
          onAfterParse={(content) => {
            content.push(<Element tagName="u" key="1">Qux</Element>);

            return content;
          }}
          content={'Foo <b>Bar</b> Baz'}
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'Foo ',
        <Element tagName="b" key="0">{['Bar']}</Element>,
        ' Baz',
        <Element tagName="u" key="1">Qux</Element>,
      ]);
    });
  });

  describe('render()', () => {
    it('renders with a default tag name', () => {
      const wrapper = shallow(<Interweave content="Foo" />).shallow();

      expect(wrapper.find('span')).toHaveLength(1);
      expect(wrapper.text()).toBe('Foo');
    });

    it('renders with a custom tag name', () => {
      const wrapper = shallow(<Interweave tagName="div" content="Foo" />).shallow();

      expect(wrapper.find('div')).toHaveLength(1);
      expect(wrapper.text()).toBe('Foo');
    });

    it('parses HTML', () => {
      const wrapper = shallow(<Interweave tagName="div" content={'Foo <b>Bar</b> Baz'} />).shallow();

      expect(wrapper.find('div')).toHaveLength(1);
      expect(wrapper.find('Element').prop('tagName')).toBe('b');
      expect(wrapper.prop('children')).toEqual([
        'Foo ',
        <Element tagName="b" key="0">{['Bar']}</Element>,
        ' Baz',
      ]);
    });
  });

  describe('parsing and rendering', () => {
    it('renders large blocks of text with all matchers', () => {
      const wrapper = shallow(
        <Interweave
          tagName="div"
          matchers={[
            new EmailMatcher('email'),
            new EmojiMatcher('emoji', { convertShortcode: true }),
            new HashtagMatcher('hashtag'),
            new IpMatcher('ip'),
            new UrlMatcher('url'),
          ]}
          content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. email@domain.com. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. #interweave Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper :japanese_castle: id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, www.domain.com.

Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. https://127.0.0.1/foo Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (http://domain.com/some/path?with=query). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.

#blessed #interweave #milesj`}
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. ',
        <Email key="0" {...extraProps} emailParts={{ username: 'email', host: 'domain.com' }}>email@domain.com</Email>,
        '. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. ',
        <Hashtag key="2" {...extraProps} hashtagName="interweave">#interweave</Hashtag>,
        ' Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper ',
        <Emoji key="1" {...extraProps} shortcode=":japanese_castle:" unicode={SHORTCODE_TO_UNICODE[':japanese_castle:']} />,
        ' id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, ',
        <Url key="3" {...extraProps} urlParts={{ ...urlParts, host: 'www.domain.com' }}>www.domain.com</Url>,
        '.',
        <Element key="4" tagName="br" selfClose>{[]}</Element>,
        <Element key="5" tagName="br" selfClose>{[]}</Element>,
        'Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. ',
        <Url key="6" {...extraProps} urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
        ' Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (',
        <Url key="7" {...extraProps} urlParts={{ ...urlParts, host: 'domain.com', path: '/some/path', query: '?with=query' }}>http://domain.com/some/path?with=query</Url>,
        '). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.',
        <Element key="8" tagName="br" selfClose>{[]}</Element>,
        <Element key="9" tagName="br" selfClose>{[]}</Element>,
        <Hashtag key="10" {...extraProps} hashtagName="blessed">#blessed</Hashtag>,
        ' ',
        <Hashtag key="11" {...extraProps} hashtagName="interweave">#interweave</Hashtag>,
        ' ',
        <Hashtag key="12" {...extraProps} hashtagName="milesj">#milesj</Hashtag>,
      ]);
    });

    it('renders HTML text with all matchers', () => {
      const wrapper = shallow(
        <Interweave
          tagName="div"
          matchers={[
            new EmailMatcher('email'),
            new EmojiMatcher('emoji', { convertShortcode: true, convertUnicode: true }),
            new HashtagMatcher('hashtag'),
            new IpMatcher('ip'),
            new UrlMatcher('url'),
          ]}
          content={`<h1>Lorem ipsum dolor sit amet</h1>

<p><b>Consectetur adipiscing elit.</b> Donec massa lorem, mollis non commodo quis, ultricies at elit. email@domain.com. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. #interweave Donec eu sem non nibh condimentum luctus. \uD83D\uDC31 Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id :love_letter:, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, <a href="www.domain.com">www.domain.com</a>.</p>

<br />:woman_gesturing_ok_tone3:<br />

<div>Curabitur lectus odio, <em>tempus quis velit vitae, cursus sagittis nulla</em>. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. https://127.0.0.1/foo Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (http://domain.com/some/path?with=query). Pellentesque ac finibus mauris. Sed eu luctus diam. :not_an_emoji: Quisque porta lectus in turpis imperdiet dapibus.</div>

<section>#blessed #interweave #milesj</section> \uD83D\uDC36`}
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        <Element key="0" tagName="h1">{['Lorem ipsum dolor sit amet']}</Element>,
        '\n\n',
        <Element key="1" tagName="p">
          {[
            <Element key="2" tagName="b">{['Consectetur adipiscing elit.']}</Element>,
            ' Donec massa lorem, mollis non commodo quis, ultricies at elit. ',
            <Email key="3" {...extraProps} emailParts={{ username: 'email', host: 'domain.com' }}>email@domain.com</Email>,
            '. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. ',
            <Hashtag key="6" {...extraProps} hashtagName="interweave">#interweave</Hashtag>,
            ' Donec eu sem non nibh condimentum luctus. ',
            <Emoji key="5" {...extraProps} unicode={SHORTCODE_TO_UNICODE[':cat_face:']} />,
            ' Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id ',
            <Emoji key="4" {...extraProps} shortcode=":love_letter:" unicode={SHORTCODE_TO_UNICODE[':love_letter:']} />,
            ', viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, ',
            <Element key="7" tagName="a" attributes={{ href: 'www.domain.com' }}>{['www.domain.com']}</Element>,
            '.',
          ]}
        </Element>,
        '\n\n',
        <Element key="8" tagName="br" selfClose>{[]}</Element>,
        <Emoji key="9" {...extraProps} shortcode=":woman_gesturing_ok_tone3:" unicode={SHORTCODE_TO_UNICODE[':woman_gesturing_ok_tone3:']} />,
        <Element key="10" tagName="br" selfClose>{[]}</Element>,
        '\n\n',
        <Element key="11" tagName="div">
          {[
            'Curabitur lectus odio, ',
            <Element key="12" tagName="em">{['tempus quis velit vitae, cursus sagittis nulla']}</Element>,
            '. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. ',
            <Url key="13" {...extraProps} urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
            ' Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (',
            <Url key="14" {...extraProps} urlParts={{ ...urlParts, host: 'domain.com', path: '/some/path', query: '?with=query' }}>http://domain.com/some/path?with=query</Url>,
            '). Pellentesque ac finibus mauris. Sed eu luctus diam. :not_an_emoji: Quisque porta lectus in turpis imperdiet dapibus.',
          ]}
        </Element>,
        '\n\n',
        <Element key="15" tagName="section">
          {[
            <Hashtag key="16" {...extraProps} hashtagName="blessed">#blessed</Hashtag>,
            ' ',
            <Hashtag key="17" {...extraProps} hashtagName="interweave">#interweave</Hashtag>,
            ' ',
            <Hashtag key="18" {...extraProps} hashtagName="milesj">#milesj</Hashtag>,
          ]}
        </Element>,
        ' ',
        <Emoji key="19" {...extraProps} unicode={SHORTCODE_TO_UNICODE[':dog_face:']} />,
      ]);
    });

    it('doesnt render anchor links within anchor links', () => {
      const wrapper = shallow(
        <Interweave
          tagName="div"
          matchers={[
            new EmailMatcher('email'),
            new EmojiMatcher('emoji', { convertShortcode: true }),
            new HashtagMatcher('hashtag'),
            new IpMatcher('ip'),
            new UrlMatcher('url'),
          ]}
          content={`- https://127.0.0.1/foo
- <a href="www.domain.com">www.domain.com</a>
- (http://domain.com/some/path?with=query)
- <a href="http://domain.com">This text should stay</a>`}
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        '- ',
        <Url key="0" {...extraProps} urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
        '\n- ',
        <Element key="1" tagName="a" attributes={{ href: 'www.domain.com' }}>{['www.domain.com']}</Element>,
        '\n- (',
        <Url key="2" {...extraProps} urlParts={{ ...urlParts, host: 'domain.com', path: '/some/path', query: '?with=query' }}>http://domain.com/some/path?with=query</Url>,
        ')\n- ',
        <Element key="3" tagName="a" attributes={{ href: 'http://domain.com' }}>{['This text should stay']}</Element>,
      ]);
    });

    it('renders emoji shortcode as unicode', () => {
      const wrapper = shallow(
        <Interweave
          tagName="div"
          matchers={[
            new EmojiMatcher('emoji', { convertShortcode: true, renderUnicode: true }),
          ]}
          content="This has :cat: and :dog: shortcodes."
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'This has ',
        SHORTCODE_TO_UNICODE[':cat:'],
        ' and ',
        SHORTCODE_TO_UNICODE[':dog:'],
        ' shortcodes.',
      ]);
    });

    it('renders emoji unicode (literals) as unicode', () => {
      const wrapper = shallow(
        <Interweave
          tagName="div"
          matchers={[
            new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true }),
          ]}
          content="This has 🐈️ and 🐕️ shortcodes."
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'This has ',
        SHORTCODE_TO_UNICODE[':cat:'],
        ' and ',
        SHORTCODE_TO_UNICODE[':dog:'],
        ' shortcodes.',
      ]);
    });

    it('renders emoji unicode (escapes) as unicode', () => {
      const wrapper = shallow(
        <Interweave
          tagName="div"
          matchers={[
            new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true }),
          ]}
          content={'This has \uD83D\uDC31 and \uD83D\uDC36 shortcodes.'}
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'This has ',
        SHORTCODE_TO_UNICODE[':cat_face:'],
        ' and ',
        SHORTCODE_TO_UNICODE[':dog_face:'],
        ' shortcodes.',
      ]);
    });

    it('renders a single emoji enlarged', () => {
      const wrapper = shallow(
        <Interweave
          tagName="div"
          matchers={[
            new EmojiMatcher('emoji', { convertUnicode: true, convertShortcode: true }),
          ]}
          content=":cat:"
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        <Emoji {...extraProps} key={0} shortcode=":cat:" unicode="🐈️" enlargeEmoji />,
      ]);
    });

    it('handles void elements correctly', () => {
      const wrapper = shallow(
        <Interweave
          tagName="div"
          content={'This has line breaks.<br>Horizontal rule.<hr />An image.<img src="http://domain.com/image.jpg" />'}
        />
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'This has line breaks.',
        <Element key="0" tagName="br" selfClose>{[]}</Element>,
        'Horizontal rule.',
        <Element key="1" tagName="hr" selfClose>{[]}</Element>,
        'An image.',
        <Element key="2" tagName="img" attributes={{ src: 'http://domain.com/image.jpg' }} selfClose>{[]}</Element>,
      ]);
    });
  });

  describe('line breaks', () => {
    it('converts line breaks', () => {
      const wrapper = shallow(<Interweave content={'Foo\nBar'} />);

      expect(wrapper.prop('children')).toEqual([
        'Foo',
        <Element key="0" tagName="br" selfClose>{[]}</Element>,
        'Bar',
      ]);
    });

    it('doesnt convert line breaks', () => {
      const wrapper = shallow(<Interweave content={'Foo\nBar'} disableLineBreaks />);

      expect(wrapper.prop('children')).toEqual([
        'Foo\nBar',
      ]);
    });

    it('doesnt convert line breaks if it contains HTML', () => {
      const wrapper = shallow(<Interweave content={'Foo\n<br/>Bar'} />);

      expect(wrapper.prop('children')).toEqual([
        'Foo\n',
        <Element key="0" tagName="br" selfClose>{[]}</Element>,
        'Bar',
      ]);
    });
  });

  describe('whitelist', () => {
    it('filters invalid tags and attributes', () => {
      const wrapper = shallow(<Interweave content={MOCK_INVALID_MARKUP} />);

      expect(wrapper.prop('children')).toEqual([
        <Element key="0" tagName="div">
          {[
            '\n  ',
            'Outdated font.',
            '\n  \n  ',
            <Element key="1" tagName="p">
              {[
                'More text ',
                'with outdated stuff',
                '.',
              ]}
            </Element>,
            '\n',
          ]}
        </Element>,
      ]);
    });

    it('doesnt filter invalid tags and attributes when disabled', () => {
      const wrapper = shallow(<Interweave content={MOCK_INVALID_MARKUP} disableWhitelist />);

      expect(wrapper.prop('children')).toEqual([
        <Element key="0" attributes={{ bgcolor: 'black' }} tagName="div">
          {[
            '\n  ',
            <Element key="1" attributes={{ color: 'red' }} tagName="font">
              {['Outdated font.']}
            </Element>,
            '\n  \n  ',
            <Element key="2" attributes={{ align: 'center' }} tagName="p">
              {[
                'More text ',
                <Element key="3" tagName="strike">{['with outdated stuff']}</Element>,
                '.',
              ]}
            </Element>,
            '\n',
          ]}
        </Element>,
      ]);
    });
  });

  describe('server side rendering', () => {
    it('renders basic HTML', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave content="This is <b>bold</b>." />
      );

      expect(actual).toBe('<span class="interweave">This is <b class="interweave">bold</b>.</span>');
    });

    it('strips HTML', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave content="This is <b>bold</b>." noHtml />
      );

      expect(actual).toBe('<span class="interweave interweave--no-html">This is bold.</span>');
    });

    it('supports filters', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave
          filters={[new HrefFilter()]}
          content={'Foo <a href="foo.com">Bar</a> Baz'}
        />
      );

      expect(actual).toBe('<span class="interweave">Foo <a href="bar.net" class="interweave">Bar</a> Baz</span>');
    });

    it('supports matchers', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave
          matchers={[new CodeTagMatcher('b', '1')]}
          content="Foo [b] Bar Baz"
        />
      );

      expect(actual).toBe('<span class="interweave">Foo <span class="interweave">B</span> Bar Baz</span>');
    });

    it('supports complex content', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave
          tagName="div"
          matchers={[
            new EmailMatcher('email'),
            new EmojiMatcher('emoji', { convertShortcode: true, convertUnicode: true }),
            new HashtagMatcher('hashtag'),
            new IpMatcher('ip'),
            new UrlMatcher('url'),
          ]}
          content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. email@domain.com. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. #interweave Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper :japanese_castle: id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, www.domain.com.

Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. https://127.0.0.1/foo Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (http://domain.com/some/path?with=query). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.

#blessed #interweave #milesj`}
        />
      );

      expect(actual).toBe('<div class=\"interweave\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. <a href=\"mailto:email@domain.com\" class=\"interweave__link\" rel=\"noopener noreferrer\">email@domain.com</a>. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. <a href=\"interweave\" class=\"interweave__link\" rel=\"noopener noreferrer\">#interweave</a> Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper <img src=\"1F3EF\" alt=\"🏯\" class=\"interweave__emoji\" aria-label=\"Japanese castle\" data-unicode=\"🏯\" data-hexcode=\"1F3EF\" data-shortcode=\":japanese_castle:\" data-codepoint=\"127983\"/> id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, <a href=\"http://www.domain.com\" class=\"interweave__link\" rel=\"noopener noreferrer\">www.domain.com</a>.<br/><br/>Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. <a href=\"https://127.0.0.1/foo\" class=\"interweave__link\" rel=\"noopener noreferrer\">https://127.0.0.1/foo</a> Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (<a href=\"http://domain.com/some/path?with=query\" class=\"interweave__link\" rel=\"noopener noreferrer\">http://domain.com/some/path?with=query</a>). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.<br/><br/><a href=\"blessed\" class=\"interweave__link\" rel=\"noopener noreferrer\">#blessed</a> <a href=\"interweave\" class=\"interweave__link\" rel=\"noopener noreferrer\">#interweave</a> <a href=\"milesj\" class=\"interweave__link\" rel=\"noopener noreferrer\">#milesj</a></div>');
    });
  });
});

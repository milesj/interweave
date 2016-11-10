import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Interweave from '../lib/Interweave';
import { Element, Email, Emoji, Hashtag, Url } from '../lib/components';
import { EmailMatcher, EmojiMatcher, HashtagMatcher, IpMatcher, UrlMatcher } from '../lib/matchers';
import { SHORTNAME_TO_UNICODE } from '../lib/data/emoji';
import { MockFilter, MockMatcher, HrefFilter, CodeTagMatcher } from './mocks';

describe('Interweave', () => {
  const urlParts = {
    scheme: 'http',
    auth: '',
    host: '',
    port: '',
    path: '',
    query: '',
    fragment: '',
  };

  beforeEach(() => {
    Interweave.clearFilters();
    Interweave.clearMatchers();
  });

  it('sets the `noHtml` class name', () => {
    const wrapper = shallow(
      <Interweave
        noHtml
        content="Foo Bar"
      />
    );

    expect(wrapper.prop('className')).to.equal('interweave--no-html');
  });

  it('can pass filters through props', () => {
    const wrapper = shallow(
      <Interweave
        filters={[new HrefFilter()]}
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />
    ).shallow();

    expect(wrapper.prop('children')).to.deep.equal([
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

    expect(wrapper.prop('children')).to.deep.equal([
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

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo ',
      <Element tagName="span" key="1" customProp="foo">B</Element>,
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

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo [b] Bar Baz',
    ]);
  });

  it('allows empty `content` to be passed', () => {
    const wrapper = shallow(<Interweave content={null} />);

    expect(wrapper.prop('children')).to.equal(null);
  });

  it('will render the `emptyContent` if no content exists', () => {
    const empty = <div>Foo</div>;
    const wrapper = shallow(<Interweave content="" emptyContent={empty} />);

    expect(wrapper.contains(empty)).to.equal(true);
  });

  describe('addFilter()', () => {
    it('errors if not a filter', () => {
      expect(() => {
        Interweave.addFilter('notafilter');
      }).to.throw(TypeError, 'Filter must be an instance of the `Filter` class.');
    });

    it('errors if not a supported attribute', () => {
      expect(() => {
        Interweave.addFilter(new MockFilter('onclick'));
      }).to.throw(Error, 'Attribute "onclick" is not supported.');
    });

    it('adds a filter with a priority', () => {
      Interweave.addFilter(new MockFilter('href'), 5);

      expect(Interweave.getFilters()).to.deep.equal([
        { filter: new MockFilter('href'), priority: 5 },
      ]);
    });

    it('adds a filter with an incrementing priority and sorts', () => {
      Interweave.addFilter(new MockFilter('href'));
      Interweave.addFilter(new MockFilter('href'), 10);
      Interweave.addFilter(new MockFilter('href'));

      expect(Interweave.getFilters()).to.deep.equal([
        { filter: new MockFilter('href'), priority: 10 },
        { filter: new MockFilter('href'), priority: 100 },
        { filter: new MockFilter('href'), priority: 102 },
      ]);
    });
  });

  describe('addMatcher()', () => {
    it('errors if not a matcher', () => {
      expect(() => {
        Interweave.addMatcher('notamatcher');
      }).to.throw(TypeError, 'Matcher must be an instance of the `Matcher` class.');
    });

    it('errors if using the html name', () => {
      expect(() => {
        Interweave.addMatcher(new MockMatcher('html'));
      }).to.throw(Error, 'The matcher name "html" is not allowed.');
    });

    it('adds a matcher with an incrementing priority and sorts', () => {
      Interweave.addMatcher(new MockMatcher('emoji'));
      Interweave.addMatcher(new MockMatcher('email'), 10);
      Interweave.addMatcher(new MockMatcher('url'));

      expect(Interweave.getMatchers()).to.deep.equal([
        { matcher: new MockMatcher('email'), priority: 10 },
        { matcher: new MockMatcher('emoji'), priority: 100 },
        { matcher: new MockMatcher('url'), priority: 102 },
      ]);
    });

    it('sets an inverse named prop types', () => {
      expect(Interweave.propTypes.noBazQux).to.be.an('undefined');

      Interweave.addMatcher(new MockMatcher('bazQux'));

      expect(Interweave.propTypes.noBazQux).to.be.a('function');
    });
  });

  describe('parseMarkup()', () => {
    it('errors if onBeforeParse doesnt return a string', () => {
      expect(() => {
        shallow(<Interweave onBeforeParse={() => 123} content="Foo" />);
      }).to.throw(TypeError, 'Interweave `onBeforeParse` must return a valid HTML string.');
    });

    it('errors if onAfterParse doesnt return an array', () => {
      expect(() => {
        shallow(<Interweave onAfterParse={() => 123} content="Foo" />);
      }).to.throw(TypeError, 'Interweave `onAfterParse` must return an array of strings and React elements.');
    });

    it('can modify the markup using onBeforeParse', () => {
      const wrapper = shallow(
        <Interweave
          onBeforeParse={content => content.replace(/b>/g, 'i>')}
          content={'Foo <b>Bar</b> Baz'}
        />
      ).shallow();

      expect(wrapper.prop('children')).to.deep.equal([
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

      expect(wrapper.prop('children')).to.deep.equal([
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

      expect(wrapper.find('span')).to.have.lengthOf(1);
      expect(wrapper.text()).to.equal('Foo');
    });

    it('renders with a custom tag name', () => {
      const wrapper = shallow(<Interweave tagName="div" content="Foo" />).shallow();

      expect(wrapper.find('div')).to.have.lengthOf(1);
      expect(wrapper.text()).to.equal('Foo');
    });

    it('parses HTML', () => {
      const wrapper = shallow(<Interweave tagName="div" content={'Foo <b>Bar</b> Baz'} />).shallow();

      expect(wrapper.find('div')).to.have.lengthOf(1);
      expect(wrapper.find('Element').prop('tagName')).to.equal('b');
      expect(wrapper.prop('children')).to.deep.equal([
        'Foo ',
        <Element tagName="b" key="0">{['Bar']}</Element>,
        ' Baz',
      ]);
    });
  });

  it('parses and renders large blocks of text with all matchers', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[
          new EmailMatcher('email'),
          new EmojiMatcher('emoji', { convertShortName: true }),
          new HashtagMatcher('hashtag'),
          new IpMatcher('ip'),
          new UrlMatcher('url'),
        ]}
        content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. email@domain.com. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. #interweave Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper :japanese_castle: id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, www.domain.com.

Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. https://127.0.0.1/foo Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (http://domain.com/some/path?with=query). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.

#blessed #interweave #milesj`}
      />
    ).shallow();

    expect(wrapper.prop('children')).to.deep.equal([
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. ',
      <Email key="0" emailParts={{ username: 'email', host: 'domain.com' }}>email@domain.com</Email>,
      '. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. ',
      <Hashtag key="2" hashtagName="interweave">#interweave</Hashtag>,
      ' Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper ',
      <Emoji key="1" shortName=":japanese_castle:" unicode={SHORTNAME_TO_UNICODE[':japanese_castle:']} />,
      ' id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, ',
      <Url key="3" urlParts={{ ...urlParts, host: 'www.domain.com' }}>www.domain.com</Url>,
      '.',
      <Element key="4" tagName="br" selfClose>{[]}</Element>,
      <Element key="5" tagName="br" selfClose>{[]}</Element>,
      'Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. ',
      <Url key="6" urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
      ' Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (',
      <Url key="7" urlParts={{ ...urlParts, host: 'domain.com', path: '/some/path', query: '?with=query' }}>http://domain.com/some/path?with=query</Url>,
      '). Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.',
      <Element key="8" tagName="br" selfClose>{[]}</Element>,
      <Element key="9" tagName="br" selfClose>{[]}</Element>,
      <Hashtag key="10" hashtagName="blessed">#blessed</Hashtag>,
      ' ',
      <Hashtag key="11" hashtagName="interweave">#interweave</Hashtag>,
      ' ',
      <Hashtag key="12" hashtagName="milesj">#milesj</Hashtag>,
    ]);
  });

  it('parses and renders HTML text with all matchers', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[
          new EmailMatcher('email'),
          new EmojiMatcher('emoji', { convertShortName: true, convertUnicode: true }),
          new HashtagMatcher('hashtag'),
          new IpMatcher('ip'),
          new UrlMatcher('url'),
        ]}
        content={`<h1>Lorem ipsum dolor sit amet</h1>

<p><b>Consectetur adipiscing elit.</b> Donec massa lorem, mollis non commodo quis, ultricies at elit. email@domain.com. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. #interweave Donec eu sem non nibh condimentum luctus. \uD83D\uDC31 Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id :love_letter:, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, <a href="www.domain.com">www.domain.com</a>.</p>

<br />:ok_woman_tone3:<br />

<div>Curabitur lectus odio, <em>tempus quis velit vitae, cursus sagittis nulla</em>. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. https://127.0.0.1/foo Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (http://domain.com/some/path?with=query). Pellentesque ac finibus mauris. Sed eu luctus diam. :not_an_emoji: Quisque porta lectus in turpis imperdiet dapibus.</div>

<section>#blessed #interweave #milesj</section> \uD83D\uDC36`}
      />
    ).shallow();

    expect(wrapper.prop('children')).to.deep.equal([
      <Element key="0" tagName="h1">{['Lorem ipsum dolor sit amet']}</Element>,
      '\n\n',
      <Element key="1" tagName="p">
        {[
          <Element key="2" tagName="b">{['Consectetur adipiscing elit.']}</Element>,
          ' Donec massa lorem, mollis non commodo quis, ultricies at elit. ',
          <Email key="3" emailParts={{ username: 'email', host: 'domain.com' }}>email@domain.com</Email>,
          '. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. ',
          <Hashtag key="6" hashtagName="interweave">#interweave</Hashtag>,
          ' Donec eu sem non nibh condimentum luctus. ',
          <Emoji key="5" unicode={SHORTNAME_TO_UNICODE[':cat:']} />,
          ' Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id ',
          <Emoji key="4" shortName=":love_letter:" unicode={SHORTNAME_TO_UNICODE[':love_letter:']} />,
          ', viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, ',
          <Element key="7" tagName="a" attributes={{ href: 'www.domain.com' }}>{['www.domain.com']}</Element>,
          '.',
        ]}
      </Element>,
      '\n\n',
      <Element key="8" tagName="br" selfClose>{[]}</Element>,
      <Emoji key="9" shortName=":ok_woman_tone3:" unicode={SHORTNAME_TO_UNICODE[':ok_woman_tone3:']} />,
      <Element key="10" tagName="br" selfClose>{[]}</Element>,
      '\n\n',
      <Element key="11" tagName="div">
        {[
          'Curabitur lectus odio, ',
          <Element key="12" tagName="em">{['tempus quis velit vitae, cursus sagittis nulla']}</Element>,
          '. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. ',
          <Url key="13" urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
          ' Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi (',
          <Url key="14" urlParts={{ ...urlParts, host: 'domain.com', path: '/some/path', query: '?with=query' }}>http://domain.com/some/path?with=query</Url>,
          '). Pellentesque ac finibus mauris. Sed eu luctus diam. :not_an_emoji: Quisque porta lectus in turpis imperdiet dapibus.',
        ]}
      </Element>,
      '\n\n',
      <Element key="15" tagName="section">
        {[
          <Hashtag key="16" hashtagName="blessed">#blessed</Hashtag>,
          ' ',
          <Hashtag key="17" hashtagName="interweave">#interweave</Hashtag>,
          ' ',
          <Hashtag key="18" hashtagName="milesj">#milesj</Hashtag>,
        ]}
      </Element>,
      ' ',
      <Emoji key="19" unicode={SHORTNAME_TO_UNICODE[':dog:']} />,
    ]);
  });

  it('parses and doesnt render anchor links within anchor links', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[
          new EmailMatcher('email'),
          new EmojiMatcher('emoji', { convertShortName: true }),
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

    expect(wrapper.prop('children')).to.deep.equal([
      '- ',
      <Url key="0" urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
      '\n- ',
      <Element key="1" tagName="a" attributes={{ href: 'www.domain.com' }}>{['www.domain.com']}</Element>,
      '\n- (',
      <Url key="2" urlParts={{ ...urlParts, host: 'domain.com', path: '/some/path', query: '?with=query' }}>http://domain.com/some/path?with=query</Url>,
      ')\n- ',
      <Element key="3" tagName="a" attributes={{ href: 'http://domain.com' }}>{['This text should stay']}</Element>,
    ]);
  });

  it('parses and renders emoji shortname as unicode', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[
          new EmojiMatcher('emoji', { convertShortName: true, renderUnicode: true }),
        ]}
        content="This has :cat: and :dog: shortnames."
      />
    ).shallow();

    expect(wrapper.prop('children')).to.deep.equal([
      'This has ',
      SHORTNAME_TO_UNICODE[':cat:'],
      ' and ',
      SHORTNAME_TO_UNICODE[':dog:'],
      ' shortnames.',
    ]);
  });

  it('parses and renders emoji unicode (literals) as unicode', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[
          new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true }),
        ]}
        content="This has 🐱 and 🐶 shortnames."
      />
    ).shallow();

    expect(wrapper.prop('children')).to.deep.equal([
      'This has ',
      SHORTNAME_TO_UNICODE[':cat:'],
      ' and ',
      SHORTNAME_TO_UNICODE[':dog:'],
      ' shortnames.',
    ]);
  });

  it('parses and renders emoji unicode (escapes) as unicode', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[
          new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true }),
        ]}
        content={'This has \uD83D\uDC31 and \uD83D\uDC36 shortnames.'}
      />
    ).shallow();

    expect(wrapper.prop('children')).to.deep.equal([
      'This has ',
      SHORTNAME_TO_UNICODE[':cat:'],
      ' and ',
      SHORTNAME_TO_UNICODE[':dog:'],
      ' shortnames.',
    ]);
  });

  it('handles void elements correctly', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        content={'This has line breaks.<br>Horizontal rule.<hr />An image.<img src="http://domain.com/image.jpg" />'}
      />
    ).shallow();

    expect(wrapper.prop('children')).to.deep.equal([
      'This has line breaks.',
      <Element key="0" tagName="br" selfClose>{[]}</Element>,
      'Horizontal rule.',
      <Element key="1" tagName="hr" selfClose>{[]}</Element>,
      'An image.',
      <Element key="2" tagName="img" attributes={{ src: 'http://domain.com/image.jpg' }} selfClose>{[]}</Element>,
    ]);
  });

  it('converts line breaks', () => {
    const wrapper = shallow(<Interweave content={'Foo\nBar'} />);

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo',
      <Element key="0" tagName="br" selfClose>{[]}</Element>,
      'Bar',
    ]);
  });

  it('doesnt convert line breaks', () => {
    const wrapper = shallow(<Interweave content={'Foo\nBar'} disableLineBreaks />);

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo\nBar',
    ]);
  });

  it('doesnt convert line breaks if it contains HTML', () => {
    const wrapper = shallow(<Interweave content={'Foo\n<br/>Bar'} />);

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo\n',
      <Element key="0" tagName="br" selfClose>{[]}</Element>,
      'Bar',
    ]);
  });
});

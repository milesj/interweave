import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Interweave from '../lib/Interweave';
import Element from '../lib/components/Element';
import { Email, /* Emoji, */ Hashtag, Url } from '../lib/components';
import { EmailMatcher, /* EmojiMatcher, */ HashtagMatcher, IpMatcher, UrlMatcher } from '../lib/matchers';
import { MockFilter, MockMatcher, HrefFilter, CodeTagMatcher } from './mocks';

describe('Interweave', () => {
  beforeEach(() => {
    Interweave.clearFilters();
    Interweave.clearMatchers();
  });

  it('can pass filters through props', () => {
    const wrapper = shallow(
      <Interweave
        filters={[new HrefFilter()]}
      >
        {'Foo <a href="foo.com">Bar</a> Baz'}
      </Interweave>
    ).shallow();

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo ',
      <Element tagName="a" key="0" attributes={{ href: 'bar.net' }}>{['Bar']}</Element>,
      ' Baz',
    ]);
  });

  it('can pass matchers through props', () => {
    const wrapper = shallow(
      <Interweave
        matchers={[new CodeTagMatcher('b', '1')]}
      >
        {'Foo [b] Bar Baz'}
      </Interweave>
    ).shallow();

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo ',
      <Element tagName="b" key="1" customProp="foo">B</Element>,
      ' Bar Baz',
    ]);
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
        shallow(<Interweave onBeforeParse={() => 123}>Foo</Interweave>);
      }).to.throw(TypeError, 'Interweave `onBeforeParse` must return a valid HTML string.');
    });

    it('errors if onAfterParse doesnt return an array', () => {
      expect(() => {
        shallow(<Interweave onAfterParse={() => 123}>Foo</Interweave>);
      }).to.throw(TypeError, 'Interweave `onAfterParse` must return an array of strings and React elements.');
    });

    it('can modify the markup using onBeforeParse', () => {
      const wrapper = shallow(
        <Interweave onBeforeParse={content => content.replace(/b>/g, 'i>')}>
          {'Foo <b>Bar</b> Baz'}
        </Interweave>
      ).shallow();

      expect(wrapper.prop('children')).to.deep.equal([
        'Foo ',
        <Element tagName="i" key="0" attributes={{}}>{['Bar']}</Element>,
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
        >
          {'Foo <b>Bar</b> Baz'}
        </Interweave>
      ).shallow();

      expect(wrapper.prop('children')).to.deep.equal([
        'Foo ',
        <Element tagName="b" key="0" attributes={{}}>{['Bar']}</Element>,
        ' Baz',
        <Element tagName="u" key="1">Qux</Element>,
      ]);
    });
  });

  describe('render()', () => {
    it('renders with a default tag name', () => {
      const wrapper = shallow(<Interweave>Foo</Interweave>).shallow();

      expect(wrapper.find('span')).to.have.lengthOf(1);
      expect(wrapper.text()).to.equal('Foo');
    });

    it('renders with a custom tag name', () => {
      const wrapper = shallow(<Interweave tagName="div">Foo</Interweave>).shallow();

      expect(wrapper.find('div')).to.have.lengthOf(1);
      expect(wrapper.text()).to.equal('Foo');
    });

    it('parses HTML', () => {
      const wrapper = shallow(<Interweave tagName="div">{'Foo <b>Bar</b> Baz'}</Interweave>).shallow();

      expect(wrapper.find('div')).to.have.lengthOf(1);
      expect(wrapper.find('Element').prop('tagName')).to.equal('b');
      expect(wrapper.prop('children')).to.deep.equal([
        'Foo ',
        <Element tagName="b" key="0" attributes={{}}>{['Bar']}</Element>,
        ' Baz',
      ]);
    });
  });

  it('parses and renders large blocks of text with many matchers', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[
          new EmailMatcher('email'),
          // new EmojiMatcher('emoji'),
          new HashtagMatcher('hashtag'),
          new IpMatcher('ip'),
          new UrlMatcher('url'),
        ]}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. email@domain.com. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. #interweave Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, www.domain.com.

Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. https://127.0.0.1/foo Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi. Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus.

#blessed #interweave #milesj
      </Interweave>
    ).shallow();

    const urlParts = {
      scheme: 'http',
      auth: '',
      host: '',
      port: '',
      path: '',
      query: '',
      fragment: '',
    };

    expect(wrapper.prop('children')).to.deep.equal([
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa lorem, mollis non commodo quis, ultricies at elit. ',
      <Email key="0" emailParts={{ username: 'email', host: 'domain.com' }}>email@domain.com</Email>,
      '. Aliquam a arcu porttitor, aliquam eros sed, convallis massa. Nunc vitae vehicula quam, in feugiat ligula. ',
      <Hashtag key="1" hashtagName="interweave">#interweave</Hashtag>,
      ' Donec eu sem non nibh condimentum luctus. Vivamus pharetra feugiat blandit. Vestibulum neque velit, semper id vestibulum id, viverra a felis. Integer convallis in orci nec bibendum. Ut consequat posuere metus, ',
      <Url key="6" urlParts={{ ...urlParts, host: 'www.domain.com' }}>www.domain.com</Url>,
      '. Curabitur lectus odio, tempus quis velit vitae, cursus sagittis nulla. Maecenas sem nulla, tempor nec risus nec, ultricies ultricies magna. ',
      <Url key="5" urlParts={{ ...urlParts, scheme: 'https', host: '127.0.0.1', path: '/foo' }}>https://127.0.0.1/foo</Url>,
      ' Nulla malesuada lacinia libero non mollis. Curabitur id lacus id dolor vestibulum ornare quis a nisi. Pellentesque ac finibus mauris. Sed eu luctus diam. Quisque porta lectus in turpis imperdiet dapibus. ',
      <Hashtag key="2" hashtagName="blessed">#blessed</Hashtag>,
      ' ',
      <Hashtag key="3" hashtagName="interweave">#interweave</Hashtag>,
      ' ',
      <Hashtag key="4" hashtagName="milesj">#milesj</Hashtag>,
    ]);
  });
});

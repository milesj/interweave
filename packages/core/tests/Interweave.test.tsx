import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { shallow } from 'enzyme';
import Interweave from '../src/Interweave';
import Element from '../src/Element';
import {
  EXTRA_PROPS,
  MOCK_MARKUP,
  MOCK_INVALID_MARKUP,
  LinkFilter,
  CodeTagMatcher,
  matchCodeTag,
} from '../src/testUtils';

describe('Interweave', () => {
  it('can pass filters through props', () => {
    const wrapper = shallow(
      <Interweave filters={[new LinkFilter()]} content={'Foo <a href="foo.com">Bar</a> Baz'} />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element tagName="a" key="0" attributes={{ href: 'bar.net', target: '_blank' }}>
        {['Bar']}
      </Element>,
      ' Baz',
    ]);
  });

  it('can pass object based filters through props', () => {
    const wrapper = shallow(
      <Interweave
        filters={[
          {
            attribute: (name, value) =>
              name === 'href' ? value.replace('foo.com', 'bar.net') : value,
          },
        ]}
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element tagName="a" key="0" attributes={{ href: 'bar.net' }}>
        {['Bar']}
      </Element>,
      ' Baz',
    ]);
  });

  it('can disable all filters using `disableFilters`', () => {
    const wrapper = shallow(
      <Interweave
        filters={[new LinkFilter()]}
        disableFilters
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element tagName="a" key="0" attributes={{ href: 'foo.com' }}>
        {['Bar']}
      </Element>,
      ' Baz',
    ]);
  });

  it('can pass matchers through props', () => {
    const wrapper = shallow(
      <Interweave matchers={[new CodeTagMatcher('b', '1')]} content="Foo [b] Bar Baz" />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element {...EXTRA_PROPS} tagName="span" key="1" customProp="foo">
        B
      </Element>,
      ' Bar Baz',
    ]);
  });

  it('can pass object based matchers through props', () => {
    const wrapper = shallow(
      <Interweave
        matchers={[
          {
            inverseName: 'noB',
            propName: 'b',
            asTag: () => 'span',
            createElement: (match: string, p: any) => (
              <Element key="0" tagName="span" {...p}>
                {p.children.toUpperCase()}
              </Element>
            ),
            match: string => matchCodeTag(string, 'b'),
          },
        ]}
        content="Foo [b] Bar Baz"
      />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element {...EXTRA_PROPS} tagName="span" key="0" customProp="foo">
        B
      </Element>,
      ' Bar Baz',
    ]);
  });

  it('can disable all matchers using `disableMatchers', () => {
    const wrapper = shallow(
      <Interweave
        matchers={[new CodeTagMatcher('b', '1')]}
        disableMatchers
        content="Foo [b] Bar Baz"
      />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual(['Foo [b] Bar Baz']);
  });

  it('allows empty `content` to be passed', () => {
    const wrapper = shallow(<Interweave content={null} />);

    expect(wrapper.prop('parsedContent')).toBeNull();
  });

  it('allows empty `content` to be passed when using callbacks', () => {
    const wrapper = shallow(<Interweave content={null} onBeforeParse={value => value} />);

    expect(wrapper.prop('parsedContent')).toBeNull();
  });

  describe('parseMarkup()', () => {
    it('errors if onBeforeParse doesnt return a string', () => {
      expect(() => {
        // @ts-ignore
        shallow(<Interweave onBeforeParse={() => 123} content="Foo" />);
      }).toThrow('Interweave `onBeforeParse` must return a valid HTML string.');
    });

    it('errors if onAfterParse doesnt return an array', () => {
      expect(() => {
        // @ts-ignore
        shallow(<Interweave onAfterParse={() => 123} content="Foo" />);
      }).toThrow('Interweave `onAfterParse` must return an array of strings and React elements.');
    });

    it('can modify the markup using onBeforeParse', () => {
      const wrapper = shallow(
        <Interweave
          onBeforeParse={content => content.replace(/b>/g, 'i>')}
          content={'Foo <b>Bar</b> Baz'}
        />,
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'Foo ',
        <Element tagName="i" key="0">
          {['Bar']}
        </Element>,
        ' Baz',
      ]);
    });

    it('can modify the tree using onAfterParse', () => {
      const wrapper = shallow(
        <Interweave
          onAfterParse={content => {
            content.push(
              <Element tagName="u" key="1">
                Qux
              </Element>,
            );

            return content;
          }}
          content={'Foo <b>Bar</b> Baz'}
        />,
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'Foo ',
        <Element tagName="b" key="0">
          {['Bar']}
        </Element>,
        ' Baz',
        <Element tagName="u" key="1">
          Qux
        </Element>,
      ]);
    });
  });

  describe('render()', () => {
    it('renders with a default tag name', () => {
      const wrapper = shallow(<Interweave content="Foo" />);

      expect(wrapper.prop('tagName')).toBe('span');
    });

    it('renders with a custom tag name', () => {
      const wrapper = shallow(<Interweave tagName="div" content="Foo" />);

      expect(wrapper.prop('tagName')).toBe('div');
    });

    it('parses HTML', () => {
      const wrapper = shallow(<Interweave tagName="div" content={'Foo <b>Bar</b> Baz'} />);

      expect(wrapper.prop('tagName')).toBe('div');
      expect(wrapper.prop('parsedContent')).toEqual([
        'Foo ',
        <Element tagName="b" key="0">
          {['Bar']}
        </Element>,
        ' Baz',
      ]);
    });
  });

  describe('parsing and rendering', () => {
    it('handles void elements correctly', () => {
      const wrapper = shallow(
        <Interweave
          tagName="div"
          content={
            'This has line breaks.<br>Horizontal rule.<hr />An image.<img src="http://domain.com/image.jpg" />'
          }
        />,
      ).shallow();

      expect(wrapper.prop('children')).toEqual([
        'This has line breaks.',
        <Element key="0" tagName="br" selfClose>
          {[]}
        </Element>,
        'Horizontal rule.',
        <Element key="1" tagName="hr" selfClose>
          {[]}
        </Element>,
        'An image.',
        <Element
          key="2"
          tagName="img"
          attributes={{ src: 'http://domain.com/image.jpg' }}
          selfClose
        >
          {[]}
        </Element>,
      ]);
    });
  });

  describe('line breaks', () => {
    it('converts line breaks', () => {
      const wrapper = shallow(<Interweave content={'Foo\nBar'} />);

      expect(wrapper.prop('parsedContent')).toEqual([
        'Foo',
        <Element key="0" tagName="br" selfClose>
          {[]}
        </Element>,
        'Bar',
      ]);
    });

    it('converts line breaks if `noHtmlExceptMatchers` is true', () => {
      const wrapper = shallow(<Interweave content={'Foo\nBar'} noHtmlExceptMatchers />);

      expect(wrapper.prop('parsedContent')).toEqual([
        'Foo',
        <Element key="0" tagName="br" selfClose>
          {[]}
        </Element>,
        'Bar',
      ]);
    });

    it('doesnt convert line breaks if `noHtml` is true', () => {
      const wrapper = shallow(<Interweave content={'Foo\nBar'} noHtml />);

      expect(wrapper.prop('parsedContent')).toEqual(['Foo\nBar']);
    });

    it('doesnt convert line breaks if `disableLineBreaks` is true', () => {
      const wrapper = shallow(<Interweave content={'Foo\nBar'} disableLineBreaks />);

      expect(wrapper.prop('parsedContent')).toEqual(['Foo\nBar']);
    });

    it('doesnt convert line breaks if it contains HTML', () => {
      const wrapper = shallow(<Interweave content={'Foo\n<br/>Bar'} />);

      expect(wrapper.prop('parsedContent')).toEqual([
        'Foo\n',
        <Element key="0" tagName="br" selfClose>
          {[]}
        </Element>,
        'Bar',
      ]);
    });
  });

  describe('allow list', () => {
    it('filters invalid tags and attributes', () => {
      const wrapper = shallow(<Interweave content={MOCK_INVALID_MARKUP} />);

      expect(wrapper.prop('parsedContent')).toEqual([
        <Element key="0" tagName="div">
          {[
            '\n  ',
            'Outdated font.',
            '\n  ',
            '\n  ',
            <Element key="1" tagName="p">
              {['More text ', 'with outdated stuff', '.']}
            </Element>,
            '\n',
          ]}
        </Element>,
      ]);
    });

    it('doesnt filter invalid tags and attributes when disabled', () => {
      const wrapper = shallow(
        <Interweave content={MOCK_INVALID_MARKUP} allowElements allowAttributes />,
      );

      expect(wrapper.prop('parsedContent')).toEqual([
        <Element key="0" attributes={{ bgcolor: 'black' }} tagName="div">
          {[
            '\n  ',
            // @ts-ignore Allow invalid tag
            <Element key="1" attributes={{ color: 'red' }} tagName="font">
              {['Outdated font.']}
            </Element>,
            '\n  ',
            '\n  ',
            <Element key="2" attributes={{ align: 'center' }} tagName="p">
              {[
                'More text ',
                // @ts-ignore Allow invalid tag
                <Element key="3" tagName="strike">
                  {['with outdated stuff']}
                </Element>,
                '.',
              ]}
            </Element>,
            '\n',
          ]}
        </Element>,
      ]);
    });
  });

  describe('block list', () => {
    it('filters blocked tags and attributes', () => {
      const wrapper = shallow(<Interweave content={MOCK_MARKUP} blockList={['aside', 'a']} />);

      expect(wrapper.prop('parsedContent')).toEqual([
        <Element key="0" tagName="main" attributes={{ role: 'main' }}>
          {[
            '\n  Main content\n  ',
            <Element key="1" tagName="div">
              {[
                '\n    ',
                'Link',
                '\n    ',
                <Element key="2" tagName="span" attributes={{ className: 'foo' }}>
                  {['String']}
                </Element>,
                '\n  ',
              ]}
            </Element>,
            '\n',
          ]}
        </Element>,
        '\n',
        '\n  Sidebar content\n',
      ]);
    });
  });

  describe('server side rendering', () => {
    it('renders basic HTML', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave content="This is <b>bold</b>." />,
      );

      expect(actual).toBe('<span>This is <b>bold</b>.</span>');
    });

    it('strips HTML', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave content="This is <b>bold</b>." noHtml />,
      );

      expect(actual).toBe('<span>This is bold.</span>');
    });

    it('supports filters', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave filters={[new LinkFilter()]} content={'Foo <a href="foo.com">Bar</a> Baz'} />,
      );

      expect(actual).toBe('<span>Foo <a href="bar.net" target="_blank">Bar</a> Baz</span>');
    });

    it('supports matchers', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave matchers={[new CodeTagMatcher('b', '1')]} content="Foo [b] Bar Baz" />,
      );

      expect(actual).toBe('<span>Foo <span>B</span> Bar Baz</span>');
    });
  });

  describe('transform prop', () => {
    it('skips the element', () => {
      const transform = (node: HTMLElement) => (node.nodeName === 'IMG' ? null : undefined);
      const wrapper = shallow(<Interweave content={'Foo <img/> Bar'} transform={transform} />);

      expect(wrapper.prop('parsedContent')).toEqual(['Foo ', ' Bar']);
    });

    it('replaces the element', () => {
      const Dummy = () => <div />;
      const transform = (node: HTMLElement) => (node.nodeName === 'IMG' ? <Dummy /> : undefined);
      const wrapper = shallow(<Interweave content={'Foo <img/> Bar'} transform={transform} />);

      expect(wrapper.prop('parsedContent')).toEqual(['Foo ', <Dummy key="0" />, ' Bar']);
    });

    it('allows blacklisted', () => {
      const Dummy = () => <iframe title="foo" />;
      const transform = (node: HTMLElement) => (node.nodeName === 'IFRAME' ? <Dummy /> : undefined);
      const wrapper = shallow(
        <Interweave content={'Foo <iframe></iframe> Bar'} transform={transform} />,
      );

      expect(wrapper.prop('parsedContent')).toEqual(['Foo ', <Dummy key="0" />, ' Bar']);
    });
  });
});

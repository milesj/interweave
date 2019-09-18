import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { render } from 'rut';
import Interweave from '../src/Interweave';
import Element from '../src/Element';
import { ALLOWED_TAG_LIST } from '../src/constants';
import {
  MOCK_MARKUP,
  MOCK_INVALID_MARKUP,
  LinkFilter,
  CodeTagMatcher,
  matchCodeTag,
} from '../src/testUtils';

describe('Interweave', () => {
  it('doesnt include canvas and iframe in default allow list', () => {
    expect(ALLOWED_TAG_LIST).not.toContain('canvas');
    expect(ALLOWED_TAG_LIST).not.toContain('iframe');
  });

  it('can pass filters through props', () => {
    const { root } = render(
      <Interweave filters={[new LinkFilter()]} content={'Foo <a href="foo.com">Bar</a> Baz'} />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('can pass object based filters through props', () => {
    const { root } = render(
      <Interweave
        filters={[
          {
            attribute: (name, value) =>
              name === 'href' ? value.replace('foo.com', 'bar.net') : value,
          },
        ]}
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('can disable all filters using `disableFilters`', () => {
    const { root } = render(
      <Interweave
        filters={[new LinkFilter()]}
        disableFilters
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('can pass matchers through props', () => {
    const { root } = render(
      <Interweave matchers={[new CodeTagMatcher('b', '1')]} content="Foo [b] Bar Baz" />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('can pass object based matchers through props', () => {
    const { root } = render(
      <Interweave
        matchers={[
          {
            inverseName: 'noB',
            propName: 'b',
            asTag: () => 'span',
            createElement: (match: string, p: { children: string }) => (
              <Element key="0" tagName="span" {...p}>
                {p.children.toUpperCase()}
              </Element>
            ),
            match: string => matchCodeTag(string, 'b'),
          },
        ]}
        content="Foo [b] Bar Baz"
      />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('can disable all matchers using `disableMatchers', () => {
    const { root } = render(
      <Interweave
        matchers={[new CodeTagMatcher('b', '1')]}
        disableMatchers
        content="Foo [b] Bar Baz"
      />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('allows empty `content` to be passed', () => {
    const { root } = render(<Interweave content={null} />);

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('allows empty `content` to be passed when using callbacks', () => {
    const { root } = render(<Interweave content={null} onBeforeParse={value => value} />);

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  describe('parseMarkup()', () => {
    it('errors if onBeforeParse doesnt return a string', () => {
      expect(() => {
        // @ts-ignore
        render(<Interweave onBeforeParse={() => 123} content="Foo" />);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if onAfterParse doesnt return an array', () => {
      expect(() => {
        // @ts-ignore
        render(<Interweave onAfterParse={() => 123} content="Foo" />);
      }).toThrowErrorMatchingSnapshot();
    });

    it('can modify the markup using onBeforeParse', () => {
      const { root } = render(
        <Interweave
          onBeforeParse={content => content.replace(/b>/g, 'i>')}
          content={'Foo <b>Bar</b> Baz'}
        />,
      );

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });

    it('can modify the tree using onAfterParse', () => {
      const { root } = render(
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
      );

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });
  });

  describe('render()', () => {
    it('renders with a default tag name', () => {
      const { root } = render(<Interweave content="Foo" />);

      expect(root.findAt(Element, 'first')).toHaveProp('tagName', 'span');
    });

    it('renders with a custom tag name', () => {
      const { root } = render(<Interweave tagName="div" content="Foo" />);

      expect(root.findAt(Element, 'first')).toHaveProp('tagName', 'div');
    });

    it('parses HTML', () => {
      const { root } = render(<Interweave tagName="div" content={'Foo <b>Bar</b> Baz'} />);

      expect(root.findAt(Element, 'first')).toHaveProp('tagName', 'div');
      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });
  });

  describe('parsing and rendering', () => {
    it('handles void elements correctly', () => {
      const { root } = render(
        <Interweave
          tagName="div"
          content={
            'This has line breaks.<br>Horizontal rule.<hr />An image.<img src="http://domain.com/image.jpg" />'
          }
        />,
      );

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });
  });

  describe('line breaks', () => {
    it('converts line breaks', () => {
      const { root } = render(<Interweave content={'Foo\nBar'} />);

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });

    it('converts line breaks if `noHtmlExceptMatchers` is true', () => {
      const { root } = render(<Interweave content={'Foo\nBar'} noHtmlExceptMatchers />);

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });

    it('doesnt convert line breaks if `noHtml` is true', () => {
      const { root } = render(<Interweave content={'Foo\nBar'} noHtml />);

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });

    it('doesnt convert line breaks if `disableLineBreaks` is true', () => {
      const { root } = render(<Interweave content={'Foo\nBar'} disableLineBreaks />);

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });

    it('doesnt convert line breaks if it contains HTML', () => {
      const { root } = render(<Interweave content={'Foo\n<br/>Bar'} />);

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });
  });

  describe('allow list', () => {
    it('filters invalid tags and attributes', () => {
      const { root } = render(<Interweave content={MOCK_INVALID_MARKUP} />);

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });

    it('doesnt filter invalid tags and attributes when disabled', () => {
      const { root } = render(
        <Interweave content={MOCK_INVALID_MARKUP} allowElements allowAttributes />,
      );

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });
  });

  describe('block list', () => {
    it('filters blocked tags and attributes', () => {
      const { root } = render(<Interweave content={MOCK_MARKUP} blockList={['aside', 'a']} />);

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
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
      const { root } = render(<Interweave content={'Foo <img/> Bar'} transform={transform} />);

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });

    it('replaces the element', () => {
      const Dummy = () => <div />;
      const transform = (node: HTMLElement) => (node.nodeName === 'IMG' ? <Dummy /> : undefined);
      const { root } = render(<Interweave content={'Foo <img/> Bar'} transform={transform} />);

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });

    it('allows blacklisted', () => {
      const Dummy = () => <iframe title="foo" />;
      const transform = (node: HTMLElement) => (node.nodeName === 'IFRAME' ? <Dummy /> : undefined);
      const { root } = render(
        <Interweave content={'Foo <iframe></iframe> Bar'} transform={transform} />,
      );

      expect(root.findAt(Element, 'first')).toMatchSnapshot();
    });
  });
});

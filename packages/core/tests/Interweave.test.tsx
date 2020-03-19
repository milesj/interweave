import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { render } from 'rut-dom';
import { createHTMLDocument } from 'interweave-ssr';
import Interweave from '../src/Interweave';
import Element from '../src/Element';
import { ALLOWED_TAG_LIST } from '../src/constants';
import {
  MOCK_MARKUP,
  MOCK_INVALID_MARKUP,
  LinkFilter,
  CodeTagMatcher,
  matchCodeTag,
  MarkdownBoldMatcher,
  MarkdownItalicMatcher,
} from '../src/testing';
import { InterweaveProps } from '../src/types';

describe('Interweave', () => {
  it('doesnt include canvas and iframe in default allow list', () => {
    expect(ALLOWED_TAG_LIST).not.toContain('canvas');
    expect(ALLOWED_TAG_LIST).not.toContain('iframe');
  });

  it('can pass custom attributes', () => {
    const { root } = render<InterweaveProps>(
      <Interweave
        attributes={{ 'aria-label': 'foo' }}
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />,
    );

    expect(root.findOne('span')).toHaveProp('aria-label', 'foo');
  });

  it('can pass filters through props', () => {
    const { root } = render<InterweaveProps>(
      <Interweave filters={[new LinkFilter()]} content={'Foo <a href="foo.com">Bar</a> Baz'} />,
    );

    expect(root.findAt(Element, 0)).toMatchSnapshot();
  });

  it('can pass object based filters through props', () => {
    const { root } = render<InterweaveProps>(
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

    expect(root.findAt(Element, 0)).toMatchSnapshot();
  });

  it('can disable all filters using `disableFilters`', () => {
    const { root } = render<InterweaveProps>(
      <Interweave
        filters={[new LinkFilter()]}
        disableFilters
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />,
    );

    expect(root.findAt(Element, 0)).toMatchSnapshot();
  });

  it('can pass matchers through props', () => {
    const { root } = render<InterweaveProps>(
      <Interweave matchers={[new CodeTagMatcher('b', '1')]} content="Foo [b] Bar Baz" />,
    );

    expect(root.findAt(Element, 0)).toMatchSnapshot();
  });

  it('can pass object based matchers through props', () => {
    const { root } = render<InterweaveProps>(
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

    expect(root.findAt(Element, 0)).toMatchSnapshot();
  });

  it('can disable all matchers using `disableMatchers`', () => {
    const { root } = render<InterweaveProps>(
      <Interweave
        matchers={[new CodeTagMatcher('b', '1')]}
        disableMatchers
        content="Foo [b] Bar Baz"
      />,
    );

    expect(root.findAt(Element, 0)).toMatchSnapshot();
  });

  it('allows empty `content` to be passed', () => {
    const { root } = render<InterweaveProps>(<Interweave content={null} />);

    expect(root.findAt(Element, 0)).toMatchSnapshot();
  });

  it('allows empty `content` to be passed when using callbacks', () => {
    const { root } = render<InterweaveProps>(
      <Interweave content={null} onBeforeParse={value => value} />,
    );

    expect(root.findAt(Element, 0)).toMatchSnapshot();
  });

  it('renders using a custom container element', () => {
    const { root } = render<InterweaveProps>(
      <Interweave content="<li>Foo</li><li>Bar</li><li>Baz</li>" containerTagName="ul" />,
    );

    expect(root.findAt(Element, 0)).toMatchSnapshot();
  });

  describe('parseMarkup()', () => {
    it('errors if onBeforeParse doesnt return a string', () => {
      expect(() => {
        // @ts-ignore
        render<InterweaveProps>(<Interweave onBeforeParse={() => 123} content="Foo" />);
      }).toThrowErrorMatchingSnapshot();
    });

    it('errors if onAfterParse doesnt return an array', () => {
      expect(() => {
        // @ts-ignore
        render<InterweaveProps>(<Interweave onAfterParse={() => 123} content="Foo" />);
      }).toThrowErrorMatchingSnapshot();
    });

    it('can modify the markup using onBeforeParse', () => {
      const { root } = render<InterweaveProps>(
        <Interweave
          onBeforeParse={content => content.replace(/b>/g, 'i>')}
          content={'Foo <b>Bar</b> Baz'}
        />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('can modify the tree using onAfterParse', () => {
      const { root } = render<InterweaveProps>(
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

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });
  });

  describe('render()', () => {
    it('renders with a default tag name', () => {
      const { root } = render<InterweaveProps>(<Interweave content="Foo" />);

      expect(root.findAt(Element, 0)).toHaveProp('tagName', 'span');
    });

    it('renders with a custom tag name', () => {
      const { root } = render<InterweaveProps>(<Interweave tagName="div" content="Foo" />);

      expect(root.findAt(Element, 0)).toHaveProp('tagName', 'div');
    });

    it('parses HTML', () => {
      const { root } = render<InterweaveProps>(
        <Interweave tagName="div" content={'Foo <b>Bar</b> Baz'} />,
      );

      expect(root.findAt(Element, 0)).toHaveProp('tagName', 'div');
      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });
  });

  describe('parsing and rendering', () => {
    it('handles void elements correctly', () => {
      const { root } = render<InterweaveProps>(
        <Interweave
          tagName="div"
          content={
            'This has line breaks.<br>Horizontal rule.<hr />An image.<img src="http://domain.com/image.jpg" />'
          }
        />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });
  });

  describe('line breaks', () => {
    it('converts line breaks', () => {
      const { root } = render<InterweaveProps>(<Interweave content={'Foo\nBar'} />);

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('converts line breaks if `noHtmlExceptMatchers` is true', () => {
      const { root } = render<InterweaveProps>(
        <Interweave content={'Foo\nBar'} noHtmlExceptMatchers />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('doesnt convert line breaks if `noHtml` is true', () => {
      const { root } = render<InterweaveProps>(<Interweave content={'Foo\nBar'} noHtml />);

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('doesnt convert line breaks if `disableLineBreaks` is true', () => {
      const { root } = render<InterweaveProps>(
        <Interweave content={'Foo\nBar'} disableLineBreaks />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('doesnt convert line breaks if it contains HTML', () => {
      const { root } = render<InterweaveProps>(<Interweave content={'Foo\n<br/>Bar'} />);

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });
  });

  describe('allow list', () => {
    it('filters invalid tags and attributes', () => {
      const { root } = render<InterweaveProps>(<Interweave content={MOCK_INVALID_MARKUP} />);

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('doesnt filter invalid tags and attributes when disabled', () => {
      const { root } = render<InterweaveProps>(
        <Interweave content={MOCK_INVALID_MARKUP} allowElements allowAttributes />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });
  });

  describe('block list', () => {
    it('filters blocked tags and attributes', () => {
      const { root } = render<InterweaveProps>(
        <Interweave content={MOCK_MARKUP} blockList={['aside', 'a']} />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });
  });

  describe('server side rendering', () => {
    let implSpy: jest.SpyInstance;

    beforeEach(() => {
      implSpy = jest
        .spyOn(document.implementation, 'createHTMLDocument')
        .mockImplementation(createHTMLDocument);
    });

    afterEach(() => {
      implSpy.mockRestore();
    });

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

    it('supports styles', () => {
      const actual = ReactDOMServer.renderToStaticMarkup(
        <Interweave content="This is <b style='font-weight: bold'>bold</b>." />,
      );

      expect(actual).toBe('<span>This is <b style="font-weight:bold">bold</b>.</span>');
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
      const { root } = render<InterweaveProps>(
        <Interweave content={'Foo <img/> Bar'} transform={transform} />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('replaces the element', () => {
      const Dummy = () => <div />;
      const transform = (node: HTMLElement) => (node.nodeName === 'IMG' ? <Dummy /> : undefined);
      const { root } = render<InterweaveProps>(
        <Interweave content={'Foo <img/> Bar'} transform={transform} />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('allows blocked', () => {
      const Dummy = () => <iframe title="foo" />;
      const transform = (node: HTMLElement) => (node.nodeName === 'IFRAME' ? <Dummy /> : undefined);
      const { root } = render<InterweaveProps>(
        <Interweave content={'Foo <iframe></iframe> Bar'} transform={transform} />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });
  });

  describe('interleaving', () => {
    const matchers = [new MarkdownBoldMatcher('bold'), new MarkdownItalicMatcher('italic')];

    it('renders them separately', () => {
      const { root } = render<InterweaveProps>(
        <Interweave content="This should be **bold** and this _italic_." matchers={matchers} />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('renders italic in bold', () => {
      const { root } = render<InterweaveProps>(
        <Interweave content="This should be **_italic and bold_**." matchers={matchers} />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });

    it('renders bold in italic', () => {
      const { root } = render<InterweaveProps>(
        <Interweave content="This should be _**bold and italic**_." matchers={matchers} />,
      );

      expect(root.findAt(Element, 0)).toMatchSnapshot();
    });
  });
});

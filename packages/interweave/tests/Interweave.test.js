/* eslint-disable comma-dangle, react/prop-types */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { shallow } from 'enzyme';
import Interweave from '../src/Interweave';
import Element from '../src/Element';
import {
  EXTRA_PROPS,
  MOCK_INVALID_MARKUP,
  LinkFilter,
  CodeTagMatcher,
  matchCodeTag,
} from '../../../tests/mocks';

describe('Interweave', () => {
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
        filters={[new LinkFilter()]}
        content={'Foo <a href="foo.com">Bar</a> Baz'}
      />
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element tagName="a" key="0" attributes={{ href: 'bar.net', target: '_blank' }}>{['Bar']}</Element>,
      ' Baz',
    ]);
  });

  it('can pass object based filters through props', () => {
    const wrapper = shallow(
      <Interweave
        filters={[
          {
            attribute: (name, value) => (
              (name === 'href') ? value.replace('foo.com', 'bar.net') : value
            ),
          },
        ]}
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
        filters={[new LinkFilter()]}
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
      <Element {...EXTRA_PROPS} tagName="span" key="1" customProp="foo">B</Element>,
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
            createElement: (match, props) => (
              <Element key="0" tagName="span" {...props}>
                {props.children.toUpperCase()}
              </Element>
            ),
            match: string => matchCodeTag(string, 'b'),
          },
        ]}
        content="Foo [b] Bar Baz"
      />
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'Foo ',
      <Element {...EXTRA_PROPS} tagName="span" key="0" customProp="foo">B</Element>,
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

  it('allows empty `content` to be passed when using callbacks', () => {
    const wrapper = shallow(<Interweave content={null} onBeforeParse={value => value} />);

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
          filters={[new LinkFilter()]}
          content={'Foo <a href="foo.com">Bar</a> Baz'}
        />
      );

      expect(actual).toBe('<span class="interweave">Foo <a href="bar.net" target="_blank" class="interweave">Bar</a> Baz</span>');
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
  });

  describe('transform prop', () => {
    it('skips the element', () => {
      const transform = node => {
        console.log( node );
        return node.nodeName === 'IMG' ? null : undefined;
      };
      const wrapper = shallow(<Interweave content={'Foo <img/> Bar'} transform={transform} />);

      expect(wrapper.prop('children')).toEqual([
        'Foo ',
        ' Bar',
      ]);
    });
    it('replaces the element', () => {
      const Dummy = props => <div />;
      const transform = node => node.nodeName === 'IMG' ? <Dummy /> : undefined;
      const wrapper = shallow(<Interweave content={'Foo <img/> Bar'} transform={transform} />);

      expect(wrapper.prop('children')).toEqual([
        'Foo ',
        <Dummy key="0" />,
        ' Bar',
      ]);
    });
  });
});

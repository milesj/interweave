import React from 'react';
import { shallow } from 'enzyme';
import Markup from '../src/Markup';
import Element from '../src/Element';
import { MOCK_MARKUP } from '../../../tests/mocks';

describe('Markup', () => {
  it('can change `tagName`', () => {
    const wrapper = shallow(<Markup tagName="p" content="Foo Bar" />);

    expect(wrapper.is(Element)).toBe(true);
    expect(wrapper.prop('tagName')).toBe('p');
  });

  it('can use a fragment', () => {
    const wrapper = shallow(<Markup tagName="fragment" content="Foo Bar" />);

    expect(wrapper.is(Element)).toBe(false);
  });

  it('sets the `noHtml` class name', () => {
    const wrapper = shallow(<Markup noHtml content="Foo Bar" />);

    expect(wrapper.prop('className')).toBe('interweave--no-html');
  });

  it('sets the `noHtmlExceptMatchers` class name', () => {
    const wrapper = shallow(<Markup noHtmlExceptMatchers content="Foo Bar" />);

    expect(wrapper.prop('className')).toBe('interweave--no-html');
  });

  it('allows empty `content` to be passed', () => {
    const wrapper = shallow(<Markup content={null} />);

    expect(wrapper.prop('children')).toBe(null);
  });

  it('will render the `emptyContent` if no content exists', () => {
    const empty = <div>Foo</div>;
    const wrapper = shallow(<Markup content="" emptyContent={empty} />);

    expect(wrapper.contains(empty)).toBe(true);
  });

  it('parses the entire document starting from the body', () => {
    const wrapper = shallow(<Markup content={MOCK_MARKUP} />);

    expect(wrapper.prop('children')).toEqual([
      <Element key="0" tagName="main" attributes={{ role: 'main' }}>
        {[
          '\n  Main content\n  ',
          <Element key="1" tagName="div">
            {[
              '\n    ',
              <Element key="2" tagName="a" attributes={{ href: '#' }}>
                {['Link']}
              </Element>,
              '\n    ',
              <Element key="3" tagName="span" attributes={{ className: 'foo' }}>
                {['String']}
              </Element>,
              '\n  ',
            ]}
          </Element>,
          '\n',
        ]}
      </Element>,
      '\n',
      <Element key="4" tagName="aside" attributes={{ id: 'sidebar' }}>
        {['\n  Sidebar content\n']}
      </Element>,
    ]);
  });

  it('converts line breaks', () => {
    const wrapper = shallow(<Markup content={'Foo\nBar'} />);

    expect(wrapper.prop('children')).toEqual([
      'Foo',
      <Element key="0" tagName="br" selfClose>
        {[]}
      </Element>,
      'Bar',
    ]);
  });

  it('doesnt convert line breaks', () => {
    const wrapper = shallow(<Markup content={'Foo\nBar'} disableLineBreaks />);

    expect(wrapper.prop('children')).toEqual(['Foo\nBar']);
  });

  it('doesnt convert line breaks if it contains HTML', () => {
    const wrapper = shallow(<Markup content={'Foo\n<br/>Bar'} />);

    expect(wrapper.prop('children')).toEqual([
      'Foo\n',
      <Element key="0" tagName="br" selfClose>
        {[]}
      </Element>,
      'Bar',
    ]);
  });
});

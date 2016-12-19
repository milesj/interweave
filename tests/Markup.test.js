import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Markup from '../src/Markup';
import Element from '../src/components/Element';
import { MOCK_MARKUP } from './mocks';

describe('Markup', () => {
  it('sets the `noHtml` class name', () => {
    const wrapper = shallow((
      <Markup
        noHtml
        content="Foo Bar"
      />
    ));

    expect(wrapper.prop('className')).to.equal('interweave--no-html');
  });

  it('allows empty `content` to be passed', () => {
    const wrapper = shallow(<Markup content={null} />);

    expect(wrapper.prop('children')).to.equal(null);
  });

  it('will render the `emptyContent` if no content exists', () => {
    const empty = <div>Foo</div>;
    const wrapper = shallow(<Markup content="" emptyContent={empty} />);

    expect(wrapper.contains(empty)).to.equal(true);
  });

  it('parses the entire document starting from the body', () => {
    const wrapper = shallow(<Markup content={MOCK_MARKUP} />);

    expect(wrapper.prop('children')).to.deep.equal([
      '\n  ',
      <Element key="0" tagName="main" attributes={{ role: 'main' }}>
        {[
          '\n    Main content\n    ',
          <Element key="1" tagName="div">
            {[
              '\n      ',
              <Element key="2" tagName="a" attributes={{ href: '#' }}>
                {['Link']}
              </Element>,
              '\n      ',
              <Element key="3" tagName="span" attributes={{ className: 'foo' }}>
                {['String']}
              </Element>,
              '\n    ',
            ]}
          </Element>,
          '\n  ',
        ]}
      </Element>,
      '\n  ',
      <Element key="4" tagName="aside" attributes={{ id: 'sidebar' }}>
        {['\n    Sidebar content\n  ']}
      </Element>,
      '\n\n',
    ]);
  });

  it('converts line breaks', () => {
    const wrapper = shallow(<Markup content={'Foo\nBar'} />);

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo',
      <Element key="0" tagName="br" selfClose>{[]}</Element>,
      'Bar',
    ]);
  });

  it('doesnt convert line breaks', () => {
    const wrapper = shallow(<Markup content={'Foo\nBar'} disableLineBreaks />);

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo\nBar',
    ]);
  });

  it('doesnt convert line breaks if it contains HTML', () => {
    const wrapper = shallow(<Markup content={'Foo\n<br/>Bar'} />);

    expect(wrapper.prop('children')).to.deep.equal([
      'Foo\n',
      <Element key="0" tagName="br" selfClose>{[]}</Element>,
      'Bar',
    ]);
  });
});

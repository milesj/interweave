import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Markup from '../lib/Markup';
import Element from '../lib/components/Element';
import { MOCK_MARKUP } from './mocks';

describe('Markup', () => {
  it('parses the entire document starting from the body', () => {
    const wrapper = shallow(<Markup markup={MOCK_MARKUP} />);

    expect(wrapper.prop('children')).to.deep.equal([
      '\n  ',
      <Element key="0" tagName="main" attributes={{ role: 'main' }}>
        {[
          '\n    Main content\n    ',
          <Element key="1" tagName="div" attributes={{}}>
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
});

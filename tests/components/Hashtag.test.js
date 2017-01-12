import React from 'react';
import { shallow } from 'enzyme';
import Hashtag from '../../src/components/Hashtag';

describe('components/Hashtag', () => {
  it('can define the URL', () => {
    const wrapper = shallow(<Hashtag hashtagUrl="http://foo.com/{{hashtag}}">#interweave</Hashtag>);

    expect(wrapper.prop('children')).toBe('#interweave');
    expect(wrapper.prop('href')).toBe('http://foo.com/interweave');
  });

  it('can encode the hashtag', () => {
    const wrapper = shallow(<Hashtag encodeHashtag preserveHash>#interweave</Hashtag>);

    expect(wrapper.prop('children')).toBe('#interweave');
    expect(wrapper.prop('href')).toBe('%23interweave');
  });

  it('can pass props to Link', () => {
    const func = () => {};
    const wrapper = shallow(<Hashtag onClick={func} newWindow>#interweave</Hashtag>);

    expect(wrapper.find('Link').prop('newWindow')).toBe(true);
    expect(wrapper.find('Link').prop('onClick')).toBe(func);
  });
});

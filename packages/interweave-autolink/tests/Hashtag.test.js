import React from 'react';
import { shallow } from 'enzyme';
import Hashtag from '../src/Hashtag';

describe('components/Hashtag', () => {
  it('can define the URL', () => {
    const wrapper = shallow(<Hashtag hashtagUrl="http://foo.com/{{hashtag}}">#interweave</Hashtag>);

    expect(wrapper.prop('children')).toBe('#interweave');
    expect(wrapper.prop('href')).toBe('http://foo.com/interweave');
  });

  it('can define the URL with a function', () => {
    const wrapper = shallow(
      <Hashtag
        hashtagUrl={tag => `http://foo.com/${tag.toUpperCase()}`}
      >
        #interweave
      </Hashtag>,
    );

    expect(wrapper.prop('children')).toBe('#interweave');
    expect(wrapper.prop('href')).toBe('http://foo.com/INTERWEAVE');
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

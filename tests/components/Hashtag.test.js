import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Hashtag from '../../lib/components/Hashtag';

describe('components/Hashtag', () => {
  it('can define the URL', () => {
    const wrapper = shallow(<Hashtag hashtagUrl="http://foo.com/{{hashtag}}">#interweave</Hashtag>);

    expect(wrapper.prop('children')).to.equal('#interweave');
    expect(wrapper.prop('href')).to.equal('http://foo.com/interweave');
  });

  it('can encode the hashtag', () => {
    const wrapper = shallow(<Hashtag encodeHashtag preserveHash>#interweave</Hashtag>);

    expect(wrapper.prop('children')).to.equal('#interweave');
    expect(wrapper.prop('href')).to.equal('%23interweave');
  });

  it('can pass props to Link', () => {
    const func = () => {};
    const wrapper = shallow(<Hashtag onClick={func} newWindow>#interweave</Hashtag>);

    expect(wrapper.find('Link').prop('newWindow')).to.equal(true);
    expect(wrapper.find('Link').prop('onClick')).to.equal(func);
  });
});

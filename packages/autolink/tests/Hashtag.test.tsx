import React from 'react';
import { render } from 'rut';
import Hashtag, { HashtagProps } from '../src/Hashtag';
import Link from '../src/Link';

describe('components/Hashtag', () => {
  it('can define the URL', () => {
    const { root } = render<HashtagProps>(
      <Hashtag hashtagName="interweave" hashtagUrl="http://foo.com/{{hashtag}}">
        #interweave
      </Hashtag>,
    );

    expect(root).toContainNode('#interweave');
    expect(root.findOne(Link)).toHaveProp('href', 'http://foo.com/interweave');
  });

  it('can define the URL with a function', () => {
    const { root } = render<HashtagProps>(
      <Hashtag hashtagName="interweave" hashtagUrl={tag => `http://foo.com/${tag.toUpperCase()}`}>
        #interweave
      </Hashtag>,
    );

    expect(root).toContainNode('#interweave');
    expect(root.findOne(Link)).toHaveProp('href', 'http://foo.com/INTERWEAVE');
  });

  it('can encode the hashtag', () => {
    const { root } = render<HashtagProps>(
      <Hashtag hashtagName="interweave" encodeHashtag preserveHash>
        #interweave
      </Hashtag>,
    );

    expect(root).toContainNode('#interweave');
    expect(root.findOne(Link)).toHaveProp('href', '%23interweave');
  });

  it('can pass props to Link', () => {
    const func = () => {};
    const { root } = render<HashtagProps>(
      <Hashtag hashtagName="interweave" onClick={func} newWindow>
        #interweave
      </Hashtag>,
    );

    expect(root.findOne(Link)).toHaveProp('newWindow', true);
    expect(root.findOne(Link)).toHaveProp('onClick', func);
  });
});

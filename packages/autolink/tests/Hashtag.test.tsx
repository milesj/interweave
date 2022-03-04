import React from 'react';
import { render } from '@testing-library/react';
import Hashtag from '../src/Hashtag';

describe('components/Hashtag', () => {
  it('can define the URL', () => {
    render(
      <Hashtag hashtag="#interweave" hashtagUrl="http://foo.com/{{hashtag}}">
        #interweave
      </Hashtag>,
    );

    const el = document.querySelector('a');

    expect(el).toHaveTextContent('#interweave');
    expect(el).toHaveProperty('href', 'http://foo.com/interweave');
  });

  it('can define the URL with a function', () => {
    render(
      <Hashtag hashtag="#interweave" hashtagUrl={(tag) => `http://foo.com/${tag.toUpperCase()}`}>
        #interweave
      </Hashtag>,
    );

    const el = document.querySelector('a');

    expect(el).toHaveTextContent('#interweave');
    expect(el).toHaveProperty('href', 'http://foo.com/INTERWEAVE');
  });

  it('can encode the hashtag', () => {
    render(
      <Hashtag hashtag="#interweave" encodeHashtag preserveHash>
        #interweave
      </Hashtag>,
    );

    const el = document.querySelector('a');

    expect(el).toHaveTextContent('#interweave');
    expect(el).toHaveProperty('href', 'http://localhost/%23interweave');
  });

  it('can pass props to Link', () => {
    const func = () => {};

    render(
      <Hashtag hashtag="#interweave" onClick={func} newWindow>
        #interweave
      </Hashtag>,
    );

    expect(document.querySelector('a')).toHaveProperty('target', '_blank');
  });
});

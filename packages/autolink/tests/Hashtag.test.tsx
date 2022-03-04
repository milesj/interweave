import React from 'react';
import { render } from 'rut-dom';
import { Hashtag } from '../src/Hashtag';
import { Link } from '../src/Link';
import { HashtagProps } from '../src/types';

describe('components/Hashtag', () => {
	it('can define the URL', () => {
		const { root } = render<HashtagProps>(
			<Hashtag hashtag="#interweave" hashtagUrl="http://foo.com/{{hashtag}}">
				#interweave
			</Hashtag>,
		);

		expect(root).toContainNode('#interweave');
		expect(root.findOne(Link)).toHaveProp('href', 'http://foo.com/interweave');
	});

	it('can define the URL with a function', () => {
		const { root } = render<HashtagProps>(
			<Hashtag hashtag="#interweave" hashtagUrl={(tag) => `http://foo.com/${tag.toUpperCase()}`}>
				#interweave
			</Hashtag>,
		);

		expect(root).toContainNode('#interweave');
		expect(root.findOne(Link)).toHaveProp('href', 'http://foo.com/INTERWEAVE');
	});

	it('can encode the hashtag', () => {
		const { root } = render<HashtagProps>(
			<Hashtag encodeHashtag preserveHash hashtag="#interweave">
				#interweave
			</Hashtag>,
		);

		expect(root).toContainNode('#interweave');
		expect(root.findOne(Link)).toHaveProp('href', '%23interweave');
	});

	it('can pass props to Link', () => {
		const func = () => {};
		const { root } = render<HashtagProps>(
			<Hashtag newWindow hashtag="#interweave" onClick={func}>
				#interweave
			</Hashtag>,
		);

		expect(root.findOne(Link)).toHaveProp('newWindow', true);
		expect(root.findOne(Link)).toHaveProp('onClick', func);
	});
});

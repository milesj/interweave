import React from 'react';
import { render } from 'rut-dom';
import { Link } from '../src/Link';
import { Mention } from '../src/Mention';
import { MentionProps } from '../src/types';

describe('components/Mention', () => {
	it('can define the URL', () => {
		const { root } = render<MentionProps>(
			<Mention mention="@interweave" mentionUrl="http://foo.com/{{mention}}">
				@interweave
			</Mention>,
		);

		expect(root).toContainNode('@interweave');
		expect(root.findOne(Link)).toHaveProp('href', 'http://foo.com/@interweave');
	});

	it('can define the URL with a function', () => {
		const { root } = render<MentionProps>(
			<Mention
				mention="@interweave"
				mentionUrl={(mention) => `http://foo.com/${mention.toUpperCase()}`}
			>
				@interweave
			</Mention>,
		);

		expect(root).toContainNode('@interweave');
		expect(root.findOne(Link)).toHaveProp('href', 'http://foo.com/@INTERWEAVE');
	});

	it('can pass props to Link', () => {
		const func = () => {};
		const { root } = render<MentionProps>(
			<Mention
				newWindow
				mention="@interweave"
				mentionUrl="http://foo.com/{{mention}}"
				onClick={func}
			>
				@interweave
			</Mention>,
		);

		expect(root.findOne(Link)).toHaveProp('newWindow', true);
		expect(root.findOne(Link)).toHaveProp('onClick', func);
	});

	it('when mentionUrl not passed returns null', () => {
		const result = render<MentionProps>(
			<Mention newWindow mention="@interweave" mentionUrl={undefined as never}>
				@interweave
			</Mention>,
		);

		expect(result.toTree()?.rendered).toBeNull();
	});
});

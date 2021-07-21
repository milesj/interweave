import React from 'react';
import { mockSyntheticEvent, render } from 'rut-dom';
import { Link } from '../src/Link';
import { LinkProps } from '../src/types';

describe('components/Link', () => {
	it('renders a link with href', () => {
		const { root } = render<LinkProps>(<Link href="/home">Foo</Link>);

		expect(root.findOne('a')).toHaveProp('href', '/home');
		expect(root).toContainNode('Foo');
	});

	it('can set and trigger an onClick', () => {
		const spy = jest.fn();
		const { root } = render<LinkProps>(
			<Link href="/blog" onClick={spy}>
				Foo
			</Link>,
		);

		expect(root.findOne('a')).toHaveProp('onClick', spy);

		root.findOne('a').dispatch('onClick', {}, mockSyntheticEvent('onClick'));

		expect(spy).toHaveBeenCalled();
	});

	it('can set target blank via newWindow', () => {
		const { root, update } = render<LinkProps>(<Link href="/forums">Foo</Link>);

		expect(root.findOne('a')).not.toHaveProp('target');

		update({ newWindow: true });

		expect(root.findOne('a')).toHaveProp('target', '_blank');
	});
});

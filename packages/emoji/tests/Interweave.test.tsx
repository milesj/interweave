import React from 'react';
import { Element, Interweave, InterweaveProps } from 'interweave';
import { SOURCE_PROP } from 'interweave/test';
import { render } from 'rut-dom';
import { emojiEmoticonMatcher, emojiShortcodeMatcher, emojiUnicodeMatcher } from '../src/matchers';
import { mockEmojiData } from '../src/test';

mockEmojiData('en', '0.0.0');

describe('Interweave (with emoji)', () => {
	it('renders all types', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				emojiEnlargeThreshold="2em"
				content={
					'This will convert 🐱 \uD83D\uDC36 :man: :3 all 3 emoji types to PNGs and increase the size.'
				}
				emojiLargeSize="2em"
				emojiSource={SOURCE_PROP}
				matchers={[emojiEmoticonMatcher, emojiShortcodeMatcher, emojiUnicodeMatcher]}
				tagName="div"
			/>,
		);

		expect(root.find('img')).toHaveLength(4);
	});

	it('renders emoji shortcode as unicode', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				content="This has :cat: and :dog: shortcodes."
				emojiSource={SOURCE_PROP}
				matchers={[emojiShortcodeMatcher]}
				tagName="div"
			/>,
		);

		expect(root.findAt(Element, 'first')).toMatchSnapshot();
	});

	it('renders emoji unicode (literals) as unicode', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				content="This has 🐈️ and 🐕️ shortcodes."
				emojiSource={SOURCE_PROP}
				matchers={[emojiUnicodeMatcher]}
				tagName="div"
			/>,
		);

		expect(root.findAt(Element, 'first')).toMatchSnapshot();
	});

	it('renders emoji unicode (escapes) as unicode', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				content={'This has \uD83D\uDC31 and \uD83D\uDC36 shortcodes.'}
				emojiSource={SOURCE_PROP}
				matchers={[emojiUnicodeMatcher]}
				tagName="div"
			/>,
		);

		expect(root.findAt(Element, 'first')).toMatchSnapshot();
	});

	it('renders a single emoji enlarged', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				content=":cat:"
				emojiSource={SOURCE_PROP}
				matchers={[emojiShortcodeMatcher, emojiUnicodeMatcher]}
				tagName="div"
			/>,
		);

		expect(root.findAt(Element, 'first')).toMatchSnapshot();
	});
});

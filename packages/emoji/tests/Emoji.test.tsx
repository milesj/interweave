import React from 'react';
import { SOURCE_PROP, VALID_EMOJIS } from 'interweave/test';
import { render } from 'rut-dom';
import Emoji from '../src/Emoji';
import { EmojiProps } from '../src/types';

describe('Emoji', () => {
	const [[hexcode, unicode, shortcode, emoticon]] = VALID_EMOJIS;

	it('errors if no emoticon, shortcode or unicode', () => {
		expect(() =>
			render<EmojiProps>(<Emoji emojiSource={SOURCE_PROP} />),
		).toThrowErrorMatchingSnapshot();
	});

	it('returns value for invalid hexcode', () => {
		const { root } = render<EmojiProps>(<Emoji emojiSource={SOURCE_PROP} hexcode="FA" />);

		expect(root.findOne('span')).toMatchSnapshot();
	});

	it('returns value for invalid emoticon', () => {
		const { root } = render<EmojiProps>(<Emoji emojiSource={SOURCE_PROP} emoticon="0P" />);

		expect(root.findOne('span')).toMatchSnapshot();
	});

	it('returns value for invalid shortcode', () => {
		const { root } = render<EmojiProps>(<Emoji emojiSource={SOURCE_PROP} shortcode="fake" />);

		expect(root.findOne('span')).toMatchSnapshot();
	});

	it('returns empty for invalid unicode', () => {
		const { root } = render<EmojiProps>(<Emoji emojiSource={SOURCE_PROP} unicode="fake" />);

		expect(root.findOne('span')).toMatchSnapshot();
	});

	it('renders with only the emoticon', () => {
		const { root } = render<EmojiProps>(<Emoji emojiSource={SOURCE_PROP} emoticon={emoticon} />);

		expect(root.findOne('img')).toMatchSnapshot();
	});

	it('renders with only the shortcode', () => {
		const { root } = render<EmojiProps>(<Emoji emojiSource={SOURCE_PROP} shortcode={shortcode} />);

		expect(root.findOne('img')).toMatchSnapshot();
	});

	it('renders with only the hexcode', () => {
		const { root } = render<EmojiProps>(<Emoji emojiSource={SOURCE_PROP} hexcode={hexcode} />);

		expect(root.findOne('img')).toMatchSnapshot();
	});

	it('renders with only the unicode', () => {
		const { root } = render<EmojiProps>(<Emoji emojiSource={SOURCE_PROP} unicode={unicode} />);

		expect(root.findOne('img')).toMatchSnapshot();
	});

	it('renders with both', () => {
		const { root } = render<EmojiProps>(
			<Emoji emojiSource={SOURCE_PROP} shortcode={shortcode} unicode={unicode} />,
		);

		expect(root.findOne('img')).toMatchSnapshot();
	});

	it('renders the unicode character', () => {
		const { root } = render<EmojiProps>(
			<Emoji emojiSource={SOURCE_PROP} unicode={unicode} renderUnicode />,
		);

		expect(root.findOne('span')).toMatchSnapshot();
	});

	it('can define the path', () => {
		const { root } = render<EmojiProps>(
			<Emoji
				emojiSource={SOURCE_PROP}
				shortcode={shortcode}
				unicode={unicode}
				emojiPath="http://foo.com/path/to/{{hexcode}}.svg"
			/>,
		);
		const img = root.findOne('img');

		expect(img).toHaveProp('alt', unicode);
		expect(img).toHaveProp('src', `http://foo.com/path/to/${hexcode}.svg`);
	});

	it('can define the path with a function', () => {
		const { root } = render<EmojiProps>(
			<Emoji
				emojiSource={SOURCE_PROP}
				shortcode={shortcode}
				unicode={unicode}
				emojiPath={(hex) => `http://foo.com/path/to/${hex.toLowerCase()}.svg`}
			/>,
		);
		const img = root.findOne('img');

		expect(img).toHaveProp('alt', unicode);
		expect(img).toHaveProp('src', `http://foo.com/path/to/${hexcode.toLowerCase()}.svg`);
	});

	it('path function receives enlarge and size', () => {
		const { root } = render<EmojiProps>(
			<Emoji
				emojiSource={SOURCE_PROP}
				shortcode={shortcode}
				unicode={unicode}
				emojiPath={(hex, { size }) => `http://foo.com/path/to/${size}/${hex.toLowerCase()}.svg`}
				emojiLargeSize={4}
				emojiSize={2}
				enlargeEmoji
			/>,
		);

		expect(root.findOne('img')).toHaveProp(
			'src',
			`http://foo.com/path/to/4/${hexcode.toLowerCase()}.svg`,
		);
	});

	it('sets styles when size is defined', () => {
		const { root } = render<EmojiProps>(
			<Emoji emojiSource={SOURCE_PROP} emojiSize={1} shortcode={shortcode} unicode={unicode} />,
		);

		expect(root.findOne('img')).toHaveProp('style', {
			display: 'inline-block',
			verticalAlign: 'middle',
			width: 1,
			height: 1,
		});
	});

	it('can customize large size', () => {
		const { root } = render<EmojiProps>(
			<Emoji
				emojiSource={SOURCE_PROP}
				shortcode={shortcode}
				unicode={unicode}
				emojiSize={2}
				emojiLargeSize={5}
				enlargeEmoji
			/>,
		);

		expect(root.findOne('img')).toHaveProp('style', {
			display: 'inline-block',
			verticalAlign: 'middle',
			width: 5,
			height: 5,
		});
	});

	it('can use string sizes', () => {
		const { root } = render<EmojiProps>(
			<Emoji emojiSource={SOURCE_PROP} shortcode={shortcode} unicode={unicode} emojiSize="2em" />,
		);

		expect(root.findOne('img')).toHaveProp('style', {
			display: 'inline-block',
			verticalAlign: 'middle',
			width: '2em',
			height: '2em',
		});
	});
});

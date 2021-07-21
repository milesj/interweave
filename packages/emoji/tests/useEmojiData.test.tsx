import React from 'react';
import { Locale, MetadataDataset, ShortcodesDataset } from 'emojibase';
import { mockFetch, MockFetchResult, renderAndWait } from 'rut-dom';
import { resetInstances } from '../src/EmojiDataManager';
import { mockEmojiData } from '../src/test';
import { CanonicalEmoji, Source, UseEmojiDataOptions } from '../src/types';
import useEmojiData, { determinePresets, resetLoaded } from '../src/useEmojiData';

function cdn(locale: Locale, version: string = '1.0.0', type: string = 'data') {
	return `https://cdn.jsdelivr.net/npm/emojibase-data@${version}/${locale}/${type}.json`;
}

function cdnMeta(locale: Locale, version?: string) {
	return cdn(locale, version, 'meta');
}

function cdnShortcodes(preset: string, locale: Locale, version?: string) {
	return cdn(locale, version, `shortcodes/${preset}`);
}

describe('useEmojiData()', () => {
	type Props = UseEmojiDataOptions;

	function TestComp(props: { emojis: CanonicalEmoji[]; source: Source }) {
		return null;
	}

	function EmojiData(props: Props) {
		const [emojis, source] = useEmojiData({
			shortcodes: ['emojibase'],
			version: '1.0.0',
			...props,
		});

		return <TestComp emojis={emojis} source={source} />;
	}

	const mockEmojis: CanonicalEmoji[] = [
		{
			annotation: 'grinning face',
			canonical_shortcodes: [':gleeful:'],
			emoji: '😀',
			group: 0,
			hexcode: '1F600',
			order: 1,
			primary_shortcode: ':gleeful:',
			shortcodes: ['gleeful'],
			skins: [],
			subgroup: 0,
			tags: ['face', 'grin'],
			text: '',
			type: 1,
			unicode: '😀',
			version: 1,
		},
	];

	const mockShortcodes: ShortcodesDataset = {
		'1F600': ['gleeful'],
	};

	const mockMessages: MetadataDataset = {
		groups: [],
		subgroups: [],
	};

	let fetchSpy: MockFetchResult;

	beforeEach(() => {
		process.env.INTERWEAVE_ALLOW_FETCH_EMOJI = 'true';

		fetchSpy = mockFetch('/', 200)
			// Emojis
			.get(cdn('en', '1.0.0'), mockEmojis)
			.get(cdn('en', '1.0.0', 'compact'), mockEmojis) // Compact
			.get(cdn('it', '1.0.0'), mockEmojis)
			.get(cdn('de', '2.0.0'), mockEmojis)
			.get(cdn('ja', '1.2.3'), []) // No data
			.get(cdn('fr', '1.0.0'), 404) // Not found
			.get(cdn('fr', '2.0.0'), 404) // Not found
			// Shortcodes
			.get(cdnShortcodes('emojibase', 'en', '1.0.0'), mockShortcodes)
			.get(cdnShortcodes('emojibase', 'en', '2.0.0'), mockShortcodes)
			.get(cdnShortcodes('emojibase', 'en', '1.2.3'), mockShortcodes)
			.get(cdnShortcodes('emojibase', 'it', '1.0.0'), mockShortcodes)
			.get(cdnShortcodes('emojibase', 'de', '2.0.0'), mockShortcodes)
			.get(cdnShortcodes('emojibase', 'ja', '1.2.3'), mockShortcodes)
			// Messages
			.get(cdnMeta('en', '1.0.0'), mockMessages)
			.get(cdnMeta('it', '1.0.0'), mockMessages)
			.get(cdnMeta('de', '2.0.0'), mockMessages)
			.get(cdnMeta('fr', '2.0.0'), mockMessages)
			.get(cdnMeta('ja', '1.2.3'), mockMessages)
			.spy();

		// Emojibase caches requests
		sessionStorage.clear();
		resetLoaded();
		resetInstances();
	});

	it('fetches data on mount', async () => {
		const result = await renderAndWait<Props>(<EmojiData />);

		expect(fetchSpy.called(cdn('en'))).toBe(true);
		expect(fetchSpy.called(cdnMeta('en'))).toBe(true);
		expect(fetchSpy.called(cdnShortcodes('emojibase', 'en'))).toBe(true);

		expect(result.root.findOne(TestComp)).toHaveProp('emojis', mockEmojis);
	});

	it('doesnt fetch multiple times', async () => {
		const result = await renderAndWait<Props>(<EmojiData />);

		await result.updateAndWait();
		await result.updateAndWait();
		await result.updateAndWait();

		expect(fetchSpy.calls()).toHaveLength(3); // emojis + shortcodes + meta
	});

	it('doesnt fetch if `avoidFetch` is true', async () => {
		await renderAndWait<Props>(<EmojiData avoidFetch />);

		expect(fetchSpy.calls()).toHaveLength(0);
	});

	it('re-fetches data if a prop changes', async () => {
		const result = await renderAndWait<Props>(<EmojiData locale="ja" version="1.2.3" />);

		expect(fetchSpy.called(cdn('ja', '1.2.3'))).toBe(true);
		expect(fetchSpy.called(cdnMeta('ja', '1.2.3'))).toBe(true);
		expect(fetchSpy.called(cdnShortcodes('emojibase', 'ja', '1.2.3'))).toBe(true);

		await result.updateAndWait({
			locale: 'de',
			version: '2.0.0',
		});

		expect(fetchSpy.called(cdn('de', '2.0.0'))).toBe(true);
		expect(fetchSpy.called(cdnMeta('de', '2.0.0'))).toBe(true);
		expect(fetchSpy.called(cdnShortcodes('emojibase', 'de', '2.0.0'))).toBe(true);
	});

	it('supports compact datasets', async () => {
		await renderAndWait<Props>(<EmojiData compact />);

		expect(fetchSpy.called(cdn('en', '1.0.0', 'compact'))).toBe(true);
	});

	it('supports multiple locales', async () => {
		const result = await renderAndWait<Props>(<EmojiData locale="de" version="2.0.0" />);

		expect(fetchSpy.called(cdn('de', '2.0.0'))).toBe(true);
		expect(fetchSpy.called(cdnMeta('de', '2.0.0'))).toBe(true);
		expect(fetchSpy.called(cdnShortcodes('emojibase', 'de', '2.0.0'))).toBe(true);

		await result.rerenderAndWait(<EmojiData locale="it" />);

		expect(fetchSpy.called(cdn('it'))).toBe(true);
		expect(fetchSpy.called(cdnMeta('it'))).toBe(true);
		expect(fetchSpy.called(cdnShortcodes('emojibase', 'it', '1.0.0'))).toBe(true);
	});

	it('re-throws errors', async () => {
		const result = await renderAndWait<Props>(<EmojiData />);

		await result.updateAndWait({
			locale: 'fr',
			version: '2.0.0',
			throwErrors: false,
		});

		try {
			result.update({
				locale: 'fr',
				version: '1.0.0',
				throwErrors: true,
			});

			expect(false).toBe(true);
		} catch (error) {
			expect(error).toEqual(new Error('Failed to load Emojibase dataset.'));
		}
	});

	it('reads from the data manager cache', async () => {
		mockEmojiData('ko');

		await renderAndWait<Props>(<EmojiData locale="ko" />);

		expect(fetchSpy.calls()).toHaveLength(0);
	});
});

describe('determinePresets()', () => {
	it('returns emojibase if empty', () => {
		expect(determinePresets('en', [])).toEqual(['emojibase']);
	});

	it('returns emojibase with english if empty and non-en', () => {
		expect(determinePresets('fr', [])).toEqual(['emojibase', 'en/emojibase']);
	});

	it('doesnt double add english emojibase', () => {
		expect(determinePresets('fr', ['emojibase', 'en/emojibase'])).toEqual([
			'emojibase',
			'en/emojibase',
		]);
	});

	it('returns as-is if no emojibase', () => {
		expect(determinePresets('de', ['cldr'])).toEqual(['cldr']);
	});

	it('returns english emojibase when provided and non-en', () => {
		expect(determinePresets('ja', ['cldr', 'emojibase'])).toEqual([
			'cldr',
			'emojibase',
			'en/emojibase',
		]);
	});
});

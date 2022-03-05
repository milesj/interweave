import {
	Emoji,
	EMOTICON_OPTIONS,
	fromCodepointToUnicode,
	fromHexcodeToCodepoint,
	generateEmoticonPermutations,
	GroupKey,
	Hexcode,
	Locale,
	MessagesDataset,
	SkinToneKey,
	SubgroupKey,
	TEXT,
} from 'emojibase';
import { CanonicalEmoji } from './types';

const instances = new Map<string, EmojiDataManager>();

export function resetInstances() {
	if (__DEV__) {
		instances.clear();
	}
}

export class EmojiDataManager {
	EMOJIS: Record<string, CanonicalEmoji> = {};

	EMOTICON_TO_HEXCODE: Record<string, Hexcode> = {};

	SHORTCODE_TO_HEXCODE: Record<string, Hexcode> = {};

	UNICODE_TO_HEXCODE: Record<string, Hexcode> = {};

	GROUPS_BY_KEY: Partial<Record<GroupKey, string>> = {};

	SKIN_TONES_BY_KEY: Partial<Record<SkinToneKey, string>> = {};

	SUBGROUPS_BY_KEY: Partial<Record<SubgroupKey, string>> = {};

	data: CanonicalEmoji[] = [];

	flatData: CanonicalEmoji[] = [];

	locale: Locale = 'en';

	version: string = '0.0.0';

	constructor(locale: Locale, version: string) {
		this.locale = locale;
		this.version = version;
	}

	/**
	 * Return or create a singleton instance per locale.
	 */
	static getInstance(locale: Locale, version: string): EmojiDataManager {
		const key = `${locale}:${version}`;

		if (!instances.has(key)) {
			instances.set(key, new EmojiDataManager(locale, version));
		}

		return instances.get(key)!;
	}

	/**
	 * Return dataset as a list.
	 */
	getData(): CanonicalEmoji[] {
		return this.data;
	}

	/**
	 * Return dataset as a flattened list.
	 */
	getFlatData(): CanonicalEmoji[] {
		return this.flatData;
	}

	/**
	 * Package the emoji object with additional data,
	 * while also extracting and partitioning relevant information.
	 */
	packageEmoji(baseEmoji: Emoji): CanonicalEmoji {
		const { emoticon, hexcode, shortcodes = [] } = baseEmoji;
		const emoji: CanonicalEmoji = {
			...baseEmoji,
			canonical_shortcodes: [],
			primary_shortcode: '',
			skins: [],
			unicode: '',
		};

		// Make our lives easier
		if (!emoji.unicode) {
			emoji.unicode = emoji.text && emoji.type === TEXT ? emoji.text : emoji.emoji;
		}

		// Canonicalize the shortcodes for easy reuse
		emoji.canonical_shortcodes = shortcodes.map((code) => `:${code}:`);
		emoji.primary_shortcode = emoji.canonical_shortcodes[0];

		// Support all shortcodes
		emoji.canonical_shortcodes.forEach((shortcode) => {
			this.SHORTCODE_TO_HEXCODE[shortcode] = hexcode;
		});

		// Support all emoticons
		if (emoticon) {
			const emoticons = Array.isArray(emoticon) ? emoticon : [emoticon];

			emoticons.forEach((emo) => {
				generateEmoticonPermutations(emo, EMOTICON_OPTIONS[emo]).forEach((e) => {
					this.EMOTICON_TO_HEXCODE[e] = hexcode;
				});
			});
		}

		// Support all presentations (even no variation selectors)
		this.UNICODE_TO_HEXCODE[fromCodepointToUnicode(fromHexcodeToCodepoint(hexcode))] = hexcode;

		if (emoji.emoji) {
			this.UNICODE_TO_HEXCODE[emoji.emoji] = hexcode;
		}

		if (emoji.text) {
			this.UNICODE_TO_HEXCODE[emoji.text] = hexcode;
		}

		// Map each emoji
		this.EMOJIS[hexcode] = emoji;

		// Apply same logic to all variations
		if (baseEmoji.skins) {
			emoji.skins = baseEmoji.skins.map((skinEmoji) => this.packageEmoji(skinEmoji));
		}

		return emoji;
	}

	/**
	 * Parse and generate emoji datasets.
	 */
	parseEmojiData(data: Emoji[]): CanonicalEmoji[] {
		data.forEach((emoji) => {
			const packagedEmoji = this.packageEmoji(emoji);

			this.data.push(packagedEmoji);
			this.flatData.push(packagedEmoji);

			// Flatten and package skins as well
			if (packagedEmoji.skins) {
				packagedEmoji.skins.forEach((skin) => {
					this.flatData.push(skin);
				});
			}
		});

		return this.data;
	}

	parseMessageData(data: MessagesDataset) {
		if (data.groups) {
			data.groups.forEach((group) => {
				this.GROUPS_BY_KEY[group.key] = group.message;
			});
		}

		if (data.subgroups) {
			data.subgroups.forEach((group) => {
				this.SUBGROUPS_BY_KEY[group.key] = group.message;
			});
		}

		if (data.skinTones) {
			data.skinTones.forEach((skinTone) => {
				this.SKIN_TONES_BY_KEY[skinTone.key] = skinTone.message;
			});
		}
	}
}

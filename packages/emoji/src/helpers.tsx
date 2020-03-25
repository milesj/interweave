import React from 'react';
import { Node } from 'interweave/src/createMatcher';
import Emoji from './Emoji';
import { EmojiRequiredProps, EmojiMatch } from './types';

export function factory(content: unknown, match: EmojiMatch, { emojiSource }: EmojiRequiredProps) {
  return <Emoji {...match} source={emojiSource} />;
}

export function onBeforeParse(content: string, props: EmojiRequiredProps): string {
  if (__DEV__) {
    if (!props.emojiSource) {
      throw new Error(
        'Missing emoji source data. Have you loaded with the `useEmojiData` hook and passed the `emojiSource` prop?',
      );
    }
  }

  return content;
}

export function onAfterParse(content: Node[], props: EmojiRequiredProps): Node[] {
  if (content.length === 0) {
    return content;
  }

  let valid = false;
  let count = 0;

  // Use a for-loop, as it's much cleaner than some()
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < content.length; i += 1) {
    const item = content[i];

    if (typeof item === 'string') {
      // Allow whitespace but disallow strings
      if (!item.match(/^\s+$/)) {
        valid = false;
        break;
      }
    } else if (React.isValidElement(item)) {
      // Only count towards emojis
      if (item && item.type === Emoji) {
        count += 1;
        valid = true;

        if (count > 1) {
          valid = false;
          break;
        }

        // Abort early for non-emoji components
      } else {
        valid = false;
        break;
      }
    } else {
      valid = false;
      break;
    }
  }

  if (!valid) {
    return content;
  }

  return content.map(item => {
    if (!React.isValidElement(item)) {
      return item;
    }

    return React.cloneElement(item, {
      ...item.props,
      enlargeEmoji: true,
    });
  });
}

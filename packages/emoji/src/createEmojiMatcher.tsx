import React from 'react';
import { createMatcher, OnMatch, MatcherFactory, Node } from 'interweave';
import Emoji from './Emoji';
import { EmojiMatch, InterweaveEmojiProps, EmojiProps } from './types';

function factory(match: EmojiMatch, { emojiSource }: InterweaveEmojiProps) {
  return <Emoji {...match} source={emojiSource} />;
}

function onBeforeParse(content: string, { emojiSource }: InterweaveEmojiProps): string {
  if (__DEV__) {
    if (!emojiSource) {
      throw new Error(
        'Missing emoji source data. Have you loaded with the `useEmojiData` hook and passed the `emojiSource` prop?',
      );
    }
  }

  return content;
}

function onAfterParse(
  content: Node[],
  { emojiEnlargeThreshold = 1 }: InterweaveEmojiProps,
): Node[] {
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

        if (count > emojiEnlargeThreshold) {
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
    if (!React.isValidElement<EmojiProps>(item)) {
      return item;
    }

    return React.cloneElement(item, {
      ...item.props,
      enlarged: true,
    });
  });
}

export default function createEmojiMatcher(
  pattern: RegExp,
  onMatch: OnMatch<EmojiMatch, InterweaveEmojiProps>,
  customFactory: MatcherFactory<EmojiMatch, InterweaveEmojiProps> = factory,
) {
  return createMatcher<EmojiMatch, InterweaveEmojiProps>(pattern, customFactory, {
    greedy: true,
    onAfterParse,
    onBeforeParse,
    onMatch,
    tagName: 'img',
    void: true,
  });
}

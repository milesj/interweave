import { EmojiRequiredProps } from './types';

/**
 * Load emoji data before matching.
 */
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

import React, { useContext } from 'react';
import { Emoji as EmojiCharacter, CanonicalEmoji, Path, Size, Source } from 'interweave-emoji';
import Context from './Context';

const TITLE_REGEX = /(^|:|\.)\s?[a-z]/g;

export interface PreviewBarProps {
  emoji?: CanonicalEmoji | null;
  emojiLargeSize: Size;
  emojiPath: Path;
  emojiSource: Source;
  hideEmoticon: boolean;
  hideShortcodes: boolean;
  noPreview?: React.ReactNode;
}

// Format the title using sentence case.
function formatTitle(title: string): string {
  return title.replace(TITLE_REGEX, token => token.toUpperCase());
}

export default function PreviewBar({
  emoji,
  emojiLargeSize,
  emojiPath,
  emojiSource,
  hideEmoticon,
  hideShortcodes,
  noPreview,
}: PreviewBarProps) {
  const { classNames, messages } = useContext(Context);

  if (!emoji) {
    const preview = noPreview || messages.noPreview;

    return (
      <section className={classNames.preview}>
        {preview && <div className={classNames.noPreview}>{preview}</div>}
      </section>
    );
  }

  const title = emoji.annotation || emoji.name;
  const subtitle = [];

  if (!hideEmoticon && emoji.emoticon) {
    subtitle.push(emoji.emoticon);
  }

  if (!hideShortcodes && emoji.canonical_shortcodes) {
    subtitle.push(...emoji.canonical_shortcodes);
  }

  return (
    <section className={classNames.preview}>
      <div className={classNames.previewEmoji}>
        <EmojiCharacter
          emojiLargeSize={emojiLargeSize}
          emojiPath={emojiPath}
          emojiSource={emojiSource}
          enlargeEmoji
          hexcode={emoji.hexcode}
        />
      </div>

      <div className={classNames.previewContent}>
        {title && <div className={classNames.previewTitle}>{formatTitle(title)}</div>}

        {subtitle.length > 0 && (
          <div className={classNames.previewSubtitle}>{subtitle.join(' ')}</div>
        )}
      </div>
    </section>
  );
}

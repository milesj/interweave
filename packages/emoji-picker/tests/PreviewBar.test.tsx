/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { render } from 'rut';
import { EmojiDataManager, Emoji } from 'interweave-emoji';
import { SOURCE_PROP } from 'interweave/lib/testUtils';
import { PreviewBar, PreviewBarProps } from '../src/PreviewBar';
import { WithContextProps } from '../src/withContext';
import { PICKER_CONTEXT, CAT_EMOJI } from './mocks';

describe('PreviewBar', () => {
  const props: PreviewBarProps & WithContextProps = {
    context: PICKER_CONTEXT,
    emoji: CAT_EMOJI,
    emojiLargeSize: '3em',
    emojiPath: '{{hexcode}}',
    emojiSource: SOURCE_PROP,
    hideEmoticon: false,
    hideShortcodes: false,
  };

  beforeEach(() => {
    props.emoji = EmojiDataManager.getInstance('en').EMOJIS['1F642'];
  });

  it('renders a preview', () => {
    const { root } = render<PreviewBarProps>(<PreviewBar {...props} />);

    expect(root.findOne('section')).toMatchSnapshot();
  });

  describe('with emoji', () => {
    it('can customize class name', () => {
      const { root } = render<PreviewBarProps>(
        <PreviewBar
          {...props}
          context={{
            ...props.context,
            classNames: {
              ...props.context.classNames,
              preview: 'test-preview',
              previewEmoji: 'test-preview-emoji',
              previewContent: 'test-preview-content',
              previewTitle: 'test-preview-title',
              previewSubtitle: 'test-preview-subtitle',
            },
          }}
        />,
      );
      const divs = root.find('div');

      expect(root.findOne('section')).toHaveProp('className', 'test-preview');
      expect(divs[0]).toHaveProp('className', 'test-preview-emoji');
      expect(divs[1]).toHaveProp('className', 'test-preview-content');
      expect(divs[2]).toHaveProp('className', 'test-preview-title');
      expect(divs[3]).toHaveProp('className', 'test-preview-subtitle');
    });

    it('renders an emoji', () => {
      const { root } = render<PreviewBarProps>(<PreviewBar {...props} />);

      expect(root.findOne(Emoji)).toHaveProps(
        expect.objectContaining({
          emojiLargeSize: props.emojiLargeSize,
          emojiPath: props.emojiPath,
          emojiSource: props.emojiSource,
          enlargeEmoji: true,
          hexcode: props.emoji!.hexcode,
        }),
      );
    });

    it('displays title', () => {
      const { root } = render<PreviewBarProps>(<PreviewBar {...props} />);

      expect(root).toContainNode('Slightly smiling face');
    });

    it('displays title when no annotation', () => {
      const { root } = render<PreviewBarProps>(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji!,
            annotation: '',
          }}
        />,
      );

      expect(root).toContainNode('SLIGHTLY SMILING FACE');
    });

    it('doesnt display title if no annotation or name', () => {
      const { root } = render<PreviewBarProps>(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji!,
            annotation: '',
            name: '',
          }}
        />,
      );

      expect(root.find('div', { className: 'interweave-picker__preview-title' })).toHaveLength(0);
    });

    it('displays subtitle', () => {
      const { root } = render<PreviewBarProps>(<PreviewBar {...props} />);

      expect(root).toContainNode(':) :pleased:');
    });

    it('displays subtitle without emoticon', () => {
      const { root } = render<PreviewBarProps>(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji!,
            emoticon: '',
          }}
        />,
      );

      expect(root).toContainNode(':pleased:');
    });

    it('displays subtitle without shortcodes', () => {
      const { root } = render<PreviewBarProps>(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji!,
            canonical_shortcodes: [],
          }}
        />,
      );

      expect(root).toContainNode(':)');
    });

    it('hides emoticon in subtitle', () => {
      const { root } = render<PreviewBarProps>(<PreviewBar {...props} hideEmoticon />);

      expect(root).toContainNode(':pleased:');
    });

    it('hides shortcodes in subtitle', () => {
      const { root } = render<PreviewBarProps>(<PreviewBar {...props} hideShortcodes />);

      expect(root).toContainNode(':)');
    });

    it('doesnt display subtitle if no emoticon or shortcodes', () => {
      const { root } = render<PreviewBarProps>(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji!,
            canonical_shortcodes: [],
            emoticon: '',
          }}
        />,
      );

      expect(root.find('div', { className: 'interweave-picker__preview-subtitle' })).toHaveLength(
        0,
      );
    });

    it('doesnt display subtitle if all are hidden', () => {
      const { root } = render<PreviewBarProps>(
        <PreviewBar {...props} hideEmoticon hideShortcodes />,
      );

      expect(root.find('div', { className: 'interweave-picker__preview-subtitle' })).toHaveLength(
        0,
      );
    });
  });

  describe('no emoji', () => {
    it('can customize class name', () => {
      const { root } = render<PreviewBarProps>(
        <PreviewBar
          {...props}
          emoji={null}
          context={{
            ...props.context,
            classNames: {
              ...props.context.classNames,
              preview: 'test-preview',
              noPreview: 'test-preview-none',
            },
          }}
        />,
      );

      expect(root.findOne('section')).toHaveProp('className', 'test-preview');
      expect(root.findOne('div')).toHaveProp('className', 'test-preview-none');
    });

    it('renders no preview message', () => {
      const none = 'No preview';
      const { root } = render<PreviewBarProps>(
        <PreviewBar
          {...props}
          emoji={null}
          context={{
            ...props.context,
            messages: {
              ...props.context.messages,
              noPreview: none,
            },
          }}
        />,
      );

      expect(root).toContainNode(none);
    });

    it('renders no preview element', () => {
      const none = <b>No preview</b>;
      const { root } = render<PreviewBarProps>(
        <PreviewBar {...props} emoji={null} noPreview={none} />,
      );

      expect(root).toContainNode(none);
    });

    it('renders nothing if no preview message or preview element', () => {
      const { root } = render<PreviewBarProps>(
        <PreviewBar
          {...props}
          emoji={null}
          context={{
            ...props.context,
            messages: {
              ...props.context.messages,
              noPreview: '',
            },
          }}
          noPreview={null}
        />,
      );

      expect(root.findOne('section')).toMatchSnapshot();
    });
  });
});

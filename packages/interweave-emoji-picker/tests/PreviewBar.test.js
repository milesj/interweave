import React from 'react';
import { shallow } from 'enzyme';
import EmojiData from '../../interweave-emoji/src/EmojiDataManager';
import PreviewBar from '../src/PreviewBar';
import { SOURCE_PROP } from '../../../tests/mocks';
import { PICKER_CONTEXT } from './mocks';

describe('<PreviewBar />', () => {
  const context = PICKER_CONTEXT;

  const props = {
    emoji: null,
    emojiLargeSize: '3em',
    emojiPath: '{{hexcode}}',
    emojiSource: SOURCE_PROP,
    hideEmoticon: false,
    hideShortcodes: false,
  };

  beforeEach(() => {
    props.emoji = EmojiData.getInstance('en').EMOJIS['1F642'];
  });

  it('renders a preview', () => {
    const wrapper = shallow(<PreviewBar {...props} />, { context });

    expect(wrapper).toMatchSnapshot();
  });

  describe('with emoji', () => {
    it('can customize class name', () => {
      const wrapper = shallow(<PreviewBar {...props} />, {
        context: {
          ...context,
          classNames: {
            ...context.classNames,
            preview: 'test-preview',
            previewEmoji: 'test-preview-emoji',
            previewContent: 'test-preview-content',
            previewTitle: 'test-preview-title',
            previewSubtitle: 'test-preview-subtitle',
          },
        },
      });
      const divs = wrapper.find('div');

      expect(divs.at(0).prop('className')).toBe('test-preview');
      expect(divs.at(1).prop('className')).toBe('test-preview-emoji');
      expect(divs.at(2).prop('className')).toBe('test-preview-content');
      expect(divs.at(3).prop('className')).toBe('test-preview-title');
      expect(divs.at(4).prop('className')).toBe('test-preview-subtitle');
    });

    it('renders an emoji', () => {
      const wrapper = shallow(<PreviewBar {...props} />, { context });

      expect(wrapper.find('Emoji').props()).toEqual(
        expect.objectContaining({
          emojiLargeSize: props.emojiLargeSize,
          emojiPath: props.emojiPath,
          emojiSource: props.emojiSource,
          enlargeEmoji: true,
          hexcode: props.emoji.hexcode,
        }),
      );
    });

    it('displays title', () => {
      const wrapper = shallow(<PreviewBar {...props} />, { context });

      expect(wrapper.find('.interweave-picker__preview-title').text()).toBe(
        'Slightly smiling face',
      );
    });

    it('displays title when no annotation', () => {
      const wrapper = shallow(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji,
            annotation: '',
          }}
        />,
        { context },
      );

      expect(wrapper.find('.interweave-picker__preview-title').text()).toBe(
        'SLIGHTLY SMILING FACE',
      );
    });

    it('doesnt display title if no annotation or name', () => {
      const wrapper = shallow(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji,
            annotation: '',
            name: '',
          }}
        />,
        { context },
      );

      expect(wrapper.find('.interweave-picker__preview-title')).toHaveLength(0);
    });

    it('displays subtitle', () => {
      const wrapper = shallow(<PreviewBar {...props} />, { context });

      expect(wrapper.find('.interweave-picker__preview-subtitle').text()).toBe(':) :pleased:');
    });

    it('displays subtitle without emoticon', () => {
      const wrapper = shallow(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji,
            emoticon: '',
          }}
        />,
        { context },
      );

      expect(wrapper.find('.interweave-picker__preview-subtitle').text()).toBe(':pleased:');
    });

    it('displays subtitle without shortcodes', () => {
      const wrapper = shallow(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji,
            canonical_shortcodes: [],
          }}
        />,
        { context },
      );

      expect(wrapper.find('.interweave-picker__preview-subtitle').text()).toBe(':)');
    });

    it('hides emoticon in subtitle', () => {
      const wrapper = shallow(<PreviewBar {...props} hideEmoticon />, { context });

      expect(wrapper.find('.interweave-picker__preview-subtitle').text()).toBe(':pleased:');
    });

    it('hides shortcodes in subtitle', () => {
      const wrapper = shallow(<PreviewBar {...props} hideShortcodes />, { context });

      expect(wrapper.find('.interweave-picker__preview-subtitle').text()).toBe(':)');
    });

    it('doesnt display subtitle if no emoticon or shortcodes', () => {
      const wrapper = shallow(
        <PreviewBar
          {...props}
          emoji={{
            ...props.emoji,
            canonical_shortcodes: [],
            emoticon: '',
          }}
        />,
        { context },
      );

      expect(wrapper.find('.interweave-picker__preview-subtitle')).toHaveLength(0);
    });

    it('doesnt display subtitle if all are hidden', () => {
      const wrapper = shallow(<PreviewBar {...props} hideEmoticon hideShortcodes />, { context });

      expect(wrapper.find('.interweave-picker__preview-subtitle')).toHaveLength(0);
    });
  });

  describe('no emoji', () => {
    it('can customize class name', () => {
      const wrapper = shallow(<PreviewBar {...props} emoji={null} />, {
        context: {
          ...context,
          classNames: {
            ...context.classNames,
            preview: 'test-preview',
            noPreview: 'test-preview-none',
          },
        },
      });
      const divs = wrapper.find('div');

      expect(divs.at(0).prop('className')).toBe('test-preview');
      expect(divs.at(1).prop('className')).toBe('test-preview-none');
    });

    it('renders no preview message', () => {
      const none = <b>No preview</b>;
      const wrapper = shallow(<PreviewBar {...props} emoji={null} />, {
        context: {
          ...context,
          messages: {
            ...context.messages,
            noPreview: none,
          },
        },
      });

      expect(wrapper.find('div')).toHaveLength(2);
      expect(wrapper.contains(none)).toBe(true);
    });

    it('renders nothing if no preview message', () => {
      const wrapper = shallow(<PreviewBar {...props} emoji={null} />, {
        context: {
          ...context,
          messages: {
            ...context.messages,
            noPreview: '',
          },
        },
      });

      expect(wrapper.find('div')).toHaveLength(1);
    });
  });
});

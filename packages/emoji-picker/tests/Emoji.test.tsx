import React from 'react';
import { render } from 'rut';
import { SOURCE_PROP } from 'interweave/lib/testUtils';
import { EmojiDataManager, Emoji as EmojiCharacter } from 'interweave-emoji';
import Emoji, { EmojiProps } from '../src/Emoji';
import { CAT_EMOJI, ContextWrapper } from './mocks';

describe('Emoji', () => {
  const props: EmojiProps = {
    active: false,
    emoji: CAT_EMOJI,
    emojiPadding: 5,
    emojiPath: '{{hexcode}}',
    emojiSize: 22,
    emojiSource: SOURCE_PROP,
    onEnter() {},
    onLeave() {},
    onSelect() {},
  };

  beforeEach(() => {
    props.emoji = EmojiDataManager.getInstance('en').EMOJIS['1F408'];
  });

  it('renders an emoji', () => {
    const { root } = render<EmojiProps>(<Emoji {...props} />);

    expect(root.findOne('button')).toMatchSnapshot();
    expect(root.findOne(EmojiCharacter)).toHaveProp('hexcode', props.emoji.hexcode);
  });

  it('updates the active state', () => {
    const { root, update } = render<EmojiProps>(<Emoji {...props} />);

    expect(root.findOne('button')).toHaveProp('className', 'interweave-picker__emoji');

    update({
      active: true,
    });

    expect(root.findOne('button')).toHaveProp(
      'className',
      'interweave-picker__emoji interweave-picker__emoji--active',
    );
  });

  it('can customize class name', () => {
    const { root } = render<EmojiProps>(<Emoji {...props} active />, {
      wrapper: (
        <ContextWrapper
          classNames={{
            emoji: 'test-emoji',
            emojiActive: 'test-emoji--active',
          }}
        />
      ),
    });

    expect(root.findOne('button')).toHaveProp('className', 'test-emoji test-emoji--active');
  });

  it('sets correct sizes', () => {
    const { root } = render<EmojiProps>(<Emoji {...props} />);

    expect(root.findOne('button')).toHaveProp('style', {
      width: 32,
      height: 32,
      padding: 5,
    });
  });

  it('triggers `onSelect` when clicking', () => {
    const spy = jest.fn();
    const { root } = render<EmojiProps>(<Emoji {...props} onSelect={spy} />);

    root.findOne('button').dispatch('onClick');

    expect(spy).toHaveBeenCalledWith(props.emoji, expect.anything());
  });

  it('triggers `onEnter` when entering node', () => {
    const spy = jest.fn();
    const { root } = render<EmojiProps>(<Emoji {...props} onEnter={spy} />);

    root.findOne('button').dispatch('onMouseEnter');

    expect(spy).toHaveBeenCalledWith(props.emoji, expect.anything());
  });

  it('triggers `onLeave` when leaving node', () => {
    const spy = jest.fn();
    const { root } = render<EmojiProps>(<Emoji {...props} onLeave={spy} />);

    root.findOne('button').dispatch('onMouseLeave');

    expect(spy).toHaveBeenCalledWith(props.emoji, expect.anything());
  });
});

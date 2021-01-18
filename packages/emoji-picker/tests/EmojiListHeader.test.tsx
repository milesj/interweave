import React from 'react';
import { render } from 'rut-dom';
import {
  COMMON_MODE_FREQUENT,
  GROUP_KEY_COMMONLY_USED,
  GROUP_KEY_FLAGS,
  GROUP_KEY_PEOPLE_BODY,
  GROUP_KEY_SEARCH_RESULTS,
  GROUP_KEY_SMILEYS_EMOTION,
} from '../src/constants';
import EmojiListHeader, { EmojiListHeaderProps } from '../src/EmojiListHeader';
import { ContextWrapper } from './mocks';

describe('EmojiListHeader', () => {
  const props: EmojiListHeaderProps = {
    clearIcon: null,
    commonMode: COMMON_MODE_FREQUENT,
    group: GROUP_KEY_SMILEYS_EMOTION,
    onClear() {},
    skinTonePalette: null,
    sticky: false,
  };

  it('renders a group list', () => {
    const { root } = render<EmojiListHeaderProps>(<EmojiListHeader {...props} />);

    expect(root.findOne('header')).toMatchSnapshot();
  });

  it('can customize class name', () => {
    const { root } = render<EmojiListHeaderProps>(<EmojiListHeader {...props} sticky />, {
      wrapper: (
        <ContextWrapper
          classNames={{
            emojisHeader: 'test-header',
            emojisHeaderSticky: 'test-header--sticky',
          }}
        />
      ),
    });

    expect(root.findOne('header')).toHaveProp('className', 'test-header test-header--sticky');
  });

  it('displays group name', () => {
    const { root } = render<EmojiListHeaderProps>(<EmojiListHeader {...props} />);

    expect(root.findOne('span')).toContainNode('Smileys & emotion');
  });

  it('displays commonly used group name', () => {
    const { root } = render<EmojiListHeaderProps>(
      <EmojiListHeader {...props} group={GROUP_KEY_COMMONLY_USED} />,
    );

    expect(root.findOne('span')).toContainNode('Frequently used');
  });

  it('shows palette if people group', () => {
    const palette = <div>Palette</div>;
    const { root } = render<EmojiListHeaderProps>(
      <EmojiListHeader {...props} group={GROUP_KEY_PEOPLE_BODY} skinTonePalette={palette} />,
    );

    expect(root).toContainNode(palette);
  });

  it('shows palette if search results', () => {
    const palette = <div>Palette</div>;
    const { root } = render<EmojiListHeaderProps>(
      <EmojiListHeader {...props} group={GROUP_KEY_SEARCH_RESULTS} skinTonePalette={palette} />,
    );

    expect(root).toContainNode(palette);
  });

  it('doesnt show palette for other groups', () => {
    const palette = <div>Palette</div>;
    const { root } = render<EmojiListHeaderProps>(
      <EmojiListHeader {...props} group={GROUP_KEY_FLAGS} skinTonePalette={palette} />,
    );

    expect(root).not.toContainNode(palette);
  });

  it('shows clear icon if common group', () => {
    const icon = <div>Icon</div>;
    const { root } = render<EmojiListHeaderProps>(
      <EmojiListHeader {...props} group={GROUP_KEY_COMMONLY_USED} clearIcon={icon} />,
    );

    expect(root).toContainNode(icon);
  });

  it('doesnt show clear icon for other group', () => {
    const icon = <div>Icon</div>;
    const { root } = render<EmojiListHeaderProps>(
      <EmojiListHeader {...props} group={GROUP_KEY_SEARCH_RESULTS} clearIcon={icon} />,
    );

    expect(root).not.toContainNode(icon);
  });

  it('triggers `onClear` when clicking', () => {
    const spy = jest.fn();
    const icon = <div>Icon</div>;
    const { root } = render<EmojiListHeaderProps>(
      <EmojiListHeader {...props} group={GROUP_KEY_COMMONLY_USED} clearIcon={icon} onClear={spy} />,
    );

    root.findOne('button').dispatch('onClick');

    expect(spy).toHaveBeenCalled();
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { EmojiListHeader, EmojiListHeaderProps } from '../src/EmojiListHeader';
import { WithContextProps } from '../src/withContext';
import {
  COMMON_MODE_FREQUENT,
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_KEY_COMMONLY_USED,
  GROUP_KEY_SEARCH_RESULTS,
  GROUP_KEY_FLAGS,
} from '../src/constants';
import { PICKER_CONTEXT } from './mocks';

describe('EmojiListHeader', () => {
  const props: EmojiListHeaderProps & WithContextProps = {
    clearIcon: null,
    commonMode: COMMON_MODE_FREQUENT,
    context: PICKER_CONTEXT,
    group: GROUP_KEY_SMILEYS_PEOPLE,
    onClear() {},
    skinTonePalette: null,
    sticky: false,
  };

  const event = {
    preventDefault() {},
    stopPropagation() {},
  };

  it('renders a group list', () => {
    const wrapper = shallow(<EmojiListHeader {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('can customize class name', () => {
    const wrapper = shallow(
      <EmojiListHeader
        {...props}
        context={{
          ...props.context,
          classNames: {
            ...props.context.classNames,
            emojisHeader: 'test-header',
            emojisHeaderSticky: 'test-header--sticky',
          },
        }}
        sticky
      />,
    );

    expect(wrapper.prop('className')).toBe('test-header test-header--sticky');
  });

  it('displays group name', () => {
    const wrapper = shallow(<EmojiListHeader {...props} />);

    expect(wrapper.find('span').text()).toBe('Smileys & People');
  });

  it('displays commonly used group name', () => {
    const wrapper = shallow(<EmojiListHeader {...props} group={GROUP_KEY_COMMONLY_USED} />);

    expect(wrapper.find('span').text()).toBe('Frequently Used');
  });

  it('shows palette if smileys group', () => {
    const palette = <div>Palette</div>;
    const wrapper = shallow(
      <EmojiListHeader {...props} group={GROUP_KEY_SMILEYS_PEOPLE} skinTonePalette={palette} />,
    );

    expect(wrapper.contains(palette)).toBe(true);
  });

  it('shows palette if search results', () => {
    const palette = <div>Palette</div>;
    const wrapper = shallow(
      <EmojiListHeader {...props} group={GROUP_KEY_SEARCH_RESULTS} skinTonePalette={palette} />,
    );

    expect(wrapper.contains(palette)).toBe(true);
  });

  it('doesnt show palette for other groups', () => {
    const palette = <div>Palette</div>;
    const wrapper = shallow(
      <EmojiListHeader {...props} group={GROUP_KEY_FLAGS} skinTonePalette={palette} />,
    );

    expect(wrapper.contains(palette)).toBe(false);
  });

  it('shows clear icon if common group', () => {
    const icon = <div>Icon</div>;
    const wrapper = shallow(
      <EmojiListHeader {...props} group={GROUP_KEY_COMMONLY_USED} clearIcon={icon} />,
    );

    expect(wrapper.contains(icon)).toBe(true);
  });

  it('doesnt show clear icon for other group', () => {
    const icon = <div>Icon</div>;
    const wrapper = shallow(
      <EmojiListHeader {...props} group={GROUP_KEY_SEARCH_RESULTS} clearIcon={icon} />,
    );

    expect(wrapper.contains(icon)).toBe(false);
  });

  it('triggers `onClear` when clicking', () => {
    const spy = jest.fn();
    const icon = <div>Icon</div>;
    const wrapper = shallow(
      <EmojiListHeader {...props} group={GROUP_KEY_COMMONLY_USED} clearIcon={icon} onClear={spy} />,
    );

    wrapper.find('button').simulate('click', event);

    expect(spy).toHaveBeenCalled();
  });
});

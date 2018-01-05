import React from 'react';
import { shallow, mount } from 'enzyme';
import SearchBar from '../src/SearchBar';
import { PICKER_CONTEXT } from './mocks';

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

describe('<SearchBar />', () => {
  const context = PICKER_CONTEXT;

  const props = {
    autoFocus: false,
    onChange() {},
    onKeyUp() {},
    searchQuery: '',
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders a search bar', () => {
    const wrapper = shallow(<SearchBar {...props} />, { context });

    expect(wrapper).toMatchSnapshot();
  });

  it('focuses on mount if `autoFocus` is true', () => {
    const wrapper = mount(<SearchBar {...props} />, {
      context,
      disableLifecycleMethods: true,
    });

    const spy = jest.spyOn(wrapper.instance().input, 'focus');

    wrapper.instance().componentDidMount();

    expect(spy).not.toHaveBeenCalled();

    wrapper.setProps({
      autoFocus: true,
    });

    wrapper.instance().componentDidMount();

    expect(spy).toHaveBeenCalled();
  });

  it('resets query if prop changes', () => {
    const wrapper = shallow(<SearchBar {...props} searchQuery="foo" />, { context });

    expect(wrapper.state('query')).toBe('foo');
    expect(wrapper.find('input').prop('value')).toBe('foo');

    wrapper.setProps({
      searchQuery: '',
    });

    expect(wrapper.state('query')).toBe('');
    expect(wrapper.find('input').prop('value')).toBe('');
  });

  it('can customize class name', () => {
    const wrapper = shallow(<SearchBar {...props} />, {
      context: {
        ...context,
        classNames: {
          ...context.classNames,
          search: 'test-search',
          searchInput: 'test-search-input',
        },
      },
    });

    expect(wrapper.prop('className')).toBe('test-search');
    expect(wrapper.find('input').prop('className')).toBe('test-search-input');
  });

  it('can customize messages', () => {
    const wrapper = shallow(<SearchBar {...props} />, {
      context: {
        ...context,
        messages: {
          ...context.messages,
          search: 'search',
          searchA11y: 'searchA11y',
        },
      },
    });

    expect(wrapper.find('input').prop('placeholder')).toBe('search');
    expect(wrapper.find('input').prop('aria-label')).toBe('searchA11y');
  });

  it('triggers `onKeyUp` when pressing keys', () => {
    const spy = jest.fn();
    const wrapper = shallow(<SearchBar {...props} onKeyUp={spy} />, { context });

    wrapper.find('input').simulate('keyup');

    expect(spy).toHaveBeenCalled();
  });

  it('triggers `onChange` when changing values', () => {
    const spy = jest.fn();
    const wrapper = mount(<SearchBar {...props} onChange={spy} />, { context });

    wrapper.find('input').simulate('change', {
      persist() {},
      target: {
        value: 'foo',
      },
    });

    expect(spy).toHaveBeenCalledWith('foo', expect.objectContaining({}));
  });

  it('sets changed value to state', () => {
    const wrapper = shallow(<SearchBar {...props} />, { context });

    expect(wrapper.state('query')).toBe('');

    wrapper.find('input').simulate('change', {
      persist() {},
      target: {
        value: 'bar',
      },
    });

    expect(wrapper.state('query')).toBe('bar');
  });

  it('trims changed value', () => {
    const spy = jest.fn();
    const wrapper = mount(<SearchBar {...props} onChange={spy} />, { context });

    wrapper.find('input').simulate('change', {
      persist() {},
      target: {
        value: ' baz ',
      },
    });

    expect(spy).toHaveBeenCalledWith('baz', expect.objectContaining({}));
  });
});

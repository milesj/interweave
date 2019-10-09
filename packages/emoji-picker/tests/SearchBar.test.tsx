import React from 'react';
import { render } from 'rut';
import SearchBar, { SearchBarProps } from '../src/SearchBar';
import { ContextWrapper } from './mocks';

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

describe('SearchBar', () => {
  const props: SearchBarProps = {
    autoFocus: false,
    onChange() {},
    onKeyUp() {},
    searchQuery: '',
  };

  it('renders a search bar', () => {
    const { root } = render<SearchBarProps>(<SearchBar {...props} />);

    expect(root.findOne('div')).toMatchSnapshot();
  });

  it('focuses on mount if `autoFocus` is true', () => {
    const ref = document.createElement('input');
    const spy = jest.spyOn(ref, 'focus');

    render<SearchBarProps>(<SearchBar {...props} />, {
      mockRef: () => ref,
    });

    expect(spy).not.toHaveBeenCalled();

    render<SearchBarProps>(<SearchBar {...props} autoFocus />, {
      mockRef: () => ref,
    });

    expect(spy).toHaveBeenCalled();
  });

  it('can customize class name', () => {
    const { root } = render<SearchBarProps>(<SearchBar {...props} />, {
      wrapper: (
        <ContextWrapper
          classNames={{
            search: 'test-search',
            searchInput: 'test-search-input',
          }}
        />
      ),
    });

    expect(root.findOne('div')).toHaveProp('className', 'test-search');
    expect(root.findOne('input')).toHaveProp('className', 'test-search-input');
  });

  it('can customize messages', () => {
    const { root } = render<SearchBarProps>(<SearchBar {...props} />, {
      wrapper: (
        <ContextWrapper
          messages={{
            search: 'search',
            searchA11y: 'searchA11y',
          }}
        />
      ),
    });
    const input = root.findOne('input');

    expect(input).toHaveProp('placeholder', 'search');
    expect(input).toHaveProp('aria-label', 'searchA11y');
  });

  it('triggers `onKeyUp` when pressing keys', () => {
    const spy = jest.fn();
    const { root } = render<SearchBarProps>(<SearchBar {...props} onKeyUp={spy} />, {
      mockRef: () => document.createElement('input'),
    });

    root.findOne('input').dispatch('onKeyUp');

    expect(spy).toHaveBeenCalled();
  });

  it('triggers `onChange` when changing values', () => {
    const spy = jest.fn();
    const { root } = render<SearchBarProps>(<SearchBar {...props} onChange={spy} />, {
      mockRef: () => document.createElement('input'),
    });

    root.findOne('input').dispatch('onChange', { target: { value: 'foo' } });

    expect(spy).toHaveBeenCalledWith('foo', expect.objectContaining({}));
  });

  it('trims changed value', () => {
    const spy = jest.fn();
    const { root } = render<SearchBarProps>(<SearchBar {...props} onChange={spy} />, {
      mockRef: () => document.createElement('input'),
    });

    root.findOne('input').dispatch('onChange', { target: { value: ' baz ' } });

    expect(spy).toHaveBeenCalledWith('baz', expect.objectContaining({}));
  });
});

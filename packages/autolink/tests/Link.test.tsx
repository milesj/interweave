import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Link from '../src/Link';

describe('components/Link', () => {
  it('renders a link with href', () => {
    render(<Link href="/home">Foo</Link>);

    const el = document.querySelector('a');

    expect(el).toHaveTextContent('Foo');
    expect(el).toHaveProperty('href', 'http://localhost/home');
  });

  it('can set and trigger an onClick', () => {
    const spy = jest.fn();

    render(
      <Link href="/blog" onClick={spy}>
        Foo
      </Link>,
    );

    fireEvent.click(document.querySelector('a')!);

    expect(spy).toHaveBeenCalled();
  });

  it('can set target blank via newWindow', () => {
    const { rerender } = render(<Link href="/forums">Foo</Link>);

    expect(document.querySelector('a')).toHaveProperty('target', '');

    rerender(
      <Link href="/forums" newWindow>
        Foo
      </Link>,
    );

    expect(document.querySelector('a')).toHaveProperty('target', '_blank');
  });
});

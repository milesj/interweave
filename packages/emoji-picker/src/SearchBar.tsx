import React, { useRef, useEffect, useContext } from 'react';
import Context from './Context';

export interface SearchBarProps {
  autoFocus: boolean;
  onChange: (query: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

export default function SearchBar({ autoFocus, searchQuery, onChange, onKeyUp }: SearchBarProps) {
  const { classNames, messages } = useContext(Context);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if were still mounted
    if (ref.current) {
      onChange(event.target.value.trim(), event);
    }
  };

  return (
    <div className={classNames.search}>
      <input
        ref={ref}
        aria-label={messages.searchA11y}
        className={classNames.searchInput}
        placeholder={messages.search}
        type="search"
        value={searchQuery}
        onChange={handleChange}
        onKeyUp={onKeyUp}
      />
    </div>
  );
}

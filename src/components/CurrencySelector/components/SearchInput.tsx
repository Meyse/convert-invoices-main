import React from 'react';
import { SearchInputProps } from '../types';

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <input
      type="text"
      className="w-full bg-[#131A2A] text-white p-4 rounded-[20px] mb-4"
      placeholder="Search by name or paste address"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
} 
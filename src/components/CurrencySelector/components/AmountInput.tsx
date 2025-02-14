import React from 'react';
import { AmountInputProps } from '../types';

export function AmountInput({
  amount,
  onChange,
  isOutput,
  estimatedAmount,
  isLoading
}: AmountInputProps) {
  if (isLoading && (isOutput || !amount)) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-[#131A2A] rounded w-24"></div>
      </div>
    );
  }

  return (
    <input
      type="text"
      className="w-full bg-transparent text-2xl text-white outline-none"
      placeholder="0"
      value={isOutput ? estimatedAmount : amount}
      onChange={e => onChange?.(e.target.value)}
      readOnly={isOutput}
    />
  );
} 
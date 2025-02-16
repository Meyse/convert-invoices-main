import React from 'react';
import { AmountInputProps } from '../types';

export function AmountInput({
  amount,
  onChange,
  isOutput,
  estimatedAmount,
  isLoading,
  isDisabled
}: AmountInputProps) {
  if (isLoading && (isOutput || !amount)) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-[#282B33] rounded w-24"></div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange || isDisabled) return;
    
    // Replace comma with dot
    const value = e.target.value.replace(',', '.');
    onChange(value);
  };

  return (
    <input
      type="text"
      className={`w-full bg-transparent text-3xl outline-none truncate ${
        isDisabled ? 'text-[#5D6785] cursor-not-allowed' : 'text-white'
      }`}
      placeholder="0"
      value={isOutput ? estimatedAmount : amount}
      onChange={handleInputChange}
      readOnly={isOutput || isDisabled}
    />
  );
} 
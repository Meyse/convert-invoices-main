import React from 'react';
import { CurrencyOptionProps } from '../types';

export function CurrencyOption({ currency, onSelect }: CurrencyOptionProps) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-2 w-full p-2 hover:bg-[#131A2A] rounded-lg"
    >
      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
      <div className="text-left">
        <div className="text-white">{currency.tradingSymbol}</div>
        <div className="text-sm text-[#5D6785]">{currency.systemName}</div>
      </div>
    </button>
  );
} 
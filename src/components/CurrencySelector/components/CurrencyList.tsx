import React from 'react';
import { CurrencyListProps } from '../types';
import { CurrencyOption } from './CurrencyOption';

export function CurrencyList({ currencies, onSelect, isLoading }: CurrencyListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex items-center gap-2 p-2">
            <div className="w-8 h-8 bg-[#131A2A] rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-[#131A2A] rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {currencies.map(currency => (
        <CurrencyOption
          key={currency.systemName}
          currency={currency}
          onSelect={() => onSelect(currency)}
        />
      ))}
    </div>
  );
} 
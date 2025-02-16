import React from 'react';
import { CurrencyOptionProps } from '../types';
import { getCurrencyIcon } from '@/components/CurrencyList';
import Image from 'next/image';

export function CurrencyOption({ currency, onSelect }: CurrencyOptionProps) {
  const iconPath = getCurrencyIcon(currency);

  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-2 w-full p-2 hover:bg-[#131A2A] rounded-lg"
    >
      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#131A2A] flex items-center justify-center">
        <Image
          src={iconPath}
          alt={`${currency.tradingSymbol} icon`}
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      <div className="text-left">
        <div className="text-white">{currency.tradingSymbol}</div>
        <div className="text-sm text-[#5D6785]">{currency.systemName}</div>
      </div>
    </button>
  );
} 
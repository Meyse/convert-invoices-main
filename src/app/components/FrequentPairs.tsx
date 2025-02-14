import React from 'react';
import { Currency, findCurrencyBySystemName } from '@/components/CurrencyList';

/**
 * Props for the FrequentPairs component
 */
interface FrequentPairsProps {
  /** Callback when a currency pair is selected */
  onSelect: (fromCurrency: Currency, toCurrency: Currency) => void;
}

/**
 * Predefined list of frequently used currency conversion pairs.
 * Each pair consists of a source and target currency identifier.
 */
const FREQUENT_PAIRS = [
  { from: 'tBTC.vETH', to: 'VRSC' },
  { from: 'vETH', to: 'VRSC' },
  { from: 'DAI.vETH', to: 'VRSC' }
];

/**
 * Displays a horizontal list of frequently used currency conversion pairs.
 * Each pair is presented as a clickable button that automatically sets
 * both the source and target currencies when clicked.
 * Supports horizontal scrolling for overflow.
 */
export function FrequentPairs({ onSelect }: FrequentPairsProps) {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto">
      {FREQUENT_PAIRS.map(pair => {
        const fromCurr = findCurrencyBySystemName(pair.from);
        const toCurr = findCurrencyBySystemName(pair.to);
        
        if (!fromCurr || !toCurr) return null;

        return (
          <button
            key={`${pair.from}-${pair.to}`}
            className="flex items-center gap-1 bg-[#090A0E] border border-[#2B2A2A] hover:border-[#ffffff]/50 rounded-[16px] px-4 py-2 text-sm text-[#5D6785] hover:text-white space-nowrap"
            onClick={() => onSelect(fromCurr, toCurr)}
          >
            {pair.from} → {pair.to}
          </button>
        );
      })}
    </div>
  );
} 
import React, { useState } from 'react';
import { CurrencySelectorProps } from './types';
import { AmountInput } from './components/AmountInput';
import { CurrencyModal } from './components/CurrencyModal';
import Image from 'next/image';
import { getCurrencyIcon } from '@/components/CurrencyList';

export default function CurrencySelector({
  label,
  selectedCurrency,
  onSelect,
  availableCurrencies,
  amount,
  onAmountChange,
  estimatedAmount,
  isOutput = false,
  isLoading = false,
  variant = 'buy',
  iDontCareMode = false,
  onToggleIDontCare,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isDisabled = !isOutput && iDontCareMode;
  const showIDontCareButton = !isOutput && onToggleIDontCare;

  const buttonStyles = variant === 'sell' || selectedCurrency
    ? `flex items-center gap-2 bg-[#090A0E] border border-[#2B2A2A] hover:bg-[#1B1E23]/80 rounded-[20px] px-3 py-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`
    : `flex items-center gap-2 bg-[#3165D4] hover:bg-[#3165D4] rounded-[20px] px-3 py-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (isDisabled) {
    return (
      <div className="p-4">
        <div className="flex justify-end">
          <button
            onClick={() => onToggleIDontCare?.()}
            className="text-xs text-[#838A9E] hover:text-white transition-colors"
          >
            Show again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-[#838A9E]">
          {label}
        </label>
        {showIDontCareButton && (
          <button
            onClick={() => onToggleIDontCare?.()}
            className="text-xs text-[#838A9E] hover:text-white transition-colors"
          >
            Don&apos;t show
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <AmountInput
            amount={amount}
            onChange={onAmountChange}
            estimatedAmount={estimatedAmount}
            isOutput={isOutput}
            isLoading={isLoading}
            isDisabled={isDisabled}
          />
        </div>
        <button
          onClick={() => !isDisabled && setIsOpen(true)}
          className={`${buttonStyles} shrink-0`}
          disabled={isDisabled}
        >
          {selectedCurrency ? (
            <>
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-[#131A2A] flex items-center justify-center">
                <Image
                  src={getCurrencyIcon(selectedCurrency)}
                  alt={`${selectedCurrency.tradingSymbol} icon`}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="text-white">{selectedCurrency.tradingSymbol}</span>
            </>
          ) : (
            <span className="text-white">Select currency</span>
          )}
          <Image
            src="/chevron.svg"
            alt="Open currency selector"
            width={16}
            height={16}
          />
        </button>
      </div>

      <CurrencyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={onSelect}
        availableCurrencies={availableCurrencies}
        isLoading={isLoading}
      />
    </div>
  );
} 
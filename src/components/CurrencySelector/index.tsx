import React, { useState } from 'react';
import { CurrencySelectorProps } from './types';
import { AmountInput } from './components/AmountInput';
import { CurrencyModal } from './components/CurrencyModal';
import Image from 'next/image';

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
  variant = 'buy'
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const buttonStyles = variant === 'sell' || selectedCurrency
    ? "flex items-center gap-2 bg-[#090A0E] border border-[#2B2A2A] hover:bg-[#1B1E23]/80 rounded-[20px] px-3 py-2"
    : "flex items-center gap-2 bg-[#3165D4] hover:bg-[#3165D4] rounded-[20px] px-3 py-2";

  return (
    <div className="p-4">
      <label className="text-sm text-[#5D6785] mb-2 block">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="flex-1">
          <AmountInput
            amount={amount}
            onChange={onAmountChange}
            estimatedAmount={estimatedAmount}
            isOutput={isOutput}
            isLoading={isLoading}
          />
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className={buttonStyles}
        >
          {selectedCurrency ? (
            <>
              <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              <span className="text-white">{selectedCurrency.tradingSymbol}</span>
            </>
          ) : (
            <span className="text-white">Select token</span>
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
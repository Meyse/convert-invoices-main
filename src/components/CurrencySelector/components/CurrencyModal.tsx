import React, { useState } from 'react';
import { CurrencyModalProps } from '../types';
import { SearchInput } from './SearchInput';
import { CurrencyList } from './CurrencyList';

export function CurrencyModal({
  isOpen,
  onClose,
  onSelect,
  availableCurrencies,
  isLoading
}: CurrencyModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCurrencies = availableCurrencies.filter(currency => 
    currency.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.tradingSymbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#0D111C] rounded-[24px] p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white">Select a currency</h2>
          <button onClick={onClose} className="text-white">✕</button>
        </div>
        
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <CurrencyList
          currencies={filteredCurrencies}
          onSelect={(currency) => {
            onSelect(currency);
            onClose();
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 
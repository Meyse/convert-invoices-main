'use client';

import React, { useState } from 'react';
import { Currency, findCurrencyBySystemName } from '@/components/CurrencyList';
import { FrequentPairs } from './components/FrequentPairs';
import { ConversionForm } from './components/ConversionForm';
import { useCurrencyConversion } from './hooks/useCurrencyConversion';

export default function Home() {
  const {
    fromCurrency,
    toCurrency,
    amount,
    estimatedAmount,
    conversionFee,
    availableToTokens,
    isLoadingAvailableTokens,
    isLoadingEstimate,
    liquidityExceeded,
    maxAvailableAmount,
    setFromCurrency,
    setToCurrency,
    setAmount
  } = useCurrencyConversion();

  const [destinationAddress, setDestinationAddress] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(false);

  const handleFrequentPairSelect = (fromCurr: Currency, toCurr: Currency) => {
    setFromCurrency(fromCurr);
    setToCurrency(toCurr);
  };

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Form submitted');
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-[#0F1013]">
      <h1 className="text-[48px] font-medium text-white mb-8 text-center leading-[56px]">
        Quick Invoices to<br />Use & Share
      </h1>

      <FrequentPairs onSelect={handleFrequentPairSelect} />

      <ConversionForm
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        amount={amount}
        estimatedAmount={estimatedAmount}
        conversionFee={conversionFee}
        availableToTokens={availableToTokens}
        isLoadingAvailableTokens={isLoadingAvailableTokens}
        isLoadingEstimate={isLoadingEstimate}
        liquidityExceeded={liquidityExceeded}
        maxAvailableAmount={maxAvailableAmount}
        destinationAddress={destinationAddress}
        isAddressValid={isAddressValid}
        onFromCurrencyChange={setFromCurrency}
        onToCurrencyChange={setToCurrency}
        onAmountChange={setAmount}
        onAddressChange={setDestinationAddress}
        onAddressValidityChange={setIsAddressValid}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

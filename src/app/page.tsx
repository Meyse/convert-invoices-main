'use client';

import React, { useState } from 'react';
import '@/buffer-polyfill';
import { Currency, findCurrencyBySystemName } from '@/components/CurrencyList';
import { FrequentPairs } from './components/FrequentPairs';
import { ConversionForm } from './components/ConversionForm';
import { useCurrencyConversion } from './hooks/useCurrencyConversion';
import { BackgroundGradient } from './components/BackgroundGradient';
import { CreateInvoiceModal } from './components/CreateInvoiceModal';

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
    iDontCareMode,
    setFromCurrency,
    setToCurrency,
    setAmount,
    toggleIDontCareMode
  } = useCurrencyConversion();

  const [destinationAddress, setDestinationAddress] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [destinationIAddress, setDestinationIAddress] = useState<string>();

  const handleFrequentPairSelect = (fromCurr: Currency, toCurr: Currency) => {
    setFromCurrency(fromCurr);
    setToCurrency(toCurr);
  };

  const handleSubmit = () => {
    setIsCreateInvoiceModalOpen(true);
  };

  const handleIAddressFound = (iAddress: string) => {
    setDestinationIAddress(iAddress);
  };

  return (
    <>
      <BackgroundGradient />
      <main className="relative flex min-h-screen flex-col items-center p-0 pt-4 md:p-8 bg-[#0F1013]/95">
        <h1 className="text-[26px] md:text-[48px] tracking-tight text-white mb-4 text-center leading-[40px] md:leading-[56px] px-4 md:px-0">
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
          iDontCareMode={iDontCareMode}
          onToggleIDontCare={toggleIDontCareMode}
          onIAddressFound={handleIAddressFound}
        />

        <CreateInvoiceModal
          isOpen={isCreateInvoiceModalOpen}
          onClose={() => setIsCreateInvoiceModalOpen(false)}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          amount={iDontCareMode ? amount : estimatedAmount}
          destinationAddress={destinationAddress}
          destinationIAddress={destinationIAddress}
          liquidityInfo={{
            maxAvailableAmount,
            conversionPath: [] // TODO: Add conversion path from API
          }}
        />
      </main>
    </>
  );
}

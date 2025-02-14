import React from 'react';
import CurrencySelector from '@/components/CurrencySelector';
import { Currency, getEnabledCurrencies } from '@/components/CurrencyList';
import { ConversionRates } from './ConversionRates';
import { LiquidityWarning } from './LiquidityWarning';
import { DestinationAddressInput } from './DestinationAddressInput';
import { ActionButton } from './ActionButton';

/**
 * Props for the ConversionForm component
 */
interface ConversionFormProps {
  /** The source currency for conversion */
  fromCurrency?: Currency;
  /** The target currency for conversion */
  toCurrency?: Currency;
  /** The amount to convert */
  amount: string;
  /** The estimated output amount */
  estimatedAmount: string;
  /** The fee for the conversion */
  conversionFee?: number;
  /** List of available target currencies */
  availableToTokens: Currency[];
  /** Loading state for available tokens */
  isLoadingAvailableTokens: boolean;
  /** Loading state for conversion estimate */
  isLoadingEstimate: boolean;
  /** Whether the conversion exceeds available liquidity */
  liquidityExceeded: boolean;
  /** Maximum amount available for conversion */
  maxAvailableAmount?: number;
  /** The destination address for the conversion */
  destinationAddress: string;
  /** Whether the destination address is valid */
  isAddressValid: boolean;
  /** Callback when source currency changes */
  onFromCurrencyChange: (currency: Currency) => void;
  /** Callback when target currency changes */
  onToCurrencyChange: (currency: Currency) => void;
  /** Callback when amount changes */
  onAmountChange: (amount: string) => void;
  /** Callback when address changes */
  onAddressChange: (address: string) => void;
  /** Callback when address validity changes */
  onAddressValidityChange: (isValid: boolean) => void;
  /** Callback when form is submitted */
  onSubmit: () => void;
}

/**
 * A form component for currency conversion that combines all conversion-related UI elements.
 * Handles currency selection, amount input, conversion rates, liquidity warnings,
 * destination address input, and form submission.
 */
export function ConversionForm({
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
  destinationAddress,
  isAddressValid,
  onFromCurrencyChange,
  onToCurrencyChange,
  onAmountChange,
  onAddressChange,
  onAddressValidityChange,
  onSubmit
}: ConversionFormProps) {
  return (
    <div className="w-full max-w-[464px] bg-[#090A0E] rounded-[24px] p-2">
      <div className="relative">
        {/* Sell section */}
        <div className="bg-[#090A0E] h-[142px] border border-[#2B2A2A] rounded-[20px] mb-2">
          <CurrencySelector
            label="You send"
            selectedCurrency={fromCurrency}
            onSelect={onFromCurrencyChange}
            availableCurrencies={getEnabledCurrencies()}
            amount={amount}
            onAmountChange={onAmountChange}
            isLoading={isLoadingEstimate}
            variant="sell"
          />
        </div>

        {/* Buy section */}
        <div className="bg-[#12141C] h-[142px] rounded-[20px]">
          <CurrencySelector
            label="You receive"
            selectedCurrency={toCurrency}
            onSelect={onToCurrencyChange}
            availableCurrencies={availableToTokens}
            estimatedAmount={estimatedAmount}
            isOutput
            isLoading={isLoadingAvailableTokens || isLoadingEstimate}
            variant="buy"
          />
        </div>

        <ConversionRates
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          amount={amount}
          estimatedAmount={estimatedAmount}
          conversionFee={conversionFee}
        />

        <LiquidityWarning
          liquidityExceeded={liquidityExceeded}
          maxAvailableAmount={maxAvailableAmount}
          toCurrency={toCurrency}
        />
      </div>

      <DestinationAddressInput
        value={destinationAddress}
        onChange={onAddressChange}
        onValidityChange={onAddressValidityChange}
      />

      <ActionButton
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        amount={amount}
        isAddressValid={isAddressValid}
        liquidityExceeded={liquidityExceeded}
        onClick={onSubmit}
      />
    </div>
  );
} 
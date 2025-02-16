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
  /** Whether the form is in "I don't care" mode */
  iDontCareMode?: boolean;
  /** Callback to toggle "I don't care" mode */
  onToggleIDontCare?: () => void;
  /** Callback when an i-address is found for a VerusID */
  onIAddressFound?: (iAddress: string | undefined) => void;
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
  onSubmit,
  iDontCareMode,
  onToggleIDontCare,
  onIAddressFound
}: ConversionFormProps) {
  return (
    <div className="w-full max-w-[464px] bg-[#090A0E] rounded-[24px] p-2">
      <div className="relative">
        {/* Sell section */}
        {!iDontCareMode ? (
          <div className="h-[142px] mb-2 rounded-[20px] bg-[#090A0E] border border-[#2B2A2A]">
            <CurrencySelector
              label="You send"
              selectedCurrency={fromCurrency}
              onSelect={onFromCurrencyChange}
              availableCurrencies={getEnabledCurrencies()}
              amount={amount}
              onAmountChange={onAmountChange}
              isLoading={isLoadingEstimate}
              variant="sell"
              iDontCareMode={iDontCareMode}
              onToggleIDontCare={onToggleIDontCare}
            />
          </div>
        ) : (
          <div className="h-[71px] mb-2 rounded-[20px] bg-[#12141C]">
            <CurrencySelector
              label="You send"
              selectedCurrency={fromCurrency}
              onSelect={onFromCurrencyChange}
              availableCurrencies={getEnabledCurrencies()}
              amount={amount}
              onAmountChange={onAmountChange}
              isLoading={isLoadingEstimate}
              variant="sell"
              iDontCareMode={iDontCareMode}
              onToggleIDontCare={onToggleIDontCare}
            />
          </div>
        )}

        {/* Buy section */}
        <div className={`h-[142px] rounded-[20px] ${iDontCareMode ? 'bg-[#090A0E] border border-[#2B2A2A]' : 'bg-[#12141C]'}`}>
          <CurrencySelector
            label="You receive"
            selectedCurrency={toCurrency}
            onSelect={onToCurrencyChange}
            availableCurrencies={iDontCareMode ? getEnabledCurrencies() : availableToTokens}
            amount={iDontCareMode ? amount : undefined}
            estimatedAmount={!iDontCareMode ? estimatedAmount : undefined}
            onAmountChange={iDontCareMode ? onAmountChange : undefined}
            isOutput={!iDontCareMode}
            isLoading={isLoadingAvailableTokens || isLoadingEstimate}
            variant="buy"
          />
        </div>

        {!iDontCareMode && (
          <>
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
          </>
        )}
      </div>

      <DestinationAddressInput
        value={destinationAddress}
        onChange={onAddressChange}
        onValidityChange={onAddressValidityChange}
        onIAddressFound={onIAddressFound}
      />

      <ActionButton
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        amount={amount}
        isAddressValid={isAddressValid}
        liquidityExceeded={liquidityExceeded}
        iDontCareMode={iDontCareMode || false}
        onClick={onSubmit}
      />
    </div>
  );
} 
import React from 'react';
import { Currency } from '@/components/CurrencyList';

/**
 * Props for the ConversionRates component
 */
interface ConversionRatesProps {
  /** The source currency for conversion */
  fromCurrency?: Currency;
  /** The target currency for conversion */
  toCurrency?: Currency;
  /** The amount to convert */
  amount?: string;
  /** The estimated output amount */
  estimatedAmount?: string;
  /** The fee for the conversion */
  conversionFee?: number;
}

/**
 * Displays conversion rates and fees for a currency conversion.
 * Shows both the conversion fee and the exchange rate between currencies.
 * Only renders when all required information is available.
 */
export function ConversionRates({
  fromCurrency,
  toCurrency,
  amount,
  estimatedAmount,
  conversionFee
}: ConversionRatesProps) {
  if (!fromCurrency || !toCurrency || !amount || !estimatedAmount) return null;

  return (
    <div className="mt-2">
      {conversionFee !== undefined && amount && (
        <div className="text-xs text-[#5D6785] text-right">
          Fee: {conversionFee.toFixed(8)} {fromCurrency.tradingSymbol} ({(conversionFee / parseFloat(amount) * 100).toFixed(3)}%)
        </div>
      )}

      {amount && estimatedAmount && (
        <div className="text-xs text-[#5D6785] mt-1 text-right">
          Rate: 1 {toCurrency.tradingSymbol} = {(parseFloat(amount) / parseFloat(estimatedAmount)).toFixed(8)} {fromCurrency.tradingSymbol}
        </div>
      )}
    </div>
  );
} 
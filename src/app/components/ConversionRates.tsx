import React from 'react';
import { Currency } from '@/components/CurrencyList';
import { Coins, ArrowRightLeft } from 'lucide-react';

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
    <div className="mt-4 bg-[#090A0E] rounded-lg p-4">
      {conversionFee !== undefined && amount && (
        <div className="flex items-center justify-between text-sm text-[#838A9E] mb-3 pb-3 border-b border-[#1B2030]">
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-[#838A9E]" />
            <span>Network Fee</span>
          </div>
          <div>
            {conversionFee.toFixed(8)} {fromCurrency.tradingSymbol} ({(conversionFee / parseFloat(amount) * 100).toFixed(3)}%)
          </div>
        </div>
      )}

      {amount && estimatedAmount && (
        <div className="flex items-center justify-between text-sm text-[#838A9E]">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-[#838A9E]" />
            <span>Exchange Rate</span>
          </div>
          <div>
            1 {toCurrency.tradingSymbol} = {(parseFloat(amount) / parseFloat(estimatedAmount)).toFixed(8)} {fromCurrency.tradingSymbol}
          </div>
        </div>
      )}
    </div>
  );
} 
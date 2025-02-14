import React from 'react';
import { Currency } from '@/components/CurrencyList';

/**
 * Props for the LiquidityWarning component
 */
interface LiquidityWarningProps {
  /** Whether the conversion amount exceeds available liquidity */
  liquidityExceeded: boolean;
  /** Maximum amount available for conversion */
  maxAvailableAmount?: number;
  /** The target currency for conversion */
  toCurrency?: Currency;
}

/**
 * Displays a warning when a conversion amount exceeds available liquidity.
 * Shows the maximum available amount for the target currency.
 * Only renders when liquidity is exceeded and all required information is available.
 */
export function LiquidityWarning({
  liquidityExceeded,
  maxAvailableAmount,
  toCurrency
}: LiquidityWarningProps) {
  if (!liquidityExceeded || maxAvailableAmount === undefined || !toCurrency) {
    return null;
  }

  return (
    <div className="text-xs text-[#EF4444] mt-2">
      Insufficient liquidity. The conversion would require more than the available {toCurrency.tradingSymbol} ({maxAvailableAmount.toFixed(8)} {toCurrency.tradingSymbol} available)
    </div>
  );
} 
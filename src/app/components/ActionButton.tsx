import React from 'react';
import { Currency } from '@/components/CurrencyList';

/**
 * Props for the ActionButton component
 */
interface ActionButtonProps {
  /** The source currency for conversion */
  fromCurrency?: Currency;
  /** The target currency for conversion */
  toCurrency?: Currency;
  /** The amount to convert */
  amount?: string;
  /** Whether the destination address is valid */
  isAddressValid: boolean;
  /** Whether the conversion exceeds available liquidity */
  liquidityExceeded: boolean;
  /** Whether in "I don't care" mode */
  iDontCareMode: boolean;
  /** Callback when the button is clicked */
  onClick: () => void;
}

/**
 * A submit button component for the conversion form.
 * Automatically disables itself when:
 * - Source or target currency is not selected (unless in iDontCareMode)
 * - Amount is not entered
 * - Address is invalid
 * - Liquidity is exceeded
 * Changes appearance based on disabled state.
 */
export function ActionButton({
  fromCurrency,
  toCurrency,
  amount,
  isAddressValid,
  liquidityExceeded,
  iDontCareMode,
  onClick
}: ActionButtonProps) {
  const isDisabled = (!fromCurrency && !iDontCareMode) || !toCurrency || !amount || !isAddressValid || liquidityExceeded;

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`w-full mt-4 py-4 px-4 rounded-[20px] font-medium text-[20px] ${
        isDisabled
          ? 'bg-[#22242A] text-[#5D6785] cursor-not-allowed'
          : 'bg-[#3165D4] hover:bg-[#3165D4]/90 text-white'
      }`}
    >
      Create Invoice
    </button>
  );
} 
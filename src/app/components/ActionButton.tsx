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
  /** Callback when the button is clicked */
  onClick: () => void;
}

/**
 * A submit button component for the conversion form.
 * Automatically disables itself when:
 * - Source or target currency is not selected
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
  onClick
}: ActionButtonProps) {
  const isDisabled = !fromCurrency || !toCurrency || !amount || !isAddressValid || liquidityExceeded;

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`w-full mt-4 py-4 px-4 rounded-[20px] font-medium text-[20px] ${
        isDisabled
          ? 'bg-[#22242A] text-[#5D6785] cursor-not-allowed'
          : 'bg-[#4A5AEF] hover:bg-[#4A5AEF]/90 text-white'
      }`}
    >
      Get started
    </button>
  );
} 
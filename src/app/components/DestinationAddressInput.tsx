import React, { useState, useEffect } from 'react';

/**
 * Props for the DestinationAddressInput component
 */
interface DestinationAddressInputProps {
  /** The current address value */
  value: string;
  /** Callback when the address changes */
  onChange: (value: string) => void;
  /** Callback when the address validity changes */
  onValidityChange: (isValid: boolean) => void;
}

/**
 * Input component for entering and validating cryptocurrency destination addresses.
 * Supports both R-addresses (34 characters) and VerusIDs (ending with @).
 * Automatically validates the address format and notifies parent component of validity changes.
 */
export function DestinationAddressInput({
  value,
  onChange,
  onValidityChange
}: DestinationAddressInputProps) {
  useEffect(() => {
    const isValid = Boolean(value) && (
      value.length === 34 || // R-address
      value.endsWith('@')    // VerusID
    );
    onValidityChange(isValid);
  }, [value, onValidityChange]);

  return (
    <div className="mt-8">
      <input
        type="text"
        className="w-full bg-[#090A0E] text-white p-4 rounded-[20px] border border-[#2B2A2A] placeholder-[#5D6785]"
        placeholder="Enter R-address or VerusID"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
} 
import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { fromBase58Check } from "verus-typescript-primitives"

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
  /** Callback when an i-address is found or cleared */
  onIAddressFound?: (iAddress: string | undefined) => void;
}

async function validateVerusId(verusId: string): Promise<{ isValid: boolean; iAddress?: string }> {
  try {
    const response = await fetch('https://api.verus.services', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'validation',
        method: 'getidentity',
        params: [verusId]
      })
    });

    const data = await response.json();

    if (data.error) {
      return { isValid: false };
    }

    return {
      isValid: true,
      iAddress: data.result.identity.identityaddress
    };
  } catch (error) {
    console.error('Error validating VerusID:', error);
    return { isValid: false };
  }
}

/**
 * Input component for entering and validating cryptocurrency destination addresses.
 * Supports both R-addresses (34 characters) and VerusIDs (ending with @).
 * Automatically validates the address format and notifies parent component of validity changes.
 */
export function DestinationAddressInput({
  value,
  onChange,
  onValidityChange,
  onIAddressFound
}: DestinationAddressInputProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Memoize validation function to prevent unnecessary re-renders
  const validate = useCallback(async (address: string) => {
    if (!address) {
      setIsValid(false);
      setShowValidation(false);
      onValidityChange(false);
      return;
    }

    // Skip API validation if it's a regular R-address
    if (address.length === 34 || address.length === 33) {
      try {
        fromBase58Check(address);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsValid(false);
        onValidityChange(false);
        return;
      }
      setIsValid(true);
      setShowValidation(true);
      onValidityChange(true);
      return;
    }

    // Only validate VerusIDs with API
    if (address.endsWith('@')) {
      setIsValidating(true);
      setShowValidation(true);

      const { isValid, iAddress } = await validateVerusId(address);

      if (isValid && iAddress) {
        setIsValid(true);
        onValidityChange(true);
        onIAddressFound?.(iAddress);
      } else {
        setIsValid(false);
        onValidityChange(false);
      }

      setIsValidating(false);
    } else {
      setIsValid(false);
      setShowValidation(address.length > 0);
      onValidityChange(false);
    }
  }, [onValidityChange, onIAddressFound]);

  // Immediate UI feedback
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Show validation immediately for R-addresses
    if (newValue.length === 34 || newValue.length === 33) {
      setShowValidation(true);
      onValidityChange(true);
      onIAddressFound?.(undefined); // Clear any stored i-address
    } else {
      setIsValid(false);
      setShowValidation(newValue.length > 0);
      onValidityChange(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => validate(value), 500);
    return () => clearTimeout(timeoutId);
  }, [value, validate]);

  return (
    <div className="mt-8">
      <div className="relative">
        <input
          type="text"
          className="w-full bg-[#090A0E] text-white p-4 pr-12 rounded-[20px] border border-[#2B2A2A] placeholder-[#838A9E]"
          placeholder="Enter R-address or VerusID"
          value={value}
          onChange={handleInputChange}
        />
        {showValidation && !isValidating && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
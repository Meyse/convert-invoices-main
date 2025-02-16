import { useState, useEffect } from 'react';
import { Currency, currencies, findCurrencyBySystemName } from '@/components/CurrencyList';
import { getCurrencyConverters, estimateConversion, findBestConverter } from '@/services/api';
import { ConversionRequest } from '@/types/api';

/**
 * Custom hook for managing currency conversion state and logic.
 * Handles currency selection, amount input, conversion estimates, and liquidity checks.
 * 
 * @returns {Object} An object containing:
 * - fromCurrency: The source currency for conversion
 * - toCurrency: The target currency for conversion
 * - amount: The amount to convert
 * - estimatedAmount: The estimated output amount
 * - conversionFee: The fee for the conversion
 * - availableToTokens: List of available target currencies
 * - isLoadingAvailableTokens: Loading state for available tokens
 * - isLoadingEstimate: Loading state for conversion estimate
 * - liquidityExceeded: Whether the conversion exceeds available liquidity
 * - maxAvailableAmount: Maximum amount available for conversion
 * - iDontCareMode: Whether the conversion is in "I don't care" mode
 * - setFromCurrency: Function to update source currency
 * - setToCurrency: Function to update target currency
 * - setAmount: Function to update conversion amount
 * - toggleIDontCareMode: Function to toggle "I don't care" mode
 */
export function useCurrencyConversion() {
  // Initialize with ETH as the default 'from' currency
  const defaultFromCurrency = findCurrencyBySystemName('vETH');
  const [fromCurrency, setFromCurrency] = useState<Currency | undefined>(defaultFromCurrency);
  const [toCurrency, setToCurrency] = useState<Currency | undefined>();
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [conversionFee, setConversionFee] = useState<number>();
  const [availableToTokens, setAvailableToTokens] = useState<Currency[]>([]);
  const [isLoadingAvailableTokens, setIsLoadingAvailableTokens] = useState(false);
  const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);
  const [liquidityExceeded, setLiquidityExceeded] = useState(false);
  const [maxAvailableAmount, setMaxAvailableAmount] = useState<number>();
  const [iDontCareMode, setIDontCareMode] = useState(false);

  // Handle from currency change
  const handleFromCurrencyChange = (currency: Currency) => {
    if (iDontCareMode) return; // Prevent changes in "I don't care" mode
    console.log('From currency changed to:', currency);
    setFromCurrency(currency);
    setToCurrency(undefined);
    setEstimatedAmount('');
  };

  // Toggle "I don't care" mode
  const toggleIDontCareMode = () => {
    setIDontCareMode(!iDontCareMode);
    if (!iDontCareMode) {
      // Entering "I don't care" mode
      setAmount('');
      setEstimatedAmount('');
    }
  };

  // Fetch available "to" currencies
  useEffect(() => {
    if (!fromCurrency) return;

    const fetchAvailableTokens = async () => {
      setIsLoadingAvailableTokens(true);
      try {
        const response = await getCurrencyConverters(fromCurrency.systemName);
        if (!response?.result) {
          console.error('Invalid API response structure:', response);
          return;
        }

        const availableTokens = new Set<string>();
        
        if (fromCurrency.isConverter) {
          const converter = response.result.find(c => c.fullyqualifiedname === fromCurrency.systemName);
          if (converter?.lastnotarization?.currencystate?.reservecurrencies) {
            converter.lastnotarization.currencystate.reservecurrencies.forEach(reserve => {
              const currency = currencies.find(c => c.iAddress === reserve.currencyid && c.enabled);
              if (currency) availableTokens.add(currency.systemName);
            });
          }
        } else {
          response.result.forEach(converter => {
            const converterCurrency = currencies.find(c => c.systemName === converter.fullyqualifiedname);
            if (!converterCurrency?.enabled || !converter.lastnotarization?.currencystate?.reservecurrencies) return;

            const reserves = converter.lastnotarization.currencystate.reservecurrencies;
            const hasFromCurrency = reserves.some(r => r.currencyid === fromCurrency.iAddress);
            
            if (hasFromCurrency) {
              if (converterCurrency) availableTokens.add(converter.fullyqualifiedname);
              
              reserves.forEach(reserve => {
                if (reserve.currencyid === fromCurrency.iAddress) return;
                const currency = currencies.find(c => c.iAddress === reserve.currencyid && c.enabled);
                if (!currency) return;

                const hasConversionPath = converter.lastnotarization.currencystate.currencies[reserve.currencyid]?.lastconversionprice > 0;
                if (hasConversionPath) availableTokens.add(currency.systemName);
              });
            }
          });
        }

        const filteredCurrencies = currencies.filter(c => c.enabled && availableTokens.has(c.systemName));
        setAvailableToTokens(filteredCurrencies);
      } catch (error: any) {
        console.error('Error fetching available tokens:', error);
        const defaultTokens = currencies.filter(c => c.enabled && ['VRSC'].includes(c.systemName));
        setAvailableToTokens(defaultTokens);
      } finally {
        setIsLoadingAvailableTokens(false);
      }
    };

    fetchAvailableTokens();
  }, [fromCurrency]);

  // Update conversion estimate
  useEffect(() => {
    if (!fromCurrency || !toCurrency || !amount) {
      setEstimatedAmount('');
      setConversionFee(undefined);
      setLiquidityExceeded(false);
      setMaxAvailableAmount(undefined);
      return;
    }

    const updateEstimate = async () => {
      setIsLoadingEstimate(true);
      try {
        const convertersResponse = await getCurrencyConverters(fromCurrency.systemName, toCurrency.systemName);
        const bestPath = findBestConverter(convertersResponse, fromCurrency.iAddress, toCurrency.iAddress);

        if (!bestPath) {
          setEstimatedAmount('');
          setConversionFee(undefined);
          return;
        }

        const toReserve = bestPath.converter.lastnotarization.currencystate.reservecurrencies.find(
          r => r.currencyid === toCurrency.iAddress
        );

        const request: ConversionRequest = {
          currency: fromCurrency.systemName,
          convertto: toCurrency.systemName,
          amount: parseFloat(amount)
        };

        if (!bestPath.isDirectConverter) {
          request.via = bestPath.converter.fullyqualifiedname;
        }

        const estimate = await estimateConversion(request);

        if (toReserve) {
          const estimatedOut = estimate.result.estimatedcurrencyout;
          setMaxAvailableAmount(toReserve.reserves);
          setLiquidityExceeded(estimatedOut > toReserve.reserves);
        }

        const inputAmount = parseFloat(amount);
        const netInputAmount = estimate.result.netinputamount;
        const feeAmount = inputAmount - netInputAmount;
        setConversionFee(feeAmount);
        
        setEstimatedAmount(estimate.result.estimatedcurrencyout.toString());
      } catch (error) {
        console.error('Error updating estimate:', error);
        setEstimatedAmount('');
        setConversionFee(undefined);
      } finally {
        setIsLoadingEstimate(false);
      }
    };

    const timeoutId = setTimeout(updateEstimate, 500);
    return () => clearTimeout(timeoutId);
  }, [fromCurrency, toCurrency, amount]);

  return {
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
    setFromCurrency: handleFromCurrencyChange,
    setToCurrency,
    setAmount,
    toggleIDontCareMode,
  };
} 
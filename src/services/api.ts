import { ConverterResponse, EstimateConversionResponse, ConversionRequest, ConverterCurrency } from '../types/api';
import { findCurrencyByIAddress, findCurrencyBySystemName, Currency } from '@/components/CurrencyList';

const API_URL = 'https://api.verus.services';

async function makeRequest<T>(method: string, params: any[]): Promise<T> {
  console.log('Making API request:', { method, params });
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "curltest",
        method,
        params
      })
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);

    if (data.error) {
      throw new Error(`API error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return data;
  } catch (error: any) {
    console.error('API request failed:', {
      method,
      params,
      error: error.message
    });
    throw error;
  }
}

export async function getCurrencyConverters(fromCurrency: string, toCurrency?: string): Promise<ConverterResponse> {
  const params = toCurrency ? [fromCurrency, toCurrency] : [fromCurrency];
  return makeRequest<ConverterResponse>('getcurrencyconverters', params);
}

export async function estimateConversion(request: ConversionRequest): Promise<EstimateConversionResponse> {
  // Find the currency objects to check if either is a converter
  const fromCurrency = findCurrencyBySystemName(request.currency);
  const toCurrency = findCurrencyBySystemName(request.convertto);

  // If either currency is a converter, don't use the via parameter
  if ((fromCurrency?.isConverter || toCurrency?.isConverter) && request.via) {
    const { via, ...requestWithoutVia } = request;
    return makeRequest<EstimateConversionResponse>('estimateconversion', [requestWithoutVia]);
  }

  return makeRequest<EstimateConversionResponse>('estimateconversion', [request]);
}

interface ConverterPath {
  converter: ConverterCurrency;
  liquidityScore: number;
  isDirectConverter: boolean;
}

export function findBestConverter(
  response: ConverterResponse, 
  fromCurrencyId: string, 
  toCurrencyId: string
): ConverterPath | null {
  // Get the currency objects
  const fromCurrency = findCurrencyByIAddress(fromCurrencyId);
  const toCurrency = findCurrencyByIAddress(toCurrencyId);

  if (!fromCurrency?.enabled || !toCurrency?.enabled) {
    console.log('One or both currencies are disabled');
    return null;
  }

  // If either currency is a converter, we don't need a via path
  if (fromCurrency.isConverter || toCurrency.isConverter) {
    console.log('Direct converter path available');
    return {
      converter: response.result[0], // We still need a converter object for the response
      liquidityScore: Infinity, // Use infinity to ensure this path is preferred
      isDirectConverter: true
    };
  }

  // Look for the best path through converters
  return response.result.reduce<ConverterPath | null>((best, current) => {
    // Skip if the converter itself is disabled
    const converterCurrency = findCurrencyByIAddress(
      current.lastnotarization.currencystate.reservecurrencies[0].currencyid
    );
    if (!converterCurrency?.enabled) {
      console.log('Skipping disabled converter:', current.fullyqualifiedname);
      return best;
    }

    const currencyState = current.lastnotarization.currencystate;
    const reserves = currencyState.reservecurrencies;
    
    const fromReserve = reserves.find(r => r.currencyid === fromCurrencyId);
    const toReserve = reserves.find(r => r.currencyid === toCurrencyId);
    
    // Skip if either currency is not in reserves or is disabled
    if (!fromReserve || !toReserve || 
        !findCurrencyByIAddress(fromReserve.currencyid)?.enabled || 
        !findCurrencyByIAddress(toReserve.currencyid)?.enabled) {
      console.log('Skipping converter due to missing or disabled reserves:', current.fullyqualifiedname);
      return best;
    }
    
    const liquidityScore = fromReserve.reserves * toReserve.reserves;
    
    if (!best || liquidityScore > best.liquidityScore) {
      return { 
        converter: current, 
        liquidityScore,
        isDirectConverter: false
      };
    }
    
    return best;
  }, null);
} 
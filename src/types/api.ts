// API Types for Verus Currency Conversion

export interface ConverterResponse {
  result: ConverterCurrency[];
}

export interface ConverterCurrency {
  fullyqualifiedname: string;
  height: number;
  lastnotarization: {
    currencystate: {
      currencies: Record<string, CurrencyState>;
      reservecurrencies: ReserveCurrency[];
    }
  }
}

export interface CurrencyState {
  lastconversionprice: number;
  viaconversionprice: number;
  reservein: number;
  reserveout: number;
  conversionfees: number;
  fees: number;
}

export interface ReserveCurrency {
  currencyid: string;
  priceinreserve: number;
  reserves: number;
  weight: number;
}

export interface EstimateConversionResponse {
  result: {
    estimatedcurrencyout: number;
    netinputamount: number;
    inputcurrencyid: string;
    outputcurrencyid: string;
    estimatedcurrencystate?: {
      currencies: {
        [key: string]: {
          conversionfees: number;
          fees: number;
          lastconversionprice: number;
          viaconversionprice: number;
          reservein: number;
          reserveout: number;
        }
      }
    }
  }
}

export interface ConversionRequest {
  currency: string;
  convertto: string;
  amount: number;
  via?: string;
} 
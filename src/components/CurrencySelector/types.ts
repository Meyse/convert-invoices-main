import { Currency } from '../CurrencyList';

export interface CurrencySelectorProps {
  label: string;
  selectedCurrency?: Currency;
  onSelect: (currency: Currency) => void;
  availableCurrencies: Currency[];
  amount?: string;
  onAmountChange?: (value: string) => void;
  estimatedAmount?: string;
  isOutput?: boolean;
  isLoading?: boolean;
  variant?: 'sell' | 'buy';
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface CurrencyOptionProps {
  currency: Currency;
  onSelect: () => void;
}

export interface CurrencyListProps {
  currencies: Currency[];
  onSelect: (currency: Currency) => void;
  isLoading?: boolean;
}

export interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: Currency) => void;
  availableCurrencies: Currency[];
  isLoading?: boolean;
}

export interface AmountInputProps {
  amount?: string;
  onChange?: (value: string) => void;
  isOutput?: boolean;
  estimatedAmount?: string;
  isLoading?: boolean;
} 
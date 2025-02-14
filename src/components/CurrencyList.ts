interface Currency {
  systemName: string;
  tradingSymbol: string;
  iAddress: string;
  icon?: string;
  isConverter: boolean;
  enabled: boolean;
}

// Helper function to get only enabled currencies
export const getEnabledCurrencies = () => currencies.filter(c => c.enabled);

export const currencies: Currency[] = [
  {
    systemName: "VRSC",
    tradingSymbol: "VRSC",
    iAddress: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "vETH",
    tradingSymbol: "ETH",
    iAddress: "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "tBTC.vETH",
    tradingSymbol: "TBTC",
    iAddress: "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "DAI.vETH",
    tradingSymbol: "DAI",
    iAddress: "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "MKR.vETH",
    tradingSymbol: "MKR",
    iAddress: "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "Bridge.vETH",
    tradingSymbol: "Bridge.vETH",
    iAddress: "i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx",
    icon: "#",
    isConverter: true,
    enabled: true
  },
  {
    systemName: "CHIPS",
    tradingSymbol: "CHIPS",
    iAddress: "iJ3WZocnjG9ufv7GKUA4LijQno5gTMb7tP",
    icon: "#",
    isConverter: false,
    enabled: false
  },
  {
    systemName: "EURC.vETH",
    tradingSymbol: "EURC",
    iAddress: "iC5TQFrFXSYLQGkiZ8FYmZHFJzaRF5CYgE",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "Kaiju",
    tradingSymbol: "Kaiju",
    iAddress: "i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb",
    icon: "#",
    isConverter: true,
    enabled: true
  },
  {
    systemName: "Pure",
    tradingSymbol: "Pure",
    iAddress: "iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY",
    icon: "#",
    isConverter: true,
    enabled: true
  },
  {
    systemName: "NATI🦉",
    tradingSymbol: "NATI🦉",
    iAddress: "iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw",
    icon: "#",
    isConverter: true,
    enabled: true
  },
  {
    systemName: "Switch",
    tradingSymbol: "Switch",
    iAddress: "i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc",
    icon: "#",
    isConverter: true,
    enabled: true
  },
  {
    systemName: "SUPERVRSC",
    tradingSymbol: "SUPERVRSC",
    iAddress: "iHnYAmrS45Hb8GVgyzy7nVQtZ5vttJ9N3X",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "vYIELD",
    tradingSymbol: "vYIELD",
    iAddress: "iAik7rePReFq2t7LZMZhHCJ52fT5pisJ5C",
    icon: "#",
    isConverter: true,
    enabled: true
  },
  {
    systemName: "Kek🐸",
    tradingSymbol: "Kek🐸",
    iAddress: "iCDjBN71SbSppgsNTpwwMBT69399DpV4hA",
    icon: "#",
    isConverter: true,
    enabled: true
  },
  {
    systemName: "pepecoin.vETH",
    tradingSymbol: "PEPE",
    iAddress: "i5VVBEi6efBrXMaeqFW3MTPSzbmpNLysGR",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "NATI.vETH",
    tradingSymbol: "NATI",
    iAddress: "iL62spNN42Vqdxh8H5nrfNe8d6Amsnfkdx",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "SUPERNET",
    tradingSymbol: "SUPERNET",
    iAddress: "i6SapneNdvpkrLPgqPhDVim7Ljek3h2UQZ",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "vARRR",
    tradingSymbol: "vARRR",
    iAddress: "iExBJfZYK7KREDpuhj6PzZBzqMAKaFg7d2",
    icon: "#",
    isConverter: false,
    enabled: false
  },
  {
    systemName: "vDEX",
    tradingSymbol: "vDEX",
    iAddress: "iHog9UCTrn95qpUBFCZ7kKz7qWdMA8MQ6N",
    icon: "#",
    isConverter: false,
    enabled: false
  },
  {
    systemName: "scrvUSD.vETH",
    tradingSymbol: "scrvUSD",
    iAddress: "i9nLSK4S1U5sVMq4eJUHR1gbFALz56J9Lj",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "vUSDC.vETH",
    tradingSymbol: "USDC",
    iAddress: "i61cV2uicKSi1rSMQCBNQeSYC3UAi9GVzd",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "vUSDT.vETH",
    tradingSymbol: "USDT",
    iAddress: "i9oCSqKALwJtcv49xUKS2U2i79h1kX6NEY",
    icon: "#",
    isConverter: false,
    enabled: true
  },
  {
    systemName: "NATI",
    tradingSymbol: "NATI",
    iAddress: "iRt7tpLewArQnRddBVFARGKJStK6w5pDmC",
    icon: "#",
    isConverter: true,
    enabled: true
  },
  {
    systemName: "Bridge.CHIPS",
    tradingSymbol: "Bridge.CHIPS",
    iAddress: "i3nokiCTVevZMLpR3VmZ7YDfCqA5juUqqH",
    icon: "#",
    isConverter: true,
    enabled: false
  },
  {
    systemName: "Bridge.vDEX",
    tradingSymbol: "Bridge.vDEX",
    iAddress: "i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9",
    icon: "#",
    isConverter: true,
    enabled: false
  },
  {
    systemName: "Bridge.vARRR",
    tradingSymbol: "Bridge.vARRR",
    iAddress: "iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB",
    icon: "#",
    isConverter: true,
    enabled: false
  }
];

// Helper functions to work with the currency list
export const findCurrencyBySystemName = (systemName: string): Currency | undefined => {
  return currencies.find(currency => currency.systemName === systemName && currency.enabled);
};

export const findCurrencyByTradingSymbol = (tradingSymbol: string): Currency | undefined => {
  return currencies.find(currency => currency.tradingSymbol === tradingSymbol && currency.enabled);
};

export const findCurrencyByIAddress = (iAddress: string): Currency | undefined => {
  return currencies.find(currency => currency.iAddress === iAddress && currency.enabled);
};

// New helper function to get all converter currencies
export const getConverterCurrencies = (): Currency[] => {
  return currencies.filter(currency => currency.isConverter && currency.enabled);
};

// Types export
export type { Currency }; 
# Verus Currency Converter Design Document

## Overview
A web-based currency conversion interface that allows users to generate VerusPay invoices for cross-currency conversions. The interface follows a Uniswap-style design pattern with simplified functionality focused on currency selection and invoice generation.

## Core Features

### 1. Currency Selection Interface
- Two main currency selection panels:
  - "Send" currency (input amount)
  - "Receive" currency (calculated amount)
- Currency swap button between panels
- Three predefined frequent pairs:
  - TBTC → VRSC
  - ETH → VRSC
  - DAI → VRSC

### 2. Rate Calculation
- Real-time rate fetching when:
  - Either currency is changed
  - Every 30 seconds if the same pair remains selected
- No visual countdown/expiration indicators needed
- Display calculated receive amount based on current rate

### 3. Destination Input
- Text input field for R-address or VerusID
- Validation rules:
  - R-addresses: Must be 34 characters
  - VerusIDs: Must end with '@'
- No address storage or history

### 4. Invoice Generation
- Generate button becomes active when:
  - Valid send amount entered
  - Both currencies selected
  - Valid destination address provided
- Uses VerusPay invoice system with:
  - Required fields:
    - amount (estimated receive amount)
    - requestedcurrencyid (receiving currency)
    - destination (validated R-address or VerusID)
  - Flags:
    - acceptsConversion: true
    - All other flags: default values

### 5. Mobile Integration
- Platform detection for appropriate UI rendering
- Two invoice access methods:
  - QR code (desktop)
  - Deep link to Verus Mobile (mobile)
- Fallback for users without Verus Mobile:
  - Redirect to download page
  - App store links

## User Interface Design

### Layout Components
1. **Header**
   - Application title/logo
   - Optional: Network status indicator

2. **Main Conversion Panel**
   - Currency Selection Areas
     - "From" section with amount input
     - Swap button
     - "To" section with calculated amount
   - Each currency selector shows:
     - Currency icon (placeholder #)
     - System name
     - Trading symbol

3. **Frequent Pairs**
   - Quick selection buttons for common pairs
   - Positioned above or below main panel
   - Shows both currencies with minimal styling

4. **Destination Input**
   - Clear label indicating purpose
   - Validation feedback
   - Full-width text input

5. **Action Area**
   - Primary action button (Generate Invoice)
   - Changes state based on input validity

6. **Result Display**
   - QR code or deep link based on platform
   - Clear instructions for next steps

## Technical Considerations

### API Integration
1. **Rate Updates**
   - Initial fetch on currency pair selection
   - 30-second refresh interval when pair remains unchanged
   - Cancel pending requests on currency changes

2. **Platform Detection**
```typescript
interface PlatformFeatures {
  isMobile: boolean;
  canDeepLink: boolean;
}
```

3. **Address Validation**
```typescript
interface ValidationRules {
  rAddress: RegExp; // 34 characters
  verusId: RegExp;  // ends with @
}
```

### State Management
1. **Core State**
```typescript
interface ConverterState {
  sendCurrency: Currency;
  receiveCurrency: Currency;
  sendAmount: string;
  receiveAmount: string;
  destinationAddress: string;
  isValid: boolean;
  currentRate?: number;
}
```

2. **Rate Update Logic**
```typescript
interface RateUpdate {
  timestamp: number;
  rate: number;
  pair: string;
}
```

## Error Handling

### User Input Errors
1. Invalid address format
2. Zero or negative amounts
3. Incomplete currency selection

### System Errors
1. Rate fetch failures
2. Invoice generation issues
3. Network connectivity problems

## Future Considerations

### Potential Enhancements
1. Transaction history (if needed)
2. Additional currency pairs
3. Rate trend indicators
4. Multiple language support

### Performance Optimizations
1. Rate caching
2. Debounced API calls
3. Progressive loading of currency list

## Development Phases

### Phase 1: Core Functionality
1. Basic UI implementation
2. Currency selection
3. Rate fetching
4. Address validation

### Phase 2: Invoice Integration
1. VerusPay implementation
2. QR code generation
3. Deep linking

### Phase 3: Mobile Support
1. Responsive design
2. Platform detection
3. Fallback implementation

### Phase 4: Polish
1. Error handling
2. Loading states
3. UI/UX improvements
4. Testing and optimization

## Questions for Future Iterations
1. Should we add support for more frequent pairs?
2. Do we need analytics for most used currency pairs?
3. Should we add any educational content about Verus Mobile?
4. Do we need any additional validation rules for addresses? 
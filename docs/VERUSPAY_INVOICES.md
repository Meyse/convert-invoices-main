# VerusPay Invoices Documentation

## Overview
VerusPay Invoices is a component of the verusid-ts-client that enables creation, signing, and verification of payment invoices on the Verus blockchain. This system provides a secure and verifiable way to request and process payments.

## Basic Concepts

### Invoice Structure
A VerusPay invoice consists of:
- Payment details (amount, currency, destination)
- Optional signature from a VerusID
- Chain information
- QR code and wallet deeplink capabilities

## Usage Guide

### 1. Creating an Invoice

#### Basic Invoice Creation
```typescript
// 1. Create invoice details
const invoiceDetails = new VerusPayInvoiceDetails({
    amount: new BigNumber(amount, 10), // Amount in smallest unit of currency
    destination: new TransferDestination({
        type: DEST_PKH,
        destination_bytes: fromBase58Check(yourAddress).hash
    }),
    requestedcurrencyid: "your_currency_id" // The currency you want to receive
});

// 2. Create the invoice
const invoice = await verusIdClient.createVerusPayInvoice(
    invoiceDetails,
    signingIdIAddr,      // Optional: The VerusID that will sign the invoice
    primaryAddrWif,      // Optional: The private key to sign with
    getIdentityResult,   // Optional: Pre-fetched identity info
    currentHeight,       // Optional: Current blockchain height
    chainIAddr          // Optional: Chain ID
);
```

#### Setting Invoice Flags
You can customize invoice behavior by setting various flags:

```typescript
invoice.setFlags({
    acceptsConversion: boolean,       // Allow currency conversion for payment
    acceptsNonVerusSystems: boolean,  // Accept payments from non-Verus systems
    expires: boolean,                 // Enable invoice expiration
    acceptsAnyAmount: boolean,        // Allow any payment amount
    acceptsAnyDestination: boolean,   // Allow payment to any destination
    excludesVerusBlockchain: boolean, // Exclude Verus blockchain payments
    isTestnet: boolean               // Mark as testnet invoice
});
```

Flag descriptions:
- `acceptsConversion`: Allows the payment to be made in a different currency that will be converted
- `acceptsNonVerusSystems`: Enables payments from systems outside the Verus ecosystem
- `expires`: Indicates that the invoice has an expiration time
- `acceptsAnyAmount`: Allows the payer to send any amount (useful for donations)
- `acceptsAnyDestination`: Permits payment to be sent to any destination
- `excludesVerusBlockchain`: Prevents payments directly on the Verus blockchain
- `isTestnet`: Marks the invoice for testnet use only

Example usage:
```typescript
// Create an invoice that accepts any amount (like a donation) and allows currency conversion
invoice.setFlags({
    acceptsAnyAmount: true,
    acceptsConversion: true
});

// Create a testnet invoice that expires
invoice.setFlags({
    isTestnet: true,
    expires: true
});
```

### 2. Verifying an Invoice

```typescript
const isValid = await verusIdClient.verifySignedVerusPayInvoice(
    invoice,
    getIdentityResult,  // Optional: Pre-fetched identity info
    chainIAddr         // Optional: Chain ID
);
```

### 3. Additional Features

#### QR Code Generation
Convert an invoice to a QR-friendly string:
```typescript
const qrString = invoice.toQrString();
```

#### Wallet Integration
Generate a wallet-compatible URI:
```typescript
const walletUri = invoice.toWalletDeeplinkUri();
```

## Key Parameters

### Required Parameters
- `amount`: Payment amount (in smallest currency unit)
- `destination`: Payment destination address
- `requestedcurrencyid`: Currency identifier for payment

### Optional Parameters
- `signingIdIAddr`: VerusID for signing the invoice
- `primaryAddrWif`: Private key for signing
- `chainIAddr`: Blockchain system identifier
- `getIdentityResult`: Pre-fetched identity information
- `currentHeight`: Current blockchain height

## Best Practices

1. **Security**
   - Always verify signed invoices before processing payments
   - Keep private keys secure and never expose them
   - Validate all input parameters before creating invoices

2. **Implementation**
   - Use appropriate currency precision
   - Implement proper error handling
   - Store invoice details securely if needed for later verification

3. **User Experience**
   - Implement QR code scanning for easy invoice importing
   - Provide clear feedback on invoice status
   - Include relevant payment information in human-readable format

## Error Handling

Common scenarios to handle:
- Invalid signatures
- Network connectivity issues
- Invalid currency identifiers
- Insufficient permissions for signing

## Example Implementation

Here's a complete example of creating and verifying a signed invoice:

```typescript
try {
    // Create invoice details
    const invoiceDetails = new VerusPayInvoiceDetails({
        amount: new BigNumber("1000000000", 10), // 10 units
        destination: new TransferDestination({
            type: DEST_PKH,
            destination_bytes: fromBase58Check("YourAddress").hash
        }),
        requestedcurrencyid: "iJhCezBExJHvtyH3fGhNnt2NhU4Ztkf2yq"
    });

    // Create and sign the invoice
    const invoice = await verusIdClient.createVerusPayInvoice(
        invoiceDetails,
        "your_verus_id",
        "your_private_key"
    );

    // Set any required flags
    invoice.setFlags({
        acceptsConversion: true,
        expires: true
    });

    // Generate QR code string
    const qrString = invoice.toQrString();

    // Generate wallet URI
    const walletUri = invoice.toWalletDeeplinkUri();

    // Verify the invoice
    const isValid = await verusIdClient.verifySignedVerusPayInvoice(invoice);

    if (isValid) {
        // Process the valid invoice
        console.log("Invoice is valid");
    }
} catch (error) {
    console.error("Error processing invoice:", error);
}
```

## Integration Tips

1. **Frontend Integration**
   - Use QR code libraries to display invoice QRs
   - Implement wallet connection features
   - Provide clear payment instructions

2. **Backend Integration**
   - Store invoice records securely
   - Implement webhook notifications for payment status
   - Monitor blockchain for payment confirmation

## Troubleshooting

Common issues and solutions:
1. **Invalid Signature**
   - Verify the correct private key is being used
   - Check if the VerusID has necessary permissions

2. **Network Issues**
   - Implement proper retry logic
   - Handle timeout scenarios gracefully

3. **Invalid Parameters**
   - Validate all input parameters
   - Ensure currency identifiers are correct
   - Verify addresses are in the correct format

## Additional Resources

- [Verus Documentation](https://docs.verus.io/)
- [VerusID TypeScript Client](https://github.com/VerusCoin/verusid-ts-client)
- [Verus Blockchain Explorer](https://explorer.verus.io/)
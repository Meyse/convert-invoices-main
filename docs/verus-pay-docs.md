# Creating a Verus Pay Invoice

This guide outlines the steps to create a Verus Pay invoice and generate a payment URI.

## Step 1: Create the Invoice

First, create a Verus Pay invoice using the `createVerusPayInvoice` function with a `VerusPayInvoiceDetails` object:

```javascript
const invoice = await createVerusPayInvoice(
    new primitives.VerusPayInvoiceDetails({
        // Amount in satoshis
        amount: new primitives.BigNumber(
            coinsToSats(BigNumber(amount)).toString(),
            10,
        ),
        // Destination details
        destination: new primitives.TransferDestination({
            type: primitives.DEST_PKH, // or primitives.DEST_ID
            destination_bytes: fromBase58Check(destination).hash // r-addr for DEST_PKH, i-addr for DEST_ID
        }),
        // Currency identifier (must be an i-addr)
        requestedcurrencyid: "i-address-of-invoice-currency",
        // Optional: Array of accepted system i-addresses
        // Leave empty if only accepting VRSC chain transactions
        acceptedsystems: [], 
        // Maximum estimated slippage (0.5% in this example)
        maxestimatedslippage: new primitives.BigNumber(
            coinsToSats(BigNumber('0.005')).toString(),
            10,
        ),
    })
);
```

## Step 2: Set Invoice Flags

After creating the invoice, set the payment flags:

```javascript
invoice.details.setFlags({
    // Whether to accept currency conversion
    acceptsConversion: true, // or false
    
    // Whether to accept non-Verus systems
    // Set to true if acceptedsystems is specified above
    acceptsNonVerusSystems: false,
    
    // Whether to accept amounts different from specified amount
    acceptsAnyAmount: false // or true
});
```

## Step 3: Generate Payment URI

Finally, generate a payment URI that can be used in a QR code or as a redirect URL:

```javascript
const paymentUri = invoice.toWalletDeeplinkUri();
```

The resulting `paymentUri` string can be:
- Encoded into a QR code for scanning
- Used as a redirect URL for the user

## Notes
- For `DEST_PKH`, use an r-address in the destination field
- For `DEST_ID`, use an i-address in the destination field
- The `requestedcurrencyid` must always be an i-address
- VRSC system is assumed by default; no need to include it in `acceptedsystems`

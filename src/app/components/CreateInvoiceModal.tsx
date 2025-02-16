import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { VerusPayInvoice, VerusPayInvoiceDetails } from "verus-typescript-primitives";
import { DEST_PKH, DEST_ID, TransferDestination } from "verus-typescript-primitives";
import { fromBase58Check } from "verus-typescript-primitives";
import { HelpCircle, Download } from 'lucide-react';
import Image from 'next/image';

import BN from "bn.js";
import { Slider } from './Slider';
import { Currency } from '@/components/CurrencyList';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  toCurrency?: Currency;
  amount: string;
  destinationAddress: string;
  destinationIAddress?: string;
  liquidityInfo?: {
    maxAvailableAmount?: number;
    conversionPath?: string[];
  };
}

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-[#1B1E23] text-white text-xs rounded-lg shadow-lg z-50">
          {content}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#1B1E23]" />
        </div>
      )}
    </div>
  );
}

// Helper function to convert amount to satoshis (8 decimals)
const toSats = (amount: number): BN => {
  return new BN(Math.round(amount * 100000000).toString());
};

export function CreateInvoiceModal({
  isOpen,
  onClose,
  toCurrency,
  amount,
  destinationAddress,
  destinationIAddress,
  liquidityInfo
}: CreateInvoiceModalProps) {
  const [step, setStep] = useState<'review' | 'qr'>('review');
  const [showQR, setShowQR] = useState(false);
  const [qrString, setQrString] = useState<string | null>(null);
  const [slippage, setSlippage] = useState(0.5);
  const [suggestedSlippage, setSuggestedSlippage] = useState(0.5);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);

  // Calculate slippage only when the modal opens or when amount/liquidity actually changes
  useEffect(() => {
    if (!isOpen || !amount) return;

    const amountNum = parseFloat(amount);
    let newSlippage = 0.5; // Start with base slippage of 0.5%

    console.log('Starting slippage calculation with:', {
      amount: amountNum,
      maxAvailableAmount: liquidityInfo?.maxAvailableAmount,
      conversionPath: liquidityInfo?.conversionPath
    });

    // Calculate slippage based on liquidity ratio
    if (liquidityInfo?.maxAvailableAmount) {
      const liquidityRatio = amountNum / liquidityInfo.maxAvailableAmount;
      console.log(`Liquidity check - Amount: ${amountNum}, Max Available: ${liquidityInfo.maxAvailableAmount}, Ratio: ${liquidityRatio}`);
      
      if (liquidityRatio > 0.20) {
        // Using more than 20% of liquidity - cap at 20%
        newSlippage = 20.0;
        console.log(`Extreme liquidity impact (${(liquidityRatio * 100).toFixed(1)}%): Setting slippage to ${newSlippage}%`);
      } else if (liquidityRatio > 0.10) {
        // Using 10-20% of liquidity - linear increase from 10% to 15%
        const calculatedSlippage = 10.0 + (liquidityRatio - 0.10) * 50; // 50 = (15-10)/(0.20-0.10)
        newSlippage = Math.ceil(calculatedSlippage); // Round up to next whole number
        console.log(`Very high liquidity impact (${(liquidityRatio * 100).toFixed(1)}%): Setting slippage to ${newSlippage}%`);
      } else if (liquidityRatio > 0.05) {
        // Using 5-10% of liquidity - linear increase from 5% to 10%
        const calculatedSlippage = 5.0 + (liquidityRatio - 0.05) * 100; // 100 = (10-5)/(0.10-0.05)
        newSlippage = Math.ceil(calculatedSlippage); // Round up to next whole number
        console.log(`High liquidity impact (${(liquidityRatio * 100).toFixed(1)}%): Setting slippage to ${newSlippage}%`);
      } else if (liquidityRatio > 0.02) {
        // Using 2-5% of liquidity - linear increase from 2% to 5%
        const calculatedSlippage = 2.0 + (liquidityRatio - 0.02) * 100; // 100 = (5-2)/(0.05-0.02)
        newSlippage = Math.ceil(calculatedSlippage * 2) / 2; // Round up to nearest 0.5
        console.log(`Medium liquidity impact (${(liquidityRatio * 100).toFixed(1)}%): Setting slippage to ${newSlippage}%`);
      } else if (liquidityRatio > 0.005) {
        // Using 0.5-2% of liquidity - linear increase from 0.5% to 2%
        const calculatedSlippage = 0.5 + (liquidityRatio - 0.005) * 100; // 100 = (2-0.5)/(0.02-0.005)
        newSlippage = Math.ceil(calculatedSlippage * 2) / 2; // Round up to nearest 0.5
        console.log(`Low liquidity impact (${(liquidityRatio * 100).toFixed(1)}%): Setting slippage to ${newSlippage}%`);
      } else {
        // Using less than 0.5% of liquidity - keep base slippage
        console.log(`Minimal liquidity impact (${(liquidityRatio * 100).toFixed(1)}%): Using base slippage of ${newSlippage}%`);
      }

      // Store the price impact for UI display
      setPriceImpact(liquidityRatio * 100);
    } else {
      console.log('No maxAvailableAmount provided, using base slippage');
      setPriceImpact(null);
    }

    // Cap at 20% - anything higher is probably too risky
    newSlippage = Math.min(newSlippage, 20);
    console.log(`Final slippage: ${newSlippage}%`);
    
    setSuggestedSlippage(newSlippage);
    setSlippage(newSlippage);
  }, [isOpen, amount, liquidityInfo?.maxAvailableAmount]);

  // Reset state when modal is closed
  const handleClose = () => {
    onClose();
    setStep('review');
    setQrString(null);
  };

  // Reset step when modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep('review');
      setQrString(null);
    }
  }, [isOpen]);

  const handleCreateInvoice = async () => {
    try {
      const details = new VerusPayInvoiceDetails({
        amount: toSats(parseFloat(amount)),
        destination: new TransferDestination({
          type: destinationIAddress ? DEST_ID : DEST_PKH,
          destination_bytes: destinationIAddress 
            ? fromBase58Check(destinationIAddress).hash 
            : Buffer.from(destinationAddress)
        }),
        requestedcurrencyid: toCurrency?.iAddress || "",
        acceptedsystems: [],
        maxestimatedslippage: toSats(slippage / 100) // Convert percentage to decimal
      });

      details.setFlags({
        acceptsConversion: true,
        acceptsNonVerusSystems: false,
        acceptsAnyAmount: false
      });

      const invoice = new VerusPayInvoice({ details });
      const uri = invoice.toWalletDeeplinkUri();
      console.log('Generated URI:', uri); // Add logging to help debug
      setQrString(uri);
      setStep('qr');
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleSaveImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with 1.5x resolution
    canvas.width = 600;
    canvas.height = 750;

    // Fill background
    ctx.fillStyle = '#0D111C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get QR code canvas
    const qrCanvas = document.querySelector('canvas');
    if (!qrCanvas) return;

    // Create larger white background for QR code with padding
    ctx.fillStyle = '#FFFFFF';
    const qrBackgroundSize = 400;
    const qrBackgroundX = (canvas.width - qrBackgroundSize) / 2;
    const qrBackgroundY = 50;
    ctx.fillRect(qrBackgroundX, qrBackgroundY, qrBackgroundSize, qrBackgroundSize);

    // Draw QR code in the center of white background
    const qrSize = 300;
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = qrBackgroundY + (qrBackgroundSize - qrSize) / 2;
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Add text with larger fonts
    ctx.fillStyle = '#838A9E';
    ctx.textAlign = 'center';
    ctx.font = 'bold 30px Inter, system-ui, sans-serif';
    ctx.fillText(`${amount} ${toCurrency?.tradingSymbol}`, canvas.width/2, 520);

    ctx.fillStyle = '#838A9E';
    ctx.font = '24px Inter, system-ui, sans-serif';
    ctx.fillText('to', canvas.width/2, 570);

    // Handle address display
    if (destinationAddress.endsWith('@')) {
      // Draw VerusID prominently
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px Inter, system-ui, sans-serif';
      ctx.fillText(destinationAddress, canvas.width/2, 620);

      // Draw i-address below in smaller, lighter text
      ctx.fillStyle = '#838A9E';
      ctx.font = '21px Inter, system-ui, sans-serif';
      const words = destinationIAddress?.match(/.{1,30}/g) || [];
      let y = 660;
      words.forEach(line => {
        ctx.fillText(line, canvas.width/2, y);
        y += 30;
      });
    } else {
      // Regular address display
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '21px Inter, system-ui, sans-serif';
      const words = destinationAddress.match(/.{1,30}/g) || [];
      let y = 620;
      words.forEach(line => {
        ctx.fillText(line, canvas.width/2, y);
        y += 30;
      });
    }

    // Create download link
    const link = document.createElement('a');
    link.download = `verus-invoice-${amount}-${toCurrency?.tradingSymbol}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#0D111C] md:rounded-[24px] rounded-none p-4 md:p-6 w-full max-w-md md:m-auto m-0 md:h-auto h-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {step === 'qr' && (
              <button
                onClick={() => setStep('review')}
                className="text-[#838A9E] hover:text-white"
              >
                ← Back
              </button>
            )}
            <h2 className="text-lg md:text-xl text-white">
              {step === 'review' ? 'Review Invoice' : 'Scan QR Code'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="text-[#838A9E] hover:text-white"
          >
            ✕
          </button>
        </div>

        {step === 'review' ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-[#090A0E] p-4 rounded-lg">
                <div className="text-[#838A9E] text-sm mb-1">Destination</div>
                <div className="text-white break-all">{destinationAddress}</div>
                {destinationIAddress && (
                  <div className="text-[#838A9E] text-xs mt-1 break-all">
                    {destinationIAddress}
                  </div>
                )}
              </div>

              <div className="bg-[#090A0E] p-4 rounded-lg">
                <div className="text-[#838A9E] text-sm mb-1">Amount</div>
                <div className="text-white">
                  {amount} {toCurrency?.tradingSymbol}
                </div>
              </div>

              <div className="bg-[#090A0E] p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-[#838A9E] text-sm">Maximum Slippage</div>
                    <Tooltip content="Maximum allowed difference between estimated and actual conversion outcome. Higher values may be needed for larger trades due to their impact on available liquidity.">
                      <HelpCircle size={14} className="text-[#838A9E]" />
                    </Tooltip>
                  </div>
                  <div className="text-white">{slippage}%</div>
                </div>
                <Slider
                  value={slippage}
                  onChange={setSlippage}
                  min={0.5}
                  max={Math.max(20, suggestedSlippage)}
                  step={0.5}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-[#838A9E] text-xs">
                    Suggested: {suggestedSlippage}%
                  </div>
                  {priceImpact !== null && (
                    <div className={`text-xs ${
                      priceImpact > 5 
                        ? 'text-red-500' 
                        : priceImpact > 2 
                          ? 'text-yellow-500' 
                          : 'text-green-500'
                    }`}>
                      Price Impact: {priceImpact.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateInvoice}
              className="w-full bg-[#3165D4] hover:bg-[#3165D4]/90 text-white rounded-[20px] py-4 font-medium"
            >
              Create QR Code
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="text-white text-lg font-medium">
                {amount} {toCurrency?.tradingSymbol}
              </div>
              <div className="text-[#838A9E] text-sm">to</div>
              {destinationAddress.endsWith('@') ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="text-white text-base font-medium">
                    {destinationAddress}
                  </div>
                  <div className="text-[#838A9E] text-sm break-all">
                    {destinationIAddress}
                  </div>
                </div>
              ) : (
                <div className="text-white text-sm max-w-[300px] break-all">
                  {destinationAddress}
                </div>
              )}
            </div>

            {/* Desktop view */}
            <div className="hidden md:flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeCanvas
                  value={qrString || ''}
                  size={200}
                  level="H"
                />
              </div>
              <button
                onClick={handleSaveImage}
                className="flex items-center gap-2 bg-[#090A0E] hover:bg-[#131A2A] text-white px-4 py-4 rounded-[20px] font-medium"
              >
                <Download size={16} />
                Save to share
              </button>
            </div>

            {/* Mobile view */}
            <div className="flex md:hidden flex-col gap-4 w-full mt-4">
              <a
                href={qrString || '#'}
                className="w-full bg-white hover:bg-white/90 text-black rounded-[20px] py-4 px-4 font-medium text-center flex items-center justify-center gap-2"
              >
                <Image
                  src="/icons/currencies/verus-icon-blue.svg"
                  alt="Verus"
                  width={20}
                  height={20}
                />
                Pay with Verus Mobile
              </a>

              <button
                onClick={handleSaveImage}
                className="w-full bg-[#090A0E] hover:bg-[#131A2A] text-white px-4 py-4 rounded-[20px] font-medium flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Save to share
              </button>
              
              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full bg-[#090A0E] hover:bg-[#131A2A] text-white px-4 py-4 rounded-[20px] font-medium flex items-center justify-center gap-2"
              >
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </button>

              {/* Mobile QR section */}
              {showQR && qrString && (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeCanvas
                      value={qrString}
                      size={200}
                      level="H"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
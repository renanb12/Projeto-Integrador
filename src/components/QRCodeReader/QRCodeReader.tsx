import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRCodeReaderProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

export function QRCodeReader({ onResult, onClose }: QRCodeReaderProps) {
  const readerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    readerRef.current = new Html5Qrcode('reader');
    
    readerRef.current
      .start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onResult(decodedText);
          if (readerRef.current) {
            readerRef.current.stop();
          }
          onClose();
        },
        () => {}
      )
      .catch(() => {});

    return () => {
      if (readerRef.current) {
        readerRef.current
          .stop()
          .catch(() => {});
      }
    };
  }, [onResult, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div id="reader" className="w-full"></div>
      </div>
    </div>
  );
}
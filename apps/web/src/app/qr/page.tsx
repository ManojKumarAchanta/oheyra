'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Sparkles, QrCode as QrIcon, Copy, Check } from 'lucide-react';

export default function QRStudioPage() {
  const [targetUrl, setTargetUrl] = useState('https://oheyra.city/hyderabad');
  const [dotColor, setDotColor] = useState('#8B5CF6');
  const [bgColor, setBgColor] = useState('#0A0A0C');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      targetUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: dotColor,
          light: bgColor,
        },
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  }, [targetUrl, dotColor, bgColor]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `oheyra-qr-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-electric-violet/15 px-3 py-1 text-xs font-semibold text-electric-violet border border-electric-violet/30 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Client-Side QR Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Generate Branded Event QRs
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400">
          Create high-resolution, instant printable QR codes for table tent cards, flyers, and event posters. Free forever, rendered in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Controls */}
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Target Link / URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full rounded-xl bg-surface-elevated px-4 py-2 text-sm text-white border border-border focus:border-electric-violet focus:outline-none"
                placeholder="https://oheyra.city/events/..."
              />
              <button
                onClick={copyUrl}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-white"
                aria-label="Copy URL"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Color Palettes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Dot Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={dotColor}
                  onChange={(e) => setDotColor(e.target.value)}
                  className="h-9 w-12 rounded-lg bg-transparent cursor-pointer border border-border"
                />
                <span className="text-xs font-mono text-neutral-300">{dotColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-12 rounded-lg bg-transparent cursor-pointer border border-border"
                />
                <span className="text-xs font-mono text-neutral-300">{bgColor}</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Color Presets
            </span>
            <div className="flex gap-2">
              {[
                { name: 'Violet', dot: '#8B5CF6', bg: '#0A0A0C' },
                { name: 'Coral', dot: '#F43F5E', bg: '#0A0A0C' },
                { name: 'Cyan', dot: '#06B6D4', bg: '#0A0A0C' },
                { name: 'Print White', dot: '#000000', bg: '#FFFFFF' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setDotColor(preset.dot);
                    setBgColor(preset.bg);
                  }}
                  className="rounded-lg bg-surface-elevated px-2.5 py-1 text-[11px] font-medium text-neutral-300 border border-border hover:border-white/30"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadPNG}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-electric-violet px-6 py-3 text-xs font-bold text-white hover:bg-electric-violet/90 transition-all shadow-lg shadow-electric-violet/20"
          >
            <Download className="h-4 w-4" />
            <span>Download High-Res PNG</span>
          </button>
        </div>

        {/* Live Canvas Preview */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface p-8 shadow-2xl">
          <div className="overflow-hidden rounded-2xl p-4 shadow-xl border border-border/50" style={{ backgroundColor: bgColor }}>
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
            <QrIcon className="h-4 w-4 text-electric-violet" />
            <span>Scan with any camera app to test</span>
          </div>
        </div>
      </div>
    </div>
  );
}

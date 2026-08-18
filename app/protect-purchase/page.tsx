'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProtectPurchase() {
  const [method, setMethod] = useState<'invoice' | 'manual' | null>(null);
  const [invoice, setInvoice] = useState<File | null>(null);

  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setInvoice(file);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#101828]">
      {/* HEADER */}
      <header className="border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] text-lg text-white shadow-sm">
              🛡️
            </div>

            <div>
              <div className="text-[15px] font-bold tracking-tight">
                Protectly
              </div>

              <div className="hidden text-[10px] font-medium text-gray-400 sm:block">
                CONSUMER PROTECTION
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-4xl px-5 py-10 sm:py-16">
        {/* INTRO */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] text-2xl shadow-lg shadow-black/10">
            🛡️
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
            Protect a purchase
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">
            Let&apos;s protect
            <br />
            <span className="text-gray-400">your purchase.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Save your purchase details, warranty, return deadline and important
            documents in one secure place.
          </p>
        </div>

        {/* METHOD CARDS */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {/* INVOICE */}
          <button
            type="button"
            onClick={() => setMethod('invoice')}
            className={`group relative overflow-hidden rounded-[28px] border bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
              method === 'invoice'
                ? 'border-[#111827] ring-2 ring-[#111827]/10'
                : 'border-black/[0.06]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                📄
              </div>

              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                  method === 'invoice'
                    ? 'border-[#111827] bg-[#111827] text-white'
                    : 'border-gray-200 text-transparent'
                }`}
              >
                ✓
              </div>
            </div>

            <h2 className="mt-6 text-xl font-bold">Upload invoice</h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Upload your invoice or receipt and we&apos;ll extract the purchase
              details for you.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                AI extraction
              </span>

              <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                Faster
              </span>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-gray-900">
              Choose invoice
              <span className="transition group-hover:translate-x-1">→</span>
            </div>
          </button>

          {/* MANUAL */}
          <button
            type="button"
            onClick={() => setMethod('manual')}
            className={`group relative overflow-hidden rounded-[28px] border bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
              method === 'manual'
                ? 'border-[#111827] ring-2 ring-[#111827]/10'
                : 'border-black/[0.06]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                ✍️
              </div>

              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                  method === 'manual'
                    ? 'border-[#111827] bg-[#111827] text-white'
                    : 'border-gray-200 text-transparent'
                }`}
              >
                ✓
              </div>
            </div>

            <h2 className="mt-6 text-xl font-bold">Add manually</h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter the purchase information yourself if you don&apos;t have
              your invoice available.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                No upload
              </span>

              <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                Simple
              </span>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-gray-900">
              Enter details
              <span className="transition group-hover:translate-x-1">→</span>
            </div>
          </button>
        </div>

        {/* SELECTED METHOD */}
        {method && (
          <div className="mt-6 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm">
            {method === 'invoice' ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    📄
                  </div>

                  <div>
                    <h3 className="font-bold">Upload your invoice</h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      PDF, JPG or PNG. Your document will be used to identify
                      purchase details.
                    </p>
                  </div>
                </div>

                {/* UPLOAD AREA */}
                <label className="mt-6 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 px-5 text-center transition hover:border-gray-400 hover:bg-gray-50">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleInvoiceChange}
                  />

                  <div className="text-3xl">{invoice ? '📄' : '☁️'}</div>

                  {invoice ? (
                    <>
                      <p className="mt-3 text-sm font-bold text-gray-900">
                        {invoice.name}
                      </p>

                      <p className="mt-1 text-xs text-green-600">
                        Invoice selected successfully
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-sm font-bold">
                        Click to upload your invoice
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        PDF, JPG or PNG
                      </p>
                    </>
                  )}
                </label>

                {/* CONTINUE */}
                {invoice && (
                  <button
                    type="button"
                    className="mt-5 w-full rounded-2xl bg-[#111827] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-black"
                    onClick={() => {
                      alert(
                        'Invoice selected. AI extraction will be connected in the next step.'
                      );
                    }}
                  >
                    Continue with invoice →
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                    ✍️
                  </div>

                  <div>
                    <h3 className="font-bold">Add purchase details</h3>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      We&apos;ll use these details to create your purchase
                      protection record.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-500">
                      PRODUCT NAME
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Samsung Smart TV"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-500">
                      PURCHASE PRICE
                    </label>

                    <input
                      type="text"
                      placeholder="₹45,999"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-500">
                      PURCHASE DATE
                    </label>

                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-gray-500">
                      CATEGORY
                    </label>

                    <select className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white">
                      <option>Electronics</option>
                      <option>Home Appliance</option>
                      <option>Mobile</option>
                      <option>Furniture</option>
                      <option>Travel</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-2xl bg-[#111827] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-black"
                >
                  Protect this purchase →
                </button>
              </>
            )}
          </div>
        )}

        {/* TRUST */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">🔒 Secure storage</span>

          <span className="flex items-center gap-1.5">
            📄 Your documents stay private
          </span>

          <span className="flex items-center gap-1.5">
            🛡️ Built for consumer protection
          </span>
        </div>
      </div>
    </main>
  );
}

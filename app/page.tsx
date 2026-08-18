'use client';

import { useMemo, useState } from 'react';

type Purchase = {
  id: number;
  icon: string;
  name: string;
  category: string;
  price: number;
  status: string;
  statusType: 'green' | 'blue' | 'purple';
  meta: string;
};

const initialPurchases: Purchase[] = [
  {
    id: 1,
    icon: '📺',
    name: 'Samsung Smart TV',
    category: 'Electronics',
    price: 45999,
    status: 'Warranty Active',
    statusType: 'green',
    meta: 'Expires in 21 days',
  },
  {
    id: 2,
    icon: '❄️',
    name: 'LG Split AC',
    category: 'Home Appliance',
    price: 45000,
    status: 'Return Active',
    statusType: 'blue',
    meta: '8 days remaining',
  },
  {
    id: 3,
    icon: '📱',
    name: 'iPhone 16',
    category: 'Electronics',
    price: 79900,
    status: 'Protected',
    statusType: 'purple',
    meta: 'Warranty · 11 months',
  },
];

const categories = [
  'Electronics',
  'Home Appliance',
  'Mobile',
  'Fashion',
  'Furniture',
  'Travel',
  'Other',
];

const warrantyOptions = [
  'No warranty',
  '3 months',
  '6 months',
  '1 year',
  '2 years',
  '3 years',
];

const returnOptions = [
  'No return',
  '3 days',
  '7 days',
  '10 days',
  '15 days',
  '30 days',
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const [purchaseMethod, setPurchaseMethod] = useState<
    'invoice' | 'manual' | null
  >(null);

  const [invoice, setInvoice] = useState<File | null>(null);

  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);

  const [form, setForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    date: '',
    seller: '',
    warranty: '1 year',
    returnWindow: '7 days',
  });

  const [error, setError] = useState('');

  const protectedValue = useMemo(
    () => purchases.reduce((sum, purchase) => sum + purchase.price, 0),
    [purchases]
  );

  function openPurchaseModal() {
    setError('');
    setPurchaseMethod(null);
    setInvoice(null);
    setShowPurchaseModal(true);
  }

  function closePurchaseModal() {
    setShowPurchaseModal(false);
    setPurchaseMethod(null);
    setInvoice(null);
    setError('');
  }

  function updateForm(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleInvoiceChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setInvoice(file);
    setError('');
  }

  function savePurchase() {
    if (!form.name.trim()) {
      setError('Please enter the product name.');
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError('Please enter a valid purchase price.');
      return;
    }

    if (!form.date) {
      setError('Please select the purchase date.');
      return;
    }

    const newPurchase: Purchase = {
      id: Date.now(),
      icon: getCategoryIcon(form.category),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      status: form.warranty === 'No warranty' ? 'Protected' : 'Warranty Active',
      statusType: form.warranty === 'No warranty' ? 'purple' : 'green',
      meta:
        form.warranty === 'No warranty'
          ? 'Purchase protected'
          : `Warranty · ${form.warranty}`,
    };

    setPurchases((current) => [newPurchase, ...current]);

    setForm({
      name: '',
      category: 'Electronics',
      price: '',
      date: '',
      seller: '',
      warranty: '1 year',
      returnWindow: '7 days',
    });

    setError('');
    setShowPurchaseModal(false);
    setPurchaseMethod(null);
    setInvoice(null);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#101828]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
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
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Purchases
            </button>

            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Cases
            </button>

            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Documents
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 sm:block">
              Sign in
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold"
            >
              PS
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="absolute right-5 top-14 w-48 rounded-2xl border border-black/[0.06] bg-white p-2 shadow-xl md:right-8">
            <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50">
              Account
            </button>

            <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50">
              Settings
            </button>
          </div>
        )}
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        {/* HERO */}
        <section className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-400">
              YOUR PROTECTION
            </p>

            <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Keep every purchase
              <br />
              <span className="text-gray-400">protected.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Your purchases, warranties, returns and consumer cases — organized
              and protected in one place.
            </p>
          </div>

          {/* ONLY PRIMARY CTA */}
          <button
            onClick={openPurchaseModal}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#111827] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-black"
          >
            <span className="text-lg">+</span>
            Protect a purchase
          </button>
        </section>

        {/* TOP STATS */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/[0.05] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Protected value
              </span>

              <span className="rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                Active
              </span>
            </div>

            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(protectedValue)}
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Across {purchases.length} purchases
            </div>
          </div>

          <div className="rounded-3xl border border-black/[0.05] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Active warranties
              </span>

              <span className="rounded-xl bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">
                {
                  purchases.filter(
                    (purchase) => purchase.status === 'Warranty Active'
                  ).length
                }
              </span>
            </div>

            <div className="text-2xl font-bold tracking-tight">
              {
                purchases.filter(
                  (purchase) => purchase.status === 'Warranty Active'
                ).length
              }
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Protected purchases
            </div>
          </div>

          <div className="rounded-3xl border border-black/[0.05] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Open cases
              </span>

              <span className="rounded-xl bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                1
              </span>
            </div>

            <div className="text-2xl font-bold tracking-tight">1</div>

            <div className="mt-2 text-xs text-gray-400">
              Needs your attention
            </div>
          </div>
        </section>

        {/* ATTENTION */}
        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-orange-100 bg-orange-50/70 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
                ⚠️
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  Attention
                </p>

                <p className="text-sm font-semibold text-gray-900">
                  Warranty ending soon
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-semibold">Samsung Smart TV</p>

                <p className="mt-1 text-sm text-gray-500">
                  Warranty expires in 21 days.
                </p>
              </div>

              <button className="whitespace-nowrap rounded-xl bg-white px-4 py-2.5 text-xs font-bold shadow-sm">
                View
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50/70 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">
                🔴
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                  Action required
                </p>

                <p className="text-sm font-semibold text-gray-900">
                  Refund still pending
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-semibold">Amazon Refund</p>

                <p className="mt-1 text-sm text-gray-500">
                  ₹8,499 · Waiting 6 days
                </p>
              </div>

              <button className="whitespace-nowrap rounded-xl bg-[#111827] px-4 py-2.5 text-xs font-bold text-white">
                Continue case
              </button>
            </div>
          </div>
        </section>

        {/* PURCHASES */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Your purchases
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight">
                Protected purchases
              </h2>
            </div>

            <button className="text-sm font-semibold text-gray-500 hover:text-gray-900">
              View all →
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="group rounded-3xl border border-black/[0.05] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-2xl">
                    {purchase.icon}
                  </div>

                  <button className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-50">
                    •••
                  </button>
                </div>

                <div className="mt-5">
                  <p className="text-base font-bold">{purchase.name}</p>

                  <p className="mt-1 text-xs text-gray-400">
                    {purchase.category}
                  </p>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold">
                      {formatCurrency(purchase.price)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {purchase.meta}
                    </p>
                  </div>

                  <span
                    className={`rounded-xl px-2.5 py-1.5 text-[11px] font-bold ${
                      purchase.statusType === 'green'
                        ? 'bg-emerald-50 text-emerald-600'
                        : purchase.statusType === 'blue'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    {purchase.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER MESSAGE */}
        <section className="mt-10 rounded-3xl bg-[#111827] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                Consumer protection
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Don't let a deadline cost you money.
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Protect your receipts, warranties, returns and consumer cases
                before you need them.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-gray-400">
              <span>🔒 Secure storage</span>
              <span>📄 Private documents</span>
              <span>🛡️ Consumer protection</span>
            </div>
          </div>
        </section>
      </div>

      {/* PREMIUM PURCHASE PROTECTION MODAL */}
      {showPurchaseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
          onClick={closePurchaseModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/20 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="border-b border-black/[0.06] bg-white px-6 py-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#111827] text-xl text-white shadow-lg">
                    🛡️
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                      Purchase Protection
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight">
                      Protect a purchase
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Choose how you want to add your purchase.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePurchaseModal}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 sm:p-8">
              {/* STEP 1 */}
              {!purchaseMethod && (
                <>
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-900">
                      How would you like to protect it?
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Upload an invoice for automatic protection or enter the
                      details yourself.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* INVOICE */}
                    <button
                      type="button"
                      onClick={() => setPurchaseMethod('invoice')}
                      className="group rounded-[24px] border border-black/[0.06] bg-gray-50 p-5 text-left transition hover:-translate-y-1 hover:border-gray-300 hover:bg-white hover:shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                          📄
                        </div>

                        <span className="text-lg text-gray-300 transition group-hover:translate-x-1">
                          →
                        </span>
                      </div>

                      <h3 className="mt-5 text-lg font-bold">Upload invoice</h3>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Let AI extract the product, price, seller, purchase
                        date, warranty and return information.
                      </p>

                      <div className="mt-4 flex gap-2">
                        <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-gray-500 shadow-sm">
                          AI EXTRACTION
                        </span>

                        <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-gray-500 shadow-sm">
                          FAST
                        </span>
                      </div>
                    </button>

                    {/* MANUAL */}
                    <button
                      type="button"
                      onClick={() => setPurchaseMethod('manual')}
                      className="group rounded-[24px] border border-black/[0.06] bg-gray-50 p-5 text-left transition hover:-translate-y-1 hover:border-gray-300 hover:bg-white hover:shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                          ✍️
                        </div>

                        <span className="text-lg text-gray-300 transition group-hover:translate-x-1">
                          →
                        </span>
                      </div>

                      <h3 className="mt-5 text-lg font-bold">Add manually</h3>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Enter your purchase information yourself if you don't
                        have an invoice available.
                      </p>

                      <div className="mt-4">
                        <span className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-gray-500 shadow-sm">
                          SIMPLE
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-400">
                    <span>🔒 Secure</span>
                    <span>•</span>
                    <span>📄 Private documents</span>
                    <span>•</span>
                    <span>🛡️ Consumer protection</span>
                  </div>
                </>
              )}

              {/* INVOICE STEP */}
              {purchaseMethod === 'invoice' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMethod(null);
                      setInvoice(null);
                      setError('');
                    }}
                    className="mb-5 text-xs font-semibold text-gray-400 hover:text-gray-900"
                  >
                    ← Back
                  </button>

                  <div className="rounded-[24px] border border-blue-100 bg-blue-50/50 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                        📄
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900">
                          Upload your invoice
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          AI will use your invoice to identify purchase details
                          and protection dates.
                        </p>
                      </div>
                    </div>

                    <label className="mt-5 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-white px-5 text-center transition hover:border-blue-400">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={handleInvoiceChange}
                      />

                      {invoice ? (
                        <>
                          <div className="text-3xl">📄</div>

                          <p className="mt-3 max-w-full truncate text-sm font-bold text-gray-900">
                            {invoice.name}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-emerald-600">
                            ✓ Invoice selected successfully
                          </p>

                          <p className="mt-2 text-[11px] text-gray-400">
                            Click to replace this file
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl">☁️</div>

                          <p className="mt-3 text-sm font-bold text-gray-900">
                            Click to upload your invoice
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            PDF, JPG or PNG
                          </p>
                        </>
                      )}
                    </label>

                    {invoice && (
                      <button
                        type="button"
                        className="mt-5 w-full rounded-2xl bg-[#111827] px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-black"
                        onClick={() => {
                          alert(
                            'Invoice uploaded successfully. AI extraction will be connected next.'
                          );
                        }}
                      >
                        Continue with invoice →
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* MANUAL STEP */}
              {purchaseMethod === 'manual' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMethod(null);
                      setError('');
                    }}
                    className="mb-5 text-xs font-semibold text-gray-400 hover:text-gray-900"
                  >
                    ← Back
                  </button>

                  <div className="mb-5">
                    <h3 className="text-lg font-bold">Add purchase details</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Enter the basic information to protect your purchase.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-bold text-gray-500">
                        PRODUCT NAME
                      </label>

                      <input
                        type="text"
                        value={form.name}
                        onChange={(event) =>
                          updateForm('name', event.target.value)
                        }
                        placeholder="e.g. Samsung Smart TV"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-gray-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-500">
                        CATEGORY
                      </label>

                      <select
                        value={form.category}
                        onChange={(event) =>
                          updateForm('category', event.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-gray-900 focus:bg-white"
                      >
                        {categories.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-500">
                        PURCHASE PRICE
                      </label>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                          ₹
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={form.price}
                          onChange={(event) =>
                            updateForm('price', event.target.value)
                          }
                          placeholder="45000"
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-9 pr-4 text-sm outline-none focus:border-gray-900 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-500">
                        PURCHASE DATE
                      </label>

                      <input
                        type="date"
                        value={form.date}
                        onChange={(event) =>
                          updateForm('date', event.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-gray-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-500">
                        SELLER / STORE
                      </label>

                      <input
                        value={form.seller}
                        onChange={(event) =>
                          updateForm('seller', event.target.value)
                        }
                        placeholder="e.g. Amazon"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none placeholder:text-gray-400 focus:border-gray-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-500">
                        WARRANTY
                      </label>

                      <select
                        value={form.warranty}
                        onChange={(event) =>
                          updateForm('warranty', event.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-gray-900 focus:bg-white"
                      >
                        {warrantyOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-gray-500">
                        RETURN WINDOW
                      </label>

                      <select
                        value={form.returnWindow}
                        onChange={(event) =>
                          updateForm('returnWindow', event.target.value)
                        }
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-gray-900 focus:bg-white"
                      >
                        {returnOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={savePurchase}
                    className="mt-5 w-full rounded-2xl bg-[#111827] px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-black"
                  >
                    Protect this purchase →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Electronics':
      return '📺';

    case 'Home Appliance':
      return '❄️';

    case 'Mobile':
      return '📱';

    case 'Fashion':
      return '👕';

    case 'Furniture':
      return '🛋️';

    case 'Travel':
      return '✈️';

    default:
      return '📦';
  }
}

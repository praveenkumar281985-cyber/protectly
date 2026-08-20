'use client';

import { ChangeEvent, useMemo, useState } from 'react';

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
    category: 'Mobile',
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
  return '₹' + value.toLocaleString('en-IN');
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const [purchaseMethod, setPurchaseMethod] = useState<
    'invoice' | 'manual' | null
  >(null);

  const [invoice, setInvoice] = useState<File | null>(null);

  const [purchases, setPurchases] =
    useState<Purchase[]>(initialPurchases);

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
    () =>
      purchases.reduce(
        (sum, purchase) => sum + purchase.price,
        0
      ),
    [purchases]
  );

  const activeWarranties = purchases.filter(
    (purchase) => purchase.status === 'Warranty Active'
  ).length;

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

  function updateForm(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleInvoiceChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
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
      status:
        form.warranty === 'No warranty'
          ? 'Protected'
          : 'Warranty Active',
      statusType:
        form.warranty === 'No warranty'
          ? 'purple'
          : 'green',
      meta:
        form.warranty === 'No warranty'
          ? 'Purchase protected'
          : 'Warranty · ' + form.warranty,
    };

    setPurchases((current) => [
      newPurchase,
      ...current,
    ]);

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
    closePurchaseModal();
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#111827]">

      {/* HEADER */}

      <header className="sticky top-0 z-30 border-b border-black/[0.05] bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">

          <div className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] text-base text-white shadow-sm">
              🛡️
            </div>

            <div>
              <div className="text-[15px] font-bold tracking-tight">
                Protectly
              </div>

              <div className="hidden text-[8px] font-bold tracking-[0.16em] text-gray-400 sm:block">
                CONSUMER PROTECTION
              </div>
            </div>

          </div>

          <div className="relative">

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold transition hover:bg-gray-200"
            >
              PS
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 w-44 rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-xl">

                <button className="w-full rounded-xl px-3 py-2.5 text-left text-[13px] hover:bg-gray-50">
                  Account
                </button>

                <button className="w-full rounded-xl px-3 py-2.5 text-left text-[13px] hover:bg-gray-50">
                  Settings
                </button>

                <button className="w-full rounded-xl px-3 py-2.5 text-left text-[13px] hover:bg-gray-50">
                  Sign out
                </button>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* MAIN */}

      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">

        {/* HERO */}

        <section className="mb-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Your protection
              </p>

              <h1 className="text-[30px] font-bold leading-[1.08] tracking-[-0.04em] sm:text-[38px]">
                Keep every purchase
                <br />
                <span className="text-gray-400">
                  protected.
                </span>
              </h1>

              <p className="mt-3 max-w-md text-[12px] leading-5 text-gray-500">
                Purchases, warranties, returns and
                consumer cases — all protected in one
                place.
              </p>

            </div>

            <button
              type="button"
              onClick={openPurchaseModal}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-[12px] font-bold text-white shadow-lg shadow-black/10 transition hover:bg-black sm:w-auto"
            >
              <span className="text-lg leading-none">
                +
              </span>

              Protect a purchase
            </button>

          </div>

        </section>

        {/* STATS */}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">

          <div className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-sm">

            <p className="text-[11px] font-medium text-gray-500">
              Protected value
            </p>

            <p className="mt-2 text-[20px] font-bold tracking-tight">
              {formatCurrency(protectedValue)}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              {purchases.length} purchases
            </p>

          </div>

          <div className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-sm">

            <p className="text-[11px] font-medium text-gray-500">
              Warranties
            </p>

            <p className="mt-2 text-[20px] font-bold tracking-tight">
              {activeWarranties}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              Active protection
            </p>

          </div>

          <div className="col-span-2 rounded-2xl border border-black/[0.05] bg-white p-4 shadow-sm sm:col-span-1">

            <p className="text-[11px] font-medium text-gray-500">
              Open cases
            </p>

            <p className="mt-2 text-[20px] font-bold tracking-tight">
              1
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              Needs attention
            </p>

          </div>

        </section>

        {/* ALERTS */}

        <section className="mt-5 space-y-3">

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                ⚠️
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[9px] font-bold uppercase tracking-wider text-orange-500">
                  Attention
                </p>

                <p className="mt-0.5 text-[13px] font-bold">
                  Warranty ending soon
                </p>

                <p className="mt-1 text-[11px] text-gray-500">
                  Samsung Smart TV · expires in 21 days.
                </p>

              </div>

              <button className="shrink-0 rounded-lg bg-white px-3 py-2 text-[10px] font-bold shadow-sm">
                View
              </button>

            </div>

          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
                🔴
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[9px] font-bold uppercase tracking-wider text-red-500">
                  Action required
                </p>

                <p className="mt-0.5 text-[13px] font-bold">
                  Refund still pending
                </p>

                <p className="mt-1 text-[11px] text-gray-500">
                  Amazon Refund · ₹8,499 · 6 days
                </p>

              </div>

              <button className="shrink-0 rounded-lg bg-[#111827] px-3 py-2 text-[10px] font-bold text-white">
                Continue
              </button>

            </div>

          </div>

        </section>

        {/* PURCHASES */}

        <section className="mt-7">

          <div className="mb-3 flex items-end justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                Your purchases
              </p>

              <h2 className="mt-1 text-[17px] font-bold tracking-tight">
                Protected purchases
              </h2>

            </div>

            <button className="text-[11px] font-semibold text-gray-500">
              View all →
            </button>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {purchases.map((purchase) => (

              <div
                key={purchase.id}
                className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-sm transition hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">
                    {purchase.icon}
                  </div>

                  <button className="rounded-lg px-2 py-1 text-gray-400 hover:bg-gray-50">
                    •••
                  </button>

                </div>

                <div className="mt-4">

                  <p className="text-[13px] font-bold">
                    {purchase.name}
                  </p>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    {purchase.category}
                  </p>

                </div>

                <div className="mt-4 flex items-end justify-between gap-3">

                  <div>

                    <p className="text-[15px] font-bold">
                      {formatCurrency(purchase.price)}
                    </p>

                    <p className="mt-0.5 text-[9px] text-gray-400">
                      {purchase.meta}
                    </p>

                  </div>

                  <span
                    className={
                      'rounded-lg px-2 py-1 text-[8px] font-bold ' +
                      (purchase.statusType === 'green'
                        ? 'bg-emerald-50 text-emerald-600'
                        : purchase.statusType === 'blue'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-purple-50 text-purple-600')
                    }
                  >
                    {purchase.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* FOOTER */}

        <section className="mt-7 rounded-2xl bg-[#111827] p-5 text-white">

          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
            Consumer protection
          </p>

          <h3 className="mt-2 text-[16px] font-bold">
            Don't let a deadline cost you money.
          </h3>

          <p className="mt-1.5 max-w-lg text-[11px] leading-5 text-gray-400">
            Protect receipts, warranties, returns and
            consumer cases before you need them.
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-[9px] text-gray-400">
            <span>🔒 Secure storage</span>
            <span>📄 Private documents</span>
            <span>🛡️ Protected</span>
          </div>

        </section>

      </div>

      {/* PURCHASE SHEET */}

      {showPurchaseModal && (

        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={closePurchaseModal}
        >

          <div
            className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-10px_60px_rgba(0,0,0,0.25)] sm:max-h-[88vh] sm:rounded-[26px]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* SHEET HEADER */}

            <div className="shrink-0 border-b border-black/[0.06] px-5 pb-4 pt-3">

              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] text-base text-white">
                    🛡️
                  </div>

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-gray-400">
                      Purchase protection
                    </p>

                    <h2 className="text-[18px] font-bold tracking-tight">
                      Protect a purchase
                    </h2>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={closePurchaseModal}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500"
                >
                  ✕
                </button>

              </div>

            </div>

            {/* SHEET BODY */}

            <div className="overflow-y-auto px-5 py-5">

              {!purchaseMethod && (

                <>

                  <div className="mb-4">

                    <h3 className="text-[14px] font-bold">
                      How would you like to add it?
                    </h3>

                    <p className="mt-1 text-[11px] leading-5 text-gray-400">
                      Choose the fastest way to protect your purchase.
                    </p>

                  </div>

                  <div className="space-y-3">

                    {/* INVOICE */}

                    <button
                      type="button"
                      onClick={() =>
                        setPurchaseMethod('invoice')
                      }
                      className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left transition active:scale-[0.99] hover:border-gray-300 hover:bg-white"
                    >

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                        📄
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-[13px] font-bold">
                          Upload invoice
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-gray-500">
                          AI extracts product, price, seller and dates.
                        </p>

                      </div>

                      <span className="text-gray-300">
                        →
                      </span>

                    </button>

                    {/* MANUAL */}

                    <button
                      type="button"
                      onClick={() =>
                        setPurchaseMethod('manual')
                      }
                      className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left transition active:scale-[0.99] hover:border-gray-300 hover:bg-white"
                    >

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl">
                        ✍️
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-[13px] font-bold">
                          Add manually
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-gray-500">
                          Enter purchase details yourself.
                        </p>

                      </div>

                      <span className="text-gray-300">
                        →
                      </span>

                    </button>

                  </div>

                  <div className="mt-5 flex justify-center gap-4 text-[9px] text-gray-400">
                    <span>🔒 Secure</span>
                    <span>•</span>
                    <span>📄 Private</span>
                    <span>•</span>
                    <span>🛡️ Protected</span>
                  </div>

                </>

              )}

              {/* INVOICE */}

              {purchaseMethod === 'invoice' && (

                <>

                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMethod(null);
                      setInvoice(null);
                    }}
                    className="mb-4 text-[11px] font-semibold text-gray-400"
                  >
                    ← Back
                  </button>

                  <div>

                    <h3 className="text-[15px] font-bold">
                      Upload your invoice
                    </h3>

                    <p className="mt-1 text-[11px] text-gray-500">
                      PDF, JPG or PNG.
                    </p>

                  </div>

                  <label className="mt-5 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-5 text-center transition hover:border-gray-400 hover:bg-white">

                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleInvoiceChange}
                    />

                    {invoice ? (

                      <>
                        <div className="text-3xl">
                          📄
                        </div>

                        <p className="mt-2 max-w-full truncate text-[12px] font-bold">
                          {invoice.name}
                        </p>

                        <p className="mt-1 text-[10px] font-semibold text-emerald-600">
                          ✓ Invoice selected
                        </p>

                        <p className="mt-1 text-[9px] text-gray-400">
                          Tap to replace
                        </p>
                      </>

                    ) : (

                      <>
                        <div className="text-3xl">
                          ☁️
                        </div>

                        <p className="mt-3 text-[12px] font-bold">
                          Tap to upload invoice
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          PDF, JPG or PNG
                        </p>
                      </>

                    )}

                  </label>

                  {invoice && (

                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          'Invoice selected successfully. AI extraction will be connected next.'
                        )
                      }
                      className="mt-4 w-full rounded-xl bg-[#111827] py-3.5 text-[12px] font-bold text-white"
                    >
                      Continue with invoice →
                    </button>

                  )}

                </>

              )}

              {/* MANUAL */}

              {purchaseMethod === 'manual' && (

                <>

                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMethod(null);
                      setError('');
                    }}
                    className="mb-4 text-[11px] font-semibold text-gray-400"
                  >
                    ← Back
                  </button>

                  <div className="mb-4">

                    <h3 className="text-[15px] font-bold">
                      Add purchase details
                    </h3>

                    <p className="mt-1 text-[10px] text-gray-500">
                      Enter the basic information.
                    </p>

                  </div>

                  <div className="space-y-3">

                    <div>

                      <label className="mb-1.5 block text-[9px] font-bold tracking-wide text-gray-500">
                        PRODUCT NAME
                      </label>

                      <input
                        type="text"
                        value={form.name}
                        onChange={(event) =>
                          updateForm(
                            'name',
                            event.target.value
                          )
                        }
                        placeholder="Samsung Smart TV"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-[12px] outline-none focus:border-gray-900 focus:bg-white"
                      />

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <div>

                        <label className="mb-1.5 block text-[9px] font-bold tracking-wide text-gray-500">
                          CATEGORY
                        </label>

                        <select
                          value={form.category}
                          onChange={(event) =>
                            updateForm(
                              'category',
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        >

                          {categories.map(
                            (category) => (
                              <option
                                key={category}
                              >
                                {category}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      <div>

                        <label className="mb-1.5 block text-[9px] font-bold tracking-wide text-gray-500">
                          PRICE
                        </label>

                        <div className="relative">

                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">
                            ₹
                          </span>

                          <input
                            type="number"
                            min="0"
                            value={form.price}
                            onChange={(event) =>
                              updateForm(
                                'price',
                                event.target.value
                              )
                            }
                            placeholder="45000"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-7 pr-3 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                          />

                        </div>

                      </div>

                    </div>

                    <div>

                      <label className="mb-1.5 block text-[9px] font-bold tracking-wide text-gray-500">
                        PURCHASE DATE
                      </label>

                      <input
                        type="date"
                        value={form.date}
                        onChange={(event) =>
                          updateForm(
                            'date',
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                      />

                    </div>

                    <div>

                      <label className="mb-1.5 block text-[9px] font-bold tracking-wide text-gray-500">
                        SELLER / STORE
                      </label>

                      <input
                        value={form.seller}
                        onChange={(event) =>
                          updateForm(
                            'seller',
                            event.target.value
                          )
                        }
                        placeholder="Amazon"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                      />

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <div>

                        <label className="mb-1.5 block text-[9px] font-bold tracking-wide text-gray-500">
                          WARRANTY
                        </label>

                        <select
                          value={form.warranty}
                          onChange={(event) =>
                            updateForm(
                              'warranty',
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        >

                          {warrantyOptions.map(
                            (option) => (
                              <option key={option}>
                                {option}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      <div>

                        <label className="mb-1.5 block text-[9px] font-bold tracking-wide text-gray-500">
                          RETURN WINDOW
                        </label>

                        <select
                          value={form.returnWindow}
                          onChange={(event) =>
                            updateForm(
                              'returnWindow',
                              event.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        >

                          {returnOptions.map(
                            (option) => (
                              <option key={option}>
                                {option}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                    </div>

                  </div>

                  {error && (

                    <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-[10px] font-medium text-red-600">
                      {error}
                    </div>

                  )}

                  <button
                    type="button"
                    onClick={savePurchase}
                    className="mt-4 w-full rounded-xl bg-[#111827] py-3.5 text-[12px] font-bold text-white shadow-md transition hover:bg-black"
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
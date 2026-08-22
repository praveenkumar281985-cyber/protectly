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

    closePurchaseModal();
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#101828]">

      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#101828] text-lg text-white shadow-lg shadow-black/10">
              🛡️
            </div>

            <div>
              <div className="text-[16px] font-extrabold tracking-[-0.03em]">
                Protectly
              </div>
              <div className="hidden text-[8px] font-bold uppercase tracking-[0.18em] text-gray-400 sm:block">
                Consumer protection
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-gray-100 text-[11px] font-bold shadow-sm transition active:scale-95"
            >
              PS
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-2xl">
                <button className="w-full rounded-xl px-3 py-3 text-left text-[13px] font-medium hover:bg-gray-50">
                  Account
                </button>
                <button className="w-full rounded-xl px-3 py-3 text-left text-[13px] font-medium hover:bg-gray-50">
                  Settings
                </button>
                <button className="w-full rounded-xl px-3 py-3 text-left text-[13px] font-medium text-red-500 hover:bg-red-50">
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pt-8 lg:px-8">

        <section className="relative mb-6 overflow-hidden rounded-[28px] bg-[#101828] px-5 py-7 text-white shadow-2xl shadow-black/10 sm:px-8 sm:py-9">

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/[0.05] blur-2xl" />
          <div className="absolute -bottom-28 right-10 h-56 w-56 rounded-full bg-white/[0.04] blur-3xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">
                Protection active
              </span>
            </div>

            <h1 className="max-w-xl text-[31px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-[44px]">
              Everything you buy.
              <br />
              <span className="text-white/40">
                Always protected.
              </span>
            </h1>

            <p className="mt-4 max-w-md text-[12px] leading-5 text-white/55 sm:text-[13px]">
              Store receipts, track returns, protect warranties and
              manage consumer cases from one secure place.
            </p>

            <button
              type="button"
              onClick={openPurchaseModal}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-[12px] font-extrabold text-[#101828] shadow-xl transition active:scale-[0.98] sm:w-auto"
            >
              <span className="text-lg leading-none">+</span>
              Protect a purchase
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">

          <div className="rounded-[20px] border border-black/[0.05] bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm">
              ₹
            </div>

            <p className="text-[10px] font-semibold text-gray-400">
              Protected value
            </p>

            <p className="mt-1 text-[20px] font-extrabold tracking-[-0.03em]">
              {formatCurrency(protectedValue)}
            </p>

            <p className="mt-1 text-[9px] text-gray-400">
              {purchases.length} purchases
            </p>
          </div>

          <div className="rounded-[20px] border border-black/[0.05] bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-sm">
              ✓
            </div>

            <p className="text-[10px] font-semibold text-gray-400">
              Active warranties
            </p>

            <p className="mt-1 text-[20px] font-extrabold tracking-[-0.03em]">
              {activeWarranties}
            </p>

            <p className="mt-1 text-[9px] text-gray-400">
              Protected purchases
            </p>
          </div>

          <div className="col-span-2 rounded-[20px] border border-black/[0.05] bg-white p-4 shadow-sm sm:col-span-1">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-sm">
              !
            </div>

            <p className="text-[10px] font-semibold text-gray-400">
              Open cases
            </p>

            <p className="mt-1 text-[20px] font-extrabold tracking-[-0.03em]">
              1
            </p>

            <p className="mt-1 text-[9px] text-gray-400">
              Needs attention
            </p>
          </div>
        </section>

        <section className="mt-6">

          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-gray-400">
                Attention
              </p>
              <h2 className="mt-1 text-[17px] font-extrabold tracking-[-0.025em]">
                Needs your attention
              </h2>
            </div>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[9px] font-bold text-gray-500">
              2 items
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            <div className="rounded-[20px] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm">
              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                  ⚠️
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-orange-500">
                    Warranty ending
                  </p>

                  <p className="mt-1 text-[13px] font-extrabold">
                    Samsung Smart TV
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-gray-500">
                    Warranty expires in 21 days.
                  </p>
                </div>

                <button className="rounded-lg bg-white px-3 py-2 text-[9px] font-bold shadow-sm">
                  View
                </button>
              </div>
            </div>

            <div className="rounded-[20px] border border-red-100 bg-gradient-to-br from-red-50 to-white p-4 shadow-sm">
              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  ₹
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-red-500">
                    Refund pending
                  </p>

                  <p className="mt-1 text-[13px] font-extrabold">
                    Amazon Refund
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-gray-500">
                    ₹8,499 · pending for 6 days.
                  </p>
                </div>

                <button className="rounded-lg bg-[#101828] px-3 py-2 text-[9px] font-bold text-white">
                  Continue
                </button>
              </div>
            </div>

          </div>
        </section>

        <section className="mt-8">

          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-gray-400">
                Your vault
              </p>

              <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.03em]">
                Protected purchases
              </h2>
            </div>

            <button className="text-[10px] font-bold text-gray-500">
              View all →
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="group rounded-[22px] border border-black/[0.05] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#f5f6f8] text-xl">
                    {purchase.icon}
                  </div>

                  <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 hover:bg-gray-50 hover:text-gray-600">
                    •••
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-[13px] font-extrabold">
                    {purchase.name}
                  </p>

                  <p className="mt-1 text-[9px] font-medium text-gray-400">
                    {purchase.category}
                  </p>
                </div>

                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-extrabold tracking-[-0.02em]">
                      {formatCurrency(purchase.price)}
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      {purchase.meta}
                    </p>
                  </div>

                  <span
                    className={
                      'rounded-full px-2.5 py-1 text-[8px] font-extrabold ' +
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

                <div className="mt-4 border-t border-black/[0.05] pt-3">
                  <div className="flex items-center justify-between text-[9px] text-gray-400">
                    <span>Documents protected</span>
                    <span className="font-bold text-gray-600">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[24px] bg-[#101828] p-5 text-white shadow-xl sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-2 inline-flex rounded-full bg-white/[0.08] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.16em] text-white/50">
                Protectly protection
              </div>

              <h3 className="text-[18px] font-extrabold tracking-[-0.03em]">
                Don't let a deadline
                <br className="sm:hidden" /> cost you money.
              </h3>

              <p className="mt-2 max-w-lg text-[10px] leading-5 text-white/45">
                Keep your receipts, warranties, returns and
                consumer cases ready when you need them.
              </p>
            </div>

            <button
              type="button"
              onClick={openPurchaseModal}
              className="shrink-0 rounded-xl bg-white px-5 py-3 text-[10px] font-extrabold text-[#101828]"
            >
              Add protection
            </button>

          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.08] pt-4 text-[8px] font-medium text-white/40">
            <span>🔒 Secure storage</span>
            <span>📄 Private documents</span>
            <span>🛡️ Consumer protection</span>
          </div>
        </section>

      </div>

      {showPurchaseModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-md sm:items-center sm:p-5"
          onClick={closePurchaseModal}
        >

          <div
            className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-20px_80px_rgba(0,0,0,0.3)] sm:max-h-[90vh] sm:rounded-[28px]"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="shrink-0 border-b border-black/[0.06] px-5 pb-4 pt-3">

              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#101828] text-base text-white">
                    🛡️
                  </div>

                  <div>
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-gray-400">
                      Purchase protection
                    </p>

                    <h2 className="mt-0.5 text-[18px] font-extrabold tracking-[-0.03em]">
                      Protect a purchase
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePurchaseModal}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-5">

              {!purchaseMethod && (
                <>
                  <div className="mb-5">
                    <h3 className="text-[15px] font-extrabold">
                      How would you like to add it?
                    </h3>

                    <p className="mt-1 text-[10px] leading-5 text-gray-400">
                      Choose the fastest way to protect your purchase.
                    </p>
                  </div>

                  <div className="space-y-3">

                    <button
                      type="button"
                      onClick={() => setPurchaseMethod('invoice')}
                      className="flex w-full items-center gap-4 rounded-[20px] border border-gray-200 bg-gray-50 p-4 text-left transition active:scale-[0.99] hover:border-gray-300 hover:bg-white"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-blue-50 text-xl">
                        📄
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-extrabold">
                          Upload invoice
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-gray-500">
                          AI extracts product, price, seller and dates.
                        </p>
                      </div>

                      <span className="text-gray-300">→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPurchaseMethod('manual')}
                      className="flex w-full items-center gap-4 rounded-[20px] border border-gray-200 bg-gray-50 p-4 text-left transition active:scale-[0.99] hover:border-gray-300 hover:bg-white"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-purple-50 text-xl">
                        ✍️
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-extrabold">
                          Add manually
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-gray-500">
                          Enter purchase details yourself.
                        </p>
                      </div>

                      <span className="text-gray-300">→</span>
                    </button>
                  </div>

                  <div className="mt-6 flex justify-center gap-4 text-[8px] font-medium text-gray-400">
                    <span>🔒 Secure</span>
                    <span>•</span>
                    <span>📄 Private</span>
                    <span>•</span>
                    <span>🛡️ Protected</span>
                  </div>
                </>
              )}

              {purchaseMethod === 'invoice' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMethod(null);
                      setInvoice(null);
                    }}
                    className="mb-5 text-[10px] font-bold text-gray-400"
                  >
                    ← Back
                  </button>

                  <h3 className="text-[15px] font-extrabold">
                    Upload your invoice
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-500">
                    PDF, JPG or PNG.
                  </p>

                  <label className="mt-5 flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-gray-200 bg-gray-50 px-5 text-center transition hover:border-gray-400 hover:bg-white">

                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleInvoiceChange}
                    />

                    {invoice ? (
                      <>
                        <div className="text-4xl">📄</div>

                        <p className="mt-3 max-w-full truncate text-[12px] font-extrabold">
                          {invoice.name}
                        </p>

                        <p className="mt-1 text-[9px] font-bold text-emerald-600">
                          ✓ Invoice selected
                        </p>

                        <p className="mt-2 text-[9px] text-gray-400">
                          Tap to replace
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                          ☁️
                        </div>

                        <p className="mt-4 text-[12px] font-extrabold">
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
                      className="mt-4 w-full rounded-xl bg-[#101828] py-4 text-[11px] font-extrabold text-white"
                    >
                      Continue with invoice →
                    </button>
                  )}
                </>
              )}

              {purchaseMethod === 'manual' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setPurchaseMethod(null);
                      setError('');
                    }}
                    className="mb-5 text-[10px] font-bold text-gray-400"
                  >
                    ← Back
                  </button>

                  <div className="mb-5">
                    <h3 className="text-[15px] font-extrabold">
                      Add purchase details
                    </h3>

                    <p className="mt-1 text-[10px] text-gray-500">
                      Enter the basic information.
                    </p>
                  </div>

                  <div className="space-y-4">

                    <div>
                      <label className="mb-1.5 block text-[8px] font-extrabold tracking-[0.12em] text-gray-500">
                        PRODUCT NAME
                      </label>

                      <input
                        type="text"
                        value={form.name}
                        onChange={(event) =>
                          updateForm('name', event.target.value)
                        }
                        placeholder="Samsung Smart TV"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3.5 text-[12px] outline-none focus:border-gray-900 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[8px] font-extrabold tracking-[0.12em] text-gray-500">
                          CATEGORY
                        </label>

                        <select
                          value={form.category}
                          onChange={(event) =>
                            updateForm('category', event.target.value)
                          }
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        >
                          {categories.map((category) => (
                            <option key={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[8px] font-extrabold tracking-[0.12em] text-gray-500">
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
                              updateForm('price', event.target.value)
                            }
                            placeholder="45000"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-7 pr-3 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[8px] font-extrabold tracking-[0.12em] text-gray-500">
                        PURCHASE DATE
                      </label>

                      <input
                        type="date"
                        value={form.date}
                        onChange={(event) =>
                          updateForm('date', event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[8px] font-extrabold tracking-[0.12em] text-gray-500">
                        SELLER / STORE
                      </label>

                      <input
                        value={form.seller}
                        onChange={(event) =>
                          updateForm('seller', event.target.value)
                        }
                        placeholder="Amazon"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[8px] font-extrabold tracking-[0.12em] text-gray-500">
                          WARRANTY
                        </label>

                        <select
                          value={form.warranty}
                          onChange={(event) =>
                            updateForm('warranty', event.target.value)
                          }
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        >
                          {warrantyOptions.map((option) => (
                            <option key={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[8px] font-extrabold tracking-[0.12em] text-gray-500">
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
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        >
                          {returnOptions.map((option) => (
                            <option key={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-[10px] font-semibold text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={savePurchase}
                    className="mt-5 w-full rounded-xl bg-[#101828] py-4 text-[11px] font-extrabold text-white shadow-lg shadow-black/10 transition active:scale-[0.99]"
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
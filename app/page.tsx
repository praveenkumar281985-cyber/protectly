'use client';

import { ChangeEvent, useMemo, useState } from 'react';

type Purchase = {
  id: number;
  icon: string;
  name: string;
  category: string;
  price: number;
  date: string;
  seller: string;
  warranty: string;
  returnWindow: string;
  status: 'Warranty Active' | 'Return Active' | 'Protected';
  meta: string;
};

const initialPurchases: Purchase[] = [
  {
    id: 1,
    icon: '📺',
    name: 'Samsung Smart TV',
    category: 'Electronics',
    price: 45999,
    date: '2026-07-28',
    seller: 'Amazon',
    warranty: '1 year',
    returnWindow: '7 days',
    status: 'Warranty Active',
    meta: 'Warranty expires in 21 days',
  },
  {
    id: 2,
    icon: '❄️',
    name: 'LG Split AC',
    category: 'Home Appliance',
    price: 45000,
    date: '2026-08-10',
    seller: 'Flipkart',
    warranty: '1 year',
    returnWindow: '30 days',
    status: 'Return Active',
    meta: '8 days remaining',
  },
  {
    id: 3,
    icon: '📱',
    name: 'iPhone 16',
    category: 'Mobile',
    price: 79900,
    date: '2026-05-18',
    seller: 'Apple Store',
    warranty: '1 year',
    returnWindow: '7 days',
    status: 'Protected',
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
  const [activeTab, setActiveTab] = useState('Home');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseMethod, setPurchaseMethod] = useState<'invoice' | 'manual' | null>(null);
  const [invoice, setInvoice] = useState<File | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    date: '',
    seller: '',
    warranty: '1 year',
    returnWindow: '7 days',
  });

  const protectedValue = useMemo(
    () => purchases.reduce((sum, purchase) => sum + purchase.price, 0),
    [purchases]
  );

  const activeWarranties = purchases.filter(
    (purchase) => purchase.status === 'Warranty Active'
  ).length;

  const visiblePurchases = showAll ? purchases : purchases.slice(0, 3);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2500);
  }

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
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleInvoiceChange(event: ChangeEvent<HTMLInputElement>) {
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
      date: form.date,
      seller: form.seller.trim() || 'Unknown seller',
      warranty: form.warranty,
      returnWindow: form.returnWindow,
      status: form.warranty === 'No warranty' ? 'Protected' : 'Warranty Active',
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

    closePurchaseModal();
    notify('Purchase protected successfully');
  }

  function continueWithInvoice() {
    if (!invoice) {
      setError('Please select an invoice first.');
      return;
    }

    const inferredName = invoice.name.replace(/\.[^/.]+$/, '') || 'New purchase';

    setForm((current) => ({
      ...current,
      name: inferredName,
      date: new Date().toISOString().slice(0, 10),
    }));

    setPurchaseMethod('manual');
    setError('');
    notify('Invoice added — review the details below');
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f7fb] text-[#101828]">
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setActiveTab('Home')}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#101828] text-lg shadow-lg shadow-black/10">
              🛡️
            </div>
            <div>
              <div className="text-[16px] font-black tracking-[-0.04em]">Protectly</div>
              <div className="hidden text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400 sm:block">
                Your purchase shield
              </div>
            </div>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-[#f4f5f7] text-[11px] font-black shadow-sm transition active:scale-95"
            >
              PS
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-1.5 shadow-2xl">
                <button
                  type="button"
                  onClick={() => notify('Account settings coming next')}
                  className="w-full rounded-xl px-3 py-3 text-left text-[12px] font-bold hover:bg-gray-50"
                >
                  Account
                </button>
                <button
                  type="button"
                  onClick={() => notify('Settings coming next')}
                  className="w-full rounded-xl px-3 py-3 text-left text-[12px] font-bold hover:bg-gray-50"
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => notify('You are signed out of this demo')}
                  className="w-full rounded-xl px-3 py-3 text-left text-[12px] font-bold text-red-500 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8">
        <section className="relative overflow-hidden rounded-[28px] bg-[#0d1728] p-5 text-white shadow-[0_20px_60px_rgba(16,24,40,0.18)] sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-blue-400/[0.10] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-64 rounded-full bg-indigo-400/[0.08] blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-[9px] font-black uppercase tracking-[0.17em] text-white/70">
                Protection active
              </span>
            </div>

            <h1 className="text-[30px] font-black leading-[1.04] tracking-[-0.055em] sm:text-[46px]">
              Everything you buy.
              <br />
              <span className="text-white/35">Always protected.</span>
            </h1>

            <p className="mt-4 max-w-lg text-[11px] leading-5 text-white/55 sm:text-[13px]">
              Receipts, warranties, returns and consumer cases — organized in one secure place.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openPurchaseModal}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[11px] font-black text-[#101828] shadow-xl transition hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span className="text-lg">+</span>
                Protect a purchase
              </button>

              <button
                type="button"
                onClick={() => notify('Protection scan will analyze your purchases')}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] px-5 text-[11px] font-black text-white transition hover:bg-white/[0.10] active:scale-[0.98]"
              >
                Run protection check
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] border border-black/[0.05] bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f4f8] text-sm">
              ₹
            </div>
            <p className="text-[9px] font-bold text-gray-400">Protected value</p>
            <p className="mt-1 text-[20px] font-black tracking-[-0.04em]">
              {formatCurrency(protectedValue)}
            </p>
            <p className="mt-1 text-[9px] text-gray-400">{purchases.length} purchases</p>
          </div>

          <div className="rounded-[20px] border border-black/[0.05] bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm text-emerald-600">
              ✓
            </div>
            <p className="text-[9px] font-bold text-gray-400">Active warranties</p>
            <p className="mt-1 text-[20px] font-black tracking-[-0.04em]">
              {activeWarranties}
            </p>
            <p className="mt-1 text-[9px] text-gray-400">Needs monitoring</p>
          </div>

          <div className="col-span-2 rounded-[20px] border border-black/[0.05] bg-white p-4 shadow-sm sm:col-span-1">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-sm text-orange-500">
              !
            </div>
            <p className="text-[9px] font-bold text-gray-400">Open cases</p>
            <p className="mt-1 text-[20px] font-black tracking-[-0.04em]">1</p>
            <p className="mt-1 text-[9px] text-gray-400">Needs attention</p>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">
                Attention
              </p>
              <h2 className="mt-1 text-[18px] font-black tracking-[-0.03em]">
                Needs your attention
              </h2>
            </div>
            <span className="rounded-full bg-[#eceff3] px-2.5 py-1 text-[9px] font-black text-gray-500">
              2 items
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                const purchase = purchases.find((item) => item.name === 'Samsung Smart TV');
                if (purchase) setSelectedPurchase(purchase);
              }}
              className="rounded-[20px] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                  ⚠️
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-black uppercase tracking-[0.14em] text-orange-500">
                    Warranty ending
                  </p>
                  <p className="mt-1 truncate text-[13px] font-black">Samsung Smart TV</p>
                  <p className="mt-1 text-[9px] text-gray-500">Expires in 21 days</p>
                </div>
                <span className="rounded-lg bg-white px-3 py-2 text-[9px] font-black shadow-sm">
                  View
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => notify('Refund case opened — escalation flow is ready')}
              className="rounded-[20px] border border-red-100 bg-gradient-to-br from-red-50 to-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  ₹
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-black uppercase tracking-[0.14em] text-red-500">
                    Refund pending
                  </p>
                  <p className="mt-1 truncate text-[13px] font-black">Amazon Refund</p>
                  <p className="mt-1 text-[9px] text-gray-500">₹8,499 · pending for 6 days</p>
                </div>
                <span className="rounded-lg bg-[#101828] px-3 py-2 text-[9px] font-black text-white">
                  Continue
                </span>
              </div>
            </button>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">
                Your vault
              </p>
              <h2 className="mt-1 text-[18px] font-black tracking-[-0.03em]">
                Protected purchases
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="text-[10px] font-black text-gray-500"
            >
              {showAll ? 'Show less ↑' : 'View all →'}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="group rounded-[22px] border border-black/[0.05] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#f3f5f8] text-xl">
                    {purchase.icon}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPurchase(purchase)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition hover:bg-gray-50 hover:text-gray-700"
                    aria-label={`Open ${purchase.name}`}
                  >
                    •••
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPurchase(purchase)}
                  className="mt-4 block w-full text-left"
                >
                  <p className="truncate text-[13px] font-black">{purchase.name}</p>
                  <p className="mt-1 text-[9px] font-semibold text-gray-400">
                    {purchase.category} · {purchase.seller}
                  </p>
                </button>

                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-black tracking-[-0.02em]">
                      {formatCurrency(purchase.price)}
                    </p>
                    <p className="mt-1 text-[9px] text-gray-400">{purchase.meta}</p>
                  </div>

                  <span
                    className={
                      'rounded-full px-2.5 py-1 text-[8px] font-black ' +
                      (purchase.status === 'Warranty Active'
                        ? 'bg-emerald-50 text-emerald-600'
                        : purchase.status === 'Return Active'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-purple-50 text-purple-600')
                    }
                  >
                    {purchase.status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPurchase(purchase)}
                  className="mt-4 flex w-full items-center justify-between border-t border-black/[0.05] pt-3 text-[9px] font-bold text-gray-400"
                >
                  <span>Documents protected</span>
                  <span className="text-gray-700">View details →</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[24px] bg-[#101828] p-5 text-white shadow-xl sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-white/[0.08] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-white/50">
                Protectly protection
              </div>
              <h3 className="text-[19px] font-black tracking-[-0.03em]">
                Don&apos;t let a deadline
                <br />
                cost you money.
              </h3>
              <p className="mt-2 max-w-lg text-[10px] leading-5 text-white/45">
                Protect the documents that matter and know what action to take before you lose
                your return or warranty window.
              </p>
            </div>

            <button
              type="button"
              onClick={openPurchaseModal}
              className="shrink-0 rounded-xl bg-white px-5 py-3 text-[10px] font-black text-[#101828] transition hover:-translate-y-0.5 active:scale-95"
            >
              Add protection
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.08] pt-4 text-[8px] font-semibold text-white/40">
            <span>🔒 Secure storage</span>
            <span>📄 Private documents</span>
            <span>🛡️ Consumer protection</span>
          </div>
        </section>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/[0.06] bg-white/95 px-4 py-2.5 backdrop-blur-xl sm:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {[
            ['Home', '⌂'],
            ['Purchases', '▣'],
            ['Alerts', '!'],
            ['Profile', '●'],
          ].map(([label, icon]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setActiveTab(label);
                if (label === 'Purchases') setShowAll(true);
                if (label === 'Alerts') notify('2 protection items need attention');
                if (label === 'Profile') setMenuOpen(true);
              }}
              className={
                'flex min-w-[62px] flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[8px] font-black ' +
                (activeTab === label ? 'text-[#101828]' : 'text-gray-400')
              }
            >
              <span
                className={
                  'flex h-7 w-7 items-center justify-center rounded-lg text-[12px] ' +
                  (activeTab === label ? 'bg-[#101828] text-white' : 'bg-gray-100')
                }
              >
                {icon}
              </span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {toast && (
        <div className="fixed bottom-20 left-1/2 z-[70] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-2xl bg-[#101828] px-4 py-3 text-center text-[10px] font-black text-white shadow-2xl sm:bottom-6">
          {toast}
        </div>
      )}

      {selectedPurchase && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setSelectedPurchase(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-black/[0.06] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-gray-400">
                    Purchase details
                  </p>
                  <h2 className="mt-1 text-[18px] font-black">{selectedPurchase.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPurchase(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-3 px-5 py-5">
              <div className="flex items-center gap-4 rounded-2xl bg-[#f7f8fa] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">
                  {selectedPurchase.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400">Protected value</p>
                  <p className="mt-1 text-[20px] font-black">
                    {formatCurrency(selectedPurchase.price)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Seller', selectedPurchase.seller],
                  ['Category', selectedPurchase.category],
                  ['Warranty', selectedPurchase.warranty],
                  ['Return window', selectedPurchase.returnWindow],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-black/[0.05] p-3">
                    <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">
                      {label}
                    </p>
                    <p className="mt-1 text-[11px] font-black">{value}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => notify('Document vault opened')}
                className="w-full rounded-xl bg-[#101828] py-3.5 text-[10px] font-black text-white"
              >
                Open document vault →
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <p className="text-[8px] font-black uppercase tracking-[0.17em] text-gray-400">
                      Purchase protection
                    </p>
                    <h2 className="mt-0.5 text-[18px] font-black tracking-[-0.03em]">
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
                    <h3 className="text-[15px] font-black">Choose how to add it</h3>
                    <p className="mt-1 text-[10px] leading-5 text-gray-400">
                      Upload an invoice for the fastest flow, or enter details manually.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setPurchaseMethod('invoice')}
                      className="flex w-full items-center gap-4 rounded-[20px] border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-gray-300 hover:bg-white active:scale-[0.99]"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-blue-50 text-xl">
                        📄
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-black">Upload invoice</p>
                        <p className="mt-1 text-[10px] leading-4 text-gray-500">
                          Add PDF, JPG or PNG and review the extracted details.
                        </p>
                      </div>
                      <span className="text-gray-300">→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPurchaseMethod('manual')}
                      className="flex w-full items-center gap-4 rounded-[20px] border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-gray-300 hover:bg-white active:scale-[0.99]"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-purple-50 text-xl">
                        ✍️
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-black">Add manually</p>
                        <p className="mt-1 text-[10px] leading-4 text-gray-500">
                          Enter purchase, warranty and return details yourself.
                        </p>
                      </div>
                      <span className="text-gray-300">→</span>
                    </button>
                  </div>

                  <div className="mt-6 flex justify-center gap-4 text-[8px] font-semibold text-gray-400">
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
                      setError('');
                    }}
                    className="mb-5 text-[10px] font-black text-gray-400"
                  >
                    ← Back
                  </button>

                  <h3 className="text-[15px] font-black">Upload your invoice</h3>
                  <p className="mt-1 text-[10px] text-gray-500">PDF, JPG or PNG.</p>

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
                        <p className="mt-3 max-w-full truncate text-[12px] font-black">
                          {invoice.name}
                        </p>
                        <p className="mt-1 text-[9px] font-black text-emerald-600">
                          ✓ Invoice selected
                        </p>
                        <p className="mt-2 text-[9px] text-gray-400">Tap to replace</p>
                      </>
                    ) : (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                          ☁️
                        </div>
                        <p className="mt-4 text-[12px] font-black">Tap to upload invoice</p>
                        <p className="mt-1 text-[10px] text-gray-400">PDF, JPG or PNG</p>
                      </>
                    )}
                  </label>

                  {error && (
                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-[10px] font-bold text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={continueWithInvoice}
                    className="mt-4 w-full rounded-xl bg-[#101828] py-4 text-[11px] font-black text-white shadow-lg"
                  >
                    Continue with invoice →
                  </button>
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
                    className="mb-5 text-[10px] font-black text-gray-400"
                  >
                    ← Back
                  </button>

                  <div className="mb-5">
                    <h3 className="text-[15px] font-black">Review purchase details</h3>
                    <p className="mt-1 text-[10px] text-gray-500">
                      These details will be used to track your protection.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[8px] font-black tracking-[0.12em] text-gray-500">
                        PRODUCT NAME
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(event) => updateForm('name', event.target.value)}
                        placeholder="Samsung Smart TV"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3.5 text-[12px] outline-none focus:border-gray-900 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[8px] font-black tracking-[0.12em] text-gray-500">
                          CATEGORY
                        </label>
                        <select
                          value={form.category}
                          onChange={(event) => updateForm('category', event.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        >
                          {categories.map((category) => (
                            <option key={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[8px] font-black tracking-[0.12em] text-gray-500">
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
                            onChange={(event) => updateForm('price', event.target.value)}
                            placeholder="45000"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-7 pr-3 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[8px] font-black tracking-[0.12em] text-gray-500">
                        PURCHASE DATE
                      </label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(event) => updateForm('date', event.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[8px] font-black tracking-[0.12em] text-gray-500">
                        SELLER / STORE
                      </label>
                      <input
                        value={form.seller}
                        onChange={(event) => updateForm('seller', event.target.value)}
                        placeholder="Amazon"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[8px] font-black tracking-[0.12em] text-gray-500">
                          WARRANTY
                        </label>
                        <select
                          value={form.warranty}
                          onChange={(event) => updateForm('warranty', event.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        >
                          {warrantyOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[8px] font-black tracking-[0.12em] text-gray-500">
                          RETURN WINDOW
                        </label>
                        <select
                          value={form.returnWindow}
                          onChange={(event) => updateForm('returnWindow', event.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3.5 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        >
                          {returnOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-[10px] font-bold text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={savePurchase}
                    className="mt-5 w-full rounded-xl bg-[#101828] py-4 text-[11px] font-black text-white shadow-lg shadow-black/10 transition active:scale-[0.99]"
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

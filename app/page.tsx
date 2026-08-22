'use client';

import { ChangeEvent, useMemo, useState } from 'react';

type Purchase = {
  id: number;
  name: string;
  category: string;
  price: number;
  date: string;
  seller: string;
  warranty: number;
  returnWindow: number;
  invoice?: string;
};

const initialPurchases: Purchase[] = [
  {
    id: 1,
    name: 'Samsung Smart TV',
    category: 'Electronics',
    price: 45999,
    date: '2026-07-28',
    seller: 'Samsung',
    warranty: 365,
    returnWindow: 7,
    invoice: 'Samsung-TV-Invoice.pdf',
  },
  {
    id: 2,
    name: 'LG Split AC',
    category: 'Home Appliances',
    price: 45000,
    date: '2026-06-18',
    seller: 'LG',
    warranty: 365,
    returnWindow: 10,
  },
  {
    id: 3,
    name: 'iPhone 16',
    category: 'Electronics',
    price: 79900,
    date: '2026-05-12',
    seller: 'Apple',
    warranty: 365,
    returnWindow: 14,
  },
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const getDaysLeft = (date: string, days: number) => {
  const start = new Date(date).getTime();
  const end = start + days * 86400000;
  return Math.ceil((end - Date.now()) / 86400000);
};

export default function Home() {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [showModal, setShowModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [invoice, setInvoice] = useState<File | null>(null);
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    date: new Date().toISOString().split('T')[0],
    seller: '',
    warranty: '365',
    returnWindow: '7',
  });

  const totalValue = useMemo(
    () => purchases.reduce((sum, purchase) => sum + purchase.price, 0),
    [purchases]
  );

  const warrantyCount = purchases.filter(
    (purchase) => getDaysLeft(purchase.date, purchase.warranty) > 0
  ).length;

  const attentionCount = purchases.filter(
    (purchase) => getDaysLeft(purchase.date, purchase.warranty) <= 30
  ).length;

  const openModal = () => {
    setForm({
      name: '',
      category: 'Electronics',
      price: '',
      date: new Date().toISOString().split('T')[0],
      seller: '',
      warranty: '365',
      returnWindow: '7',
    });
    setInvoice(null);
    setShowModal(true);
  };

  const handleInvoice = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setInvoice(file);
  };

  const addPurchase = () => {
    if (!form.name.trim() || !form.price || !form.seller.trim()) {
      setToast('Please complete the purchase details.');
      setTimeout(() => setToast(''), 2500);
      return;
    }

    const newPurchase: Purchase = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      price: Number(form.price),
      date: form.date,
      seller: form.seller,
      warranty: Number(form.warranty),
      returnWindow: Number(form.returnWindow),
      invoice: invoice?.name,
    };

    setPurchases((current) => [newPurchase, ...current]);
    setShowModal(false);
    setToast('Purchase protected successfully.');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#101828]">
      <div className="mx-auto min-h-screen max-w-[1180px] bg-[#f5f7fb]">

        {/* TOP BAR */}
        <header className="sticky top-0 z-30 border-b border-[#e8ecf3] bg-white/90 backdrop-blur-xl">
          <div className="flex h-[70px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#111827] shadow-lg shadow-slate-300">
                <span className="text-lg">🛡️</span>
              </div>

              <div>
                <div className="text-[17px] font-black tracking-[-0.5px]">
                  Protectly
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[2px] text-slate-400">
                  Your purchase shield
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 sm:block"
                onClick={() => setToast('Search coming next.')}
              >
                Search
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-700"
                onClick={() => setToast('Profile settings coming next.')}
              >
                PS
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <div className="px-4 pb-28 pt-6 sm:px-6 lg:px-8">

          {/* HERO */}
          <section className="relative overflow-hidden rounded-[28px] bg-[#101827] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="absolute -bottom-28 left-1/3 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
                  Everything protected
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl sm:flex">
                  🛡️
                </div>
              </div>

              <div className="max-w-[620px]">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[2px] text-slate-400">
                  Total protected value
                </p>

                <h1 className="text-4xl font-black tracking-[-1.5px] sm:text-5xl">
                  {formatMoney(totalValue)}
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Across {purchases.length} protected purchases
                </p>
              </div>

              <button
                onClick={openModal}
                className="relative mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-[#101827] shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100 sm:w-auto"
              >
                <span className="text-lg">+</span>
                Protect a purchase
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm">
                📦
              </div>
              <div className="text-2xl font-black">{purchases.length}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Purchases
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm">
                🛡️
              </div>
              <div className="text-2xl font-black">{warrantyCount}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Warranties
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-sm">
                ⚠️
              </div>
              <div className="text-2xl font-black">{attentionCount}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Attention
              </div>
            </div>
          </section>

          {/* ATTENTION */}
          <section className="mt-7">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
                  Need attention
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight">
                  Stay protected
                </h2>
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-600">
                {attentionCount} alerts
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {purchases.slice(0, 2).map((purchase, index) => {
                const days = getDaysLeft(purchase.date, purchase.warranty);

                return (
                  <button
                    key={purchase.id}
                    onClick={() => setSelectedPurchase(purchase)}
                    className={`group flex items-center justify-between rounded-[22px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                      index === 0
                        ? 'border-amber-100 bg-[#fffaf0]'
                        : 'border-rose-100 bg-[#fff6f7]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          index === 0
                            ? 'bg-amber-100'
                            : 'bg-rose-100'
                        }`}
                      >
                        {index === 0 ? '⌛' : '💰'}
                      </div>

                      <div className="min-w-0">
                        <div
                          className={`text-[9px] font-black uppercase tracking-wider ${
                            index === 0
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {index === 0 ? 'Warranty' : 'Refund'}
                        </div>

                        <div className="truncate text-sm font-black">
                          {purchase.name}
                        </div>

                        <div className="mt-0.5 text-[10px] text-slate-400">
                          {days > 0
                            ? `Warranty expires in ${Math.max(days, 1)} days`
                            : 'Needs attention'}
                        </div>
                      </div>
                    </div>

                    <span className="ml-3 rounded-xl bg-white px-3 py-2 text-[10px] font-black shadow-sm">
                      View
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* PURCHASES */}
          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
                  Recent
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight">
                  Protected purchases
                </h2>
              </div>

              <button
                onClick={openModal}
                className="text-xs font-black text-slate-500 transition hover:text-slate-900"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {purchases.map((purchase) => {
                const warrantyDays = getDaysLeft(
                  purchase.date,
                  purchase.warranty
                );

                return (
                  <button
                    key={purchase.id}
                    onClick={() => setSelectedPurchase(purchase)}
                    className="group flex w-full items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                      {purchase.category === 'Electronics'
                        ? '📱'
                        : '🏠'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-black">
                          {purchase.name}
                        </h3>

                        {purchase.invoice && (
                          <span className="hidden rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black text-emerald-600 sm:block">
                            INVOICE
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {purchase.seller} · {purchase.category}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-black text-slate-700">
                          {formatMoney(purchase.price)}
                        </span>

                        <span className="text-slate-300">•</span>

                        <span
                          className={`text-[10px] font-bold ${
                            warrantyDays <= 30
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {warrantyDays > 0
                            ? `${warrantyDays}d warranty`
                            : 'Warranty expired'}
                        </span>
                      </div>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-slate-900 group-hover:text-white">
                      →
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* VALUE PROP */}
          <section className="mt-8 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#101827] text-xl">
                ✨
              </div>

              <div>
                <h3 className="text-sm font-black">
                  Your purchases, protected automatically
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Keep invoices, warranties, return deadlines and consumer
                  cases together instead of searching through emails and
                  WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ['📄', 'Invoices'],
                ['↩️', 'Returns'],
                ['🛡️', 'Warranties'],
                ['⚖️', 'Complaints'],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-slate-50 px-3 py-3 text-center"
                >
                  <div className="text-base">{icon}</div>
                  <div className="mt-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* MOBILE NAV */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-[1180px] border-t border-slate-200 bg-white/95 px-5 pb-[max(10px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[560px] items-center justify-between">
            <button
              onClick={() => setToast('Dashboard')}
              className="flex flex-col items-center gap-1 text-[#101827]"
            >
              <span className="text-lg">⌂</span>
              <span className="text-[9px] font-black">Home</span>
            </button>

            <button
              onClick={() => setToast('Your purchases')}
              className="flex flex-col items-center gap-1 text-slate-400"
            >
              <span className="text-lg">📦</span>
              <span className="text-[9px] font-bold">Purchases</span>
            </button>

            <button
              onClick={openModal}
              className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#101827] text-2xl text-white shadow-[0_12px_30px_rgba(15,23,42,.3)]"
            >
              +
            </button>

            <button
              onClick={() => setToast('Alerts')}
              className="relative flex flex-col items-center gap-1 text-slate-400"
            >
              <span className="text-lg">⚠</span>
              <span className="text-[9px] font-bold">Alerts</span>

              {attentionCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black text-white">
                  {attentionCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setToast('Profile')}
              className="flex flex-col items-center gap-1 text-slate-400"
            >
              <span className="text-lg">●</span>
              <span className="text-[9px] font-bold">Profile</span>
            </button>
          </div>
        </nav>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-2xl bg-[#101827] px-5 py-3 text-xs font-bold text-white shadow-2xl">
          {toast}
        </div>
      )}

      {/* PURCHASE DETAIL */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="w-full max-w-[520px] rounded-t-[30px] bg-white p-6 shadow-2xl sm:rounded-[30px]">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />

            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 text-[10px] font-black uppercase tracking-[2px] text-slate-400">
                  Protected purchase
                </div>

                <h2 className="text-2xl font-black tracking-tight">
                  {selectedPurchase.name}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedPurchase.seller} · {selectedPurchase.category}
                </p>
              </div>

              <button
                onClick={() => setSelectedPurchase(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Purchase value
                </div>
                <div className="mt-2 text-lg font-black">
                  {formatMoney(selectedPurchase.price)}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Warranty
                </div>
                <div className="mt-2 text-lg font-black">
                  {Math.max(
                    getDaysLeft(
                      selectedPurchase.date,
                      selectedPurchase.warranty
                    ),
                    0
                  )}{' '}
                  days
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 p-4">
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Documents
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    📄
                  </div>

                  <div>
                    <div className="text-xs font-black">
                      {selectedPurchase.invoice || 'No invoice uploaded'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Purchase document
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-600">
                  PROTECTED
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPurchase(null)}
              className="mt-5 w-full rounded-2xl bg-[#101827] py-4 text-sm font-black text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ADD PURCHASE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-t-[30px] bg-white p-6 shadow-2xl sm:rounded-[30px]">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />

            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[2px] text-blue-600">
                  Protect a purchase
                </div>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Add your purchase
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Save the details now. Protectly can track it later.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Product name
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Samsung Smart TV"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-sm font-semibold outline-none focus:border-slate-900"
                  >
                    <option>Electronics</option>
                    <option>Home Appliances</option>
                    <option>Furniture</option>
                    <option>Fashion</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Price
                  </label>

                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="₹ 45,999"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Purchase date
                  </label>

                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-sm font-semibold outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Seller
                  </label>

                  <input
                    value={form.seller}
                    onChange={(e) =>
                      setForm({ ...form, seller: e.target.value })
                    }
                    placeholder="Amazon"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Warranty days
                  </label>

                  <input
                    type="number"
                    value={form.warranty}
                    onChange={(e) =>
                      setForm({ ...form, warranty: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Return window
                  </label>

                  <input
                    type="number"
                    value={form.returnWindow}
                    onChange={(e) =>
                      setForm({ ...form, returnWindow: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* INVOICE */}
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Invoice / receipt
                </label>

                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition hover:border-slate-400 hover:bg-white">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                    📄
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black">
                      {invoice ? invoice.name : 'Upload invoice'}
                    </div>

                    <div className="mt-1 text-[10px] text-slate-400">
                      PDF, JPG or PNG
                    </div>
                  </div>

                  <span className="rounded-xl bg-[#101827] px-3 py-2 text-[10px] font-black text-white">
                    Browse
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleInvoice}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                onClick={addPurchase}
                className="w-full rounded-2xl bg-[#101827] py-4 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Protect this purchase →
              </button>

              <p className="text-center text-[10px] leading-4 text-slate-400">
                Your purchase details stay associated with your Protectly
                account.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
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
    status: 'Warranty active',
    statusType: 'green',
    meta: '21 days left',
  },
  {
    id: 2,
    icon: '❄️',
    name: 'LG Split AC',
    category: 'Home Appliance',
    price: 45000,
    status: 'Return active',
    statusType: 'blue',
    meta: '8 days left',
  },
  {
    id: 3,
    icon: '📱',
    name: 'iPhone 16',
    category: 'Mobile',
    price: 79900,
    status: 'Protected',
    statusType: 'purple',
    meta: '11 months warranty',
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
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
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
    (purchase) =>
      purchase.status === 'Warranty active'
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
          : 'Warranty active',
      statusType:
        form.warranty === 'No warranty'
          ? 'purple'
          : 'green',
      meta:
        form.warranty === 'No warranty'
          ? 'Purchase protected'
          : `${form.warranty} warranty`,
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
    setActiveTab('purchases');
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">

      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#f7f8fa] shadow-[0_0_80px_rgba(15,23,42,0.08)]">

        <header className="sticky top-0 z-30 border-b border-black/[0.05] bg-white/95 backdrop-blur-xl">

          <div className="flex h-[62px] items-center justify-between px-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#111827] text-[17px] text-white shadow-sm">
                🛡️
              </div>

              <div>
                <p className="text-[16px] font-extrabold tracking-[-0.03em]">
                  Protectly
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Your purchase shield
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() => setShowProfile(!showProfile)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-gray-50 text-[11px] font-extrabold"
            >
              PS
            </button>

            {showProfile && (
              <div className="absolute right-5 top-[56px] z-50 w-48 rounded-2xl border border-black/[0.06] bg-white p-2 shadow-2xl">

                <div className="border-b border-gray-100 px-3 py-3">
                  <p className="text-[12px] font-bold">
                    Your account
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Protectly member
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-[11px] font-medium hover:bg-gray-50"
                >
                  Account settings
                </button>

                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2.5 text-left text-[11px] font-medium hover:bg-gray-50"
                >
                  Security
                </button>

                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2.5 text-left text-[11px] font-medium text-red-500 hover:bg-red-50"
                >
                  Sign out
                </button>

              </div>
            )}

          </div>

        </header>

        <div className="px-5 pb-28 pt-5">

          {activeTab === 'home' && (
            <>

              <section className="relative overflow-hidden rounded-[26px] bg-[#111827] p-5 text-white shadow-xl shadow-black/10">

                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.06]" />
                <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/[0.04]" />

                <div className="relative">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                        Protection status
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-[11px] font-semibold text-emerald-300">
                          Everything is protected
                        </span>
                      </div>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl">
                      🛡️
                    </div>

                  </div>

                  <div className="mt-7">

                    <p className="text-[10px] font-medium text-gray-400">
                      Total protected value
                    </p>

                    <p className="mt-1 text-[30px] font-extrabold tracking-[-0.05em]">
                      {formatCurrency(protectedValue)}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Across {purchases.length} protected purchases
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={openPurchaseModal}
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[11px] font-extrabold text-[#111827] shadow-sm active:scale-[0.98]"
                  >
                    <span className="text-base">+</span>
                    Protect a purchase
                  </button>

                </div>

              </section>

              <section className="mt-4 grid grid-cols-3 gap-2.5">

                <div className="rounded-2xl border border-black/[0.05] bg-white p-3.5 shadow-sm">
                  <div className="text-[16px]">📦</div>
                  <p className="mt-2 text-[18px] font-extrabold tracking-tight">
                    {purchases.length}
                  </p>
                  <p className="text-[9px] font-medium text-gray-400">
                    Purchases
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.05] bg-white p-3.5 shadow-sm">
                  <div className="text-[16px]">🛡️</div>
                  <p className="mt-2 text-[18px] font-extrabold tracking-tight">
                    {activeWarranties}
                  </p>
                  <p className="text-[9px] font-medium text-gray-400">
                    Warranties
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.05] bg-white p-3.5 shadow-sm">
                  <div className="text-[16px]">⚠️</div>
                  <p className="mt-2 text-[18px] font-extrabold tracking-tight">
                    1
                  </p>
                  <p className="text-[9px] font-medium text-gray-400">
                    Action needed
                  </p>
                </div>

              </section>

              <section className="mt-6">

                <div className="mb-3 flex items-center justify-between">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                      Needs attention
                    </p>

                    <h2 className="mt-1 text-[17px] font-extrabold tracking-tight">
                      Stay protected
                    </h2>
                  </div>

                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold text-orange-500">
                    2 alerts
                  </span>

                </div>

                <div className="space-y-2.5">

                  <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-3.5">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                      ⏳
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-[9px] font-bold uppercase tracking-wider text-orange-500">
                        Warranty
                      </p>

                      <p className="mt-0.5 truncate text-[12px] font-bold">
                        Samsung Smart TV
                      </p>

                      <p className="mt-0.5 text-[9px] text-gray-500">
                        Expires in 21 days
                      </p>

                    </div>

                    <button
                      type="button"
                      className="rounded-xl bg-white px-3 py-2 text-[9px] font-bold shadow-sm"
                    >
                      View
                    </button>

                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-3.5">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                      💰
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-[9px] font-bold uppercase tracking-wider text-red-500">
                        Refund
                      </p>

                      <p className="mt-0.5 truncate text-[12px] font-bold">
                        Amazon refund
                      </p>

                      <p className="mt-0.5 text-[9px] text-gray-500">
                        ₹8,499 · 6 days pending
                      </p>

                    </div>

                    <button
                      type="button"
                      className="rounded-xl bg-[#111827] px-3 py-2 text-[9px] font-bold text-white"
                    >
                      Continue
                    </button>

                  </div>

                </div>

              </section>

              <section className="mt-7">

                <div className="mb-3 flex items-end justify-between">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                      Recent
                    </p>

                    <h2 className="mt-1 text-[17px] font-extrabold tracking-tight">
                      Protected purchases
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('purchases')}
                    className="text-[10px] font-bold text-gray-500"
                  >
                    See all →
                  </button>

                </div>

                <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-sm">

                  {purchases.slice(0, 3).map(
                    (purchase, index) => (
                      <div
                        key={purchase.id}
                        className={
                          'flex items-center gap-3 p-3.5 ' +
                          (index !==
                          Math.min(purchases.length, 3) - 1
                            ? 'border-b border-gray-100'
                            : '')
                        }
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl">
                          {purchase.icon}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-[12px] font-bold">
                            {purchase.name}
                          </p>

                          <p className="mt-0.5 text-[9px] text-gray-400">
                            {purchase.category}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-[12px] font-extrabold">
                            {formatCurrency(purchase.price)}
                          </p>

                          <p
                            className={
                              'mt-1 text-[8px] font-bold ' +
                              (purchase.statusType === 'green'
                                ? 'text-emerald-600'
                                : purchase.statusType === 'blue'
                                ? 'text-blue-600'
                                : 'text-purple-600')
                            }
                          >
                            {purchase.status}
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </section>

              <section className="mt-5 rounded-[22px] border border-black/[0.05] bg-white p-4 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-lg">
                    🤖
                  </div>

                  <div className="flex-1">

                    <p className="text-[12px] font-extrabold">
                      Complaint Copilot
                    </p>

                    <p className="mt-0.5 text-[9px] leading-4 text-gray-400">
                      Need help with a seller, return or refund?
                    </p>

                  </div>

                  <button
                    type="button"
                    className="rounded-xl bg-[#111827] px-3 py-2 text-[9px] font-bold text-white"
                  >
                    Open
                  </button>

                </div>

              </section>

            </>
          )}

          {activeTab === 'purchases' && (
            <>

              <section>

                <div className="flex items-end justify-between">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                      Your vault
                    </p>

                    <h1 className="mt-1 text-[25px] font-extrabold tracking-[-0.04em]">
                      Purchases
                    </h1>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Every purchase, document and warranty in one place.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openPurchaseModal}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-xl font-light text-white shadow-lg"
                  >
                    +
                  </button>

                </div>

                <div className="mt-5 rounded-2xl bg-[#111827] p-4 text-white">

                  <p className="text-[9px] text-gray-400">
                    Total protected value
                  </p>

                  <p className="mt-1 text-[24px] font-extrabold tracking-tight">
                    {formatCurrency(protectedValue)}
                  </p>

                  <div className="mt-3 flex gap-2">

                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-[8px] font-semibold text-gray-300">
                      {purchases.length} purchases
                    </span>

                    <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[8px] font-semibold text-emerald-300">
                      Protected
                    </span>

                  </div>

                </div>

                <div className="mt-4 space-y-2.5">

                  {purchases.map((purchase) => (

                    <div
                      key={purchase.id}
                      className="rounded-2xl border border-black/[0.05] bg-white p-4 shadow-sm"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-2xl">
                          {purchase.icon}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-[13px] font-extrabold">
                            {purchase.name}
                          </p>

                          <p className="mt-0.5 text-[9px] text-gray-400">
                            {purchase.category}
                          </p>

                        </div>

                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400"
                        >
                          •••
                        </button>

                      </div>

                      <div className="mt-4 flex items-end justify-between">

                        <div>

                          <p className="text-[16px] font-extrabold">
                            {formatCurrency(purchase.price)}
                          </p>

                          <p className="mt-0.5 text-[9px] text-gray-400">
                            {purchase.meta}
                          </p>

                        </div>

                        <span
                          className={
                            'rounded-lg px-2.5 py-1.5 text-[8px] font-bold ' +
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

                      <div className="mt-3 flex gap-2">

                        <button
                          type="button"
                          className="flex-1 rounded-xl bg-gray-50 py-2.5 text-[9px] font-bold text-gray-600"
                        >
                          📄 Documents
                        </button>

                        <button
                          type="button"
                          className="flex-1 rounded-xl bg-gray-50 py-2.5 text-[9px] font-bold text-gray-600"
                        >
                          🛡️ Warranty
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              </section>

            </>
          )}

          {activeTab === 'cases' && (
            <>

              <section>

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Consumer protection
                </p>

                <h1 className="mt-1 text-[25px] font-extrabold tracking-[-0.04em]">
                  Cases
                </h1>

                <p className="mt-1 text-[10px] text-gray-400">
                  Track refunds, complaints and problems until resolved.
                </p>

              </section>

              <section className="mt-5 rounded-[24px] bg-[#111827] p-5 text-white">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
                    ⚠️
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Open case
                    </p>
                    <p className="mt-1 text-[15px] font-extrabold">
                      Amazon refund
                    </p>
                  </div>

                </div>

                <div className="mt-5">

                  <div className="flex items-center justify-between text-[9px] text-gray-400">
                    <span>Started</span>
                    <span>Waiting for refund</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[65%] rounded-full bg-white" />
                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between">

                  <div>
                    <p className="text-[9px] text-gray-400">
                      Amount
                    </p>
                    <p className="mt-0.5 text-[14px] font-bold">
                      ₹8,499
                    </p>
                  </div>

                  <button
                    type="button"
                    className="rounded-xl bg-white px-4 py-2.5 text-[9px] font-extrabold text-[#111827]"
                  >
                    Continue case →
                  </button>

                </div>

              </section>

              <section className="mt-4 space-y-2.5">

                <div className="rounded-2xl border border-black/[0.05] bg-white p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      ↩️
                    </div>

                    <div className="flex-1">
                      <p className="text-[12px] font-bold">
                        Return tracking
                      </p>
                      <p className="mt-0.5 text-[9px] text-gray-400">
                        Track return deadlines and refunds
                      </p>
                    </div>

                    <span className="text-gray-300">
                      →
                    </span>

                  </div>

                </div>

                <div className="rounded-2xl border border-black/[0.05] bg-white p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                      🤖
                    </div>

                    <div className="flex-1">
                      <p className="text-[12px] font-bold">
                        Complaint Copilot
                      </p>
                      <p className="mt-0.5 text-[9px] text-gray-400">
                        Analyze messages and find your next step
                      </p>
                    </div>

                    <span className="text-gray-300">
                      →
                    </span>

                  </div>

                </div>

              </section>

            </>
          )}

          {activeTab === 'profile' && (
            <>

              <section>

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  Account
                </p>

                <h1 className="mt-1 text-[25px] font-extrabold tracking-[-0.04em]">
                  Profile
                </h1>

              </section>

              <section className="mt-5 rounded-[24px] bg-white p-5 shadow-sm">

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111827] text-sm font-extrabold text-white">
                    PS
                  </div>

                  <div>
                    <p className="text-[16px] font-extrabold">
                      Protectly Member
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400">
                      Your purchases are protected here.
                    </p>
                  </div>

                </div>

              </section>

              <section className="mt-4 overflow-hidden rounded-2xl border border-black/[0.05] bg-white">

                <button
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50">
                    ⚙️
                  </span>
                  <span className="flex-1 text-[11px] font-bold">
                    Account settings
                  </span>
                  <span className="text-gray-300">
                    →
                  </span>
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50">
                    🔒
                  </span>
                  <span className="flex-1 text-[11px] font-bold">
                    Privacy & security
                  </span>
                  <span className="text-gray-300">
                    →
                  </span>
                </button>

                <button
                  type="button"
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50">
                    ❓
                  </span>
                  <span className="flex-1 text-[11px] font-bold">
                    Help & support
                  </span>
                  <span className="text-gray-300">
                    →
                  </span>
                </button>

              </section>

            </>
          )}

        </div>

        <button
          type="button"
          onClick={openPurchaseModal}
          className="fixed bottom-[76px] right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-2xl text-white shadow-[0_10px_30px_rgba(17,24,39,0.25)] active:scale-95 sm:right-[calc(50%-220px)]"
          aria-label="Protect purchase"
        >
          +
        </button>

        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/[0.06] bg-white/95 backdrop-blur-xl sm:left-1/2 sm:w-[480px] sm:-translate-x-1/2">

          <div className="mx-auto grid h-[68px] max-w-[480px] grid-cols-4 px-3">

            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span
                className={
                  'flex h-8 w-8 items-center justify-center rounded-xl text-[17px] ' +
                  (activeTab === 'home'
                    ? 'bg-[#111827] text-white'
                    : 'text-gray-400')
                }
              >
                🏠
              </span>
              <span
                className={
                  'text-[8px] font-bold ' +
                  (activeTab === 'home'
                    ? 'text-[#111827]'
                    : 'text-gray-400')
                }
              >
                Home
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('purchases')}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span
                className={
                  'flex h-8 w-8 items-center justify-center rounded-xl text-[17px] ' +
                  (activeTab === 'purchases'
                    ? 'bg-[#111827] text-white'
                    : 'text-gray-400')
                }
              >
                📦
              </span>
              <span
                className={
                  'text-[8px] font-bold ' +
                  (activeTab === 'purchases'
                    ? 'text-[#111827]'
                    : 'text-gray-400')
                }
              >
                Purchases
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cases')}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span
                className={
                  'relative flex h-8 w-8 items-center justify-center rounded-xl text-[17px] ' +
                  (activeTab === 'cases'
                    ? 'bg-[#111827] text-white'
                    : 'text-gray-400')
                }
              >
                ⚠️
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[7px] font-bold text-white">
                  1
                </span>
              </span>
              <span
                className={
                  'text-[8px] font-bold ' +
                  (activeTab === 'cases'
                    ? 'text-[#111827]'
                    : 'text-gray-400')
                }
              >
                Cases
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="flex flex-col items-center justify-center gap-1"
            >
              <span
                className={
                  'flex h-8 w-8 items-center justify-center rounded-xl text-[17px] ' +
                  (activeTab === 'profile'
                    ? 'bg-[#111827] text-white'
                    : 'text-gray-400')
                }
              >
                👤
              </span>
              <span
                className={
                  'text-[8px] font-bold ' +
                  (activeTab === 'profile'
                    ? 'text-[#111827]'
                    : 'text-gray-400')
                }
              >
                Profile
              </span>
            </button>

          </div>

        </nav>

        {showPurchaseModal && (

          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={closePurchaseModal}
          >

            <div
              className="flex max-h-[94vh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[30px] bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-[28px]"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="shrink-0 border-b border-gray-100 px-5 pb-4 pt-3">

                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white">
                      🛡️
                    </div>

                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-gray-400">
                        Purchase protection
                      </p>
                      <h2 className="text-[17px] font-extrabold tracking-tight">
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

                    <div>
                      <h3 className="text-[14px] font-extrabold">
                        Add your purchase
                      </h3>

                      <p className="mt-1 text-[10px] leading-5 text-gray-400">
                        Protect it in seconds using an invoice or manual entry.
                      </p>
                    </div>

                    <div className="mt-5 space-y-3">

                      <button
                        type="button"
                        onClick={() =>
                          setPurchaseMethod('invoice')
                        }
                        className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left active:scale-[0.99]"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                          📄
                        </div>

                        <div className="flex-1">
                          <p className="text-[12px] font-extrabold">
                            Upload invoice
                          </p>
                          <p className="mt-1 text-[9px] leading-4 text-gray-500">
                            Add a PDF, JPG or PNG invoice.
                          </p>
                        </div>

                        <span className="text-gray-300">
                          →
                        </span>

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPurchaseMethod('manual')
                        }
                        className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left active:scale-[0.99]"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl">
                          ✍️
                        </div>

                        <div className="flex-1">
                          <p className="text-[12px] font-extrabold">
                            Add manually
                          </p>
                          <p className="mt-1 text-[9px] leading-4 text-gray-500">
                            Enter product and protection details.
                          </p>
                        </div>

                        <span className="text-gray-300">
                          →
                        </span>

                      </button>

                    </div>

                    <div className="mt-5 flex justify-center gap-3 text-[8px] font-medium text-gray-400">
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
                      className="mb-4 text-[10px] font-bold text-gray-400"
                    >
                      ← Back
                    </button>

                    <h3 className="text-[15px] font-extrabold">
                      Upload your invoice
                    </h3>

                    <p className="mt-1 text-[10px] text-gray-500">
                      PDF, JPG or PNG
                    </p>

                    <label className="mt-5 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-5 text-center">

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

                          <p className="mt-2 max-w-full truncate text-[11px] font-extrabold">
                            {invoice.name}
                          </p>

                          <p className="mt-1 text-[9px] font-bold text-emerald-600">
                            ✓ Invoice selected
                          </p>

                          <p className="mt-1 text-[8px] text-gray-400">
                            Tap to replace
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                            ☁️
                          </div>

                          <p className="mt-3 text-[12px] font-extrabold">
                            Tap to upload
                          </p>

                          <p className="mt-1 text-[9px] text-gray-400">
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
                        className="mt-4 w-full rounded-xl bg-[#111827] py-3.5 text-[11px] font-extrabold text-white"
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
                      className="mb-4 text-[10px] font-bold text-gray-400"
                    >
                      ← Back
                    </button>

                    <div className="mb-5">
                      <h3 className="text-[15px] font-extrabold">
                        Add purchase details
                      </h3>

                      <p className="mt-1 text-[10px] text-gray-500">
                        Enter the basic information to protect it.
                      </p>
                    </div>

                    <div className="space-y-3">

                      <div>

                        <label className="mb-1.5 block text-[8px] font-extrabold tracking-wide text-gray-500">
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
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-[11px] outline-none focus:border-gray-900 focus:bg-white"
                        />

                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div>

                          <label className="mb-1.5 block text-[8px] font-extrabold tracking-wide text-gray-500">
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
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[10px] outline-none focus:border-gray-900 focus:bg-white"
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

                          <label className="mb-1.5 block text-[8px] font-extrabold tracking-wide text-gray-500">
                            PRICE
                          </label>

                          <div className="relative">

                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
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
                              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-7 pr-3 text-[10px] outline-none focus:border-gray-900 focus:bg-white"
                            />

                          </div>

                        </div>

                      </div>

                      <div>

                        <label className="mb-1.5 block text-[8px] font-extrabold tracking-wide text-gray-500">
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
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[10px] outline-none focus:border-gray-900 focus:bg-white"
                        />

                      </div>

                      <div>

                        <label className="mb-1.5 block text-[8px] font-extrabold tracking-wide text-gray-500">
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
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-[10px] outline-none focus:border-gray-900 focus:bg-white"
                        />

                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div>

                          <label className="mb-1.5 block text-[8px] font-extrabold tracking-wide text-gray-500">
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
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[10px] outline-none focus:border-gray-900 focus:bg-white"
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

                          <label className="mb-1.5 block text-[8px] font-extrabold tracking-wide text-gray-500">
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
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[10px] outline-none focus:border-gray-900 focus:bg-white"
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
                      <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-[9px] font-semibold text-red-600">
                        {error}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={savePurchase}
                      className="mt-4 w-full rounded-xl bg-[#111827] py-3.5 text-[11px] font-extrabold text-white shadow-lg"
                    >
                      Protect this purchase →
                    </button>

                  </>
                )}

              </div>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}
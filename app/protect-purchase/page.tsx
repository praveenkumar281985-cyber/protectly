"use client";

import { useRef, useState } from "react";

export default function ProtectPurchasePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [invoice, setInvoice] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    price: "",
    purchaseDate: "",
    seller: "",
    warranty: "1 Year",
    returnWindow: "7 Days",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleInvoiceChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setInvoice(file);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setSaving(false);

    alert("Purchase protected successfully!");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-xl items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl"
          >
            ←
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Protect a Purchase
            </h1>

            <p className="text-xs text-slate-500">
              Save your purchase & protect your rights
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-xl px-4 pb-32 pt-5">
        <section className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl">
              🛡️
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Protect this purchase
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-600">
                Add your purchase details and invoice. Protectly will help
                you track returns, warranty and future complaints.
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-slate-900">
              Purchase details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Product name
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    updateField("name", e.target.value)
                  }
                  placeholder="e.g. Samsung Smart TV"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    updateField("category", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>Electronics</option>
                  <option>Appliances</option>
                  <option>Mobile</option>
                  <option>Furniture</option>
                  <option>Fashion</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Purchase price
                </label>

                <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                  <span className="flex items-center bg-slate-50 px-4 text-sm font-semibold text-slate-600">
                    ₹
                  </span>

                  <input
                    required
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      updateField("price", e.target.value)
                    }
                    placeholder="45999"
                    className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Purchase date
                </label>

                <input
                  required
                  type="date"
                  value={form.purchaseDate}
                  onChange={(e) =>
                    updateField("purchaseDate", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Seller / Store
                </label>

                <input
                  value={form.seller}
                  onChange={(e) =>
                    updateField("seller", e.target.value)
                  }
                  placeholder="e.g. Amazon, Flipkart, Croma"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-slate-900">
              Protection details
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Warranty
                </label>

                <select
                  value={form.warranty}
                  onChange={(e) =>
                    updateField("warranty", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option>No warranty</option>
                  <option>6 Months</option>
                  <option>1 Year</option>
                  <option>2 Years</option>
                  <option>3 Years</option>
                  <option>5 Years</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Return window
                </label>

                <select
                  value={form.returnWindow}
                  onChange={(e) =>
                    updateField("returnWindow", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option>No return</option>
                  <option>3 Days</option>
                  <option>7 Days</option>
                  <option>10 Days</option>
                  <option>14 Days</option>
                  <option>30 Days</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Invoice / Receipt
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload your invoice, bill or receipt for future claims.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleInvoiceChange}
              className="hidden"
            />

            {!invoice ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 px-4 py-7 text-center"
              >
                <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  📄
                </span>

                <span className="font-semibold text-indigo-700">
                  Upload invoice
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  PDF, JPG, PNG up to 10MB
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-xl">
                  📄
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {invoice.name}
                  </p>

                  <p className="mt-0.5 text-xs text-emerald-700">
                    Invoice selected
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setInvoice(null);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </section>

          <div className="flex gap-3 rounded-xl bg-slate-100 p-3">
            <span className="text-lg">🔒</span>

            <p className="text-xs leading-5 text-slate-600">
              Your purchase information is stored securely. You can use
              these details later for returns, warranty claims and
              complaints.
            </p>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white p-3">
            <div className="mx-auto max-w-xl">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-60"
              >
                {saving
                  ? "Protecting purchase..."
                  : "🛡️ Protect this purchase"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
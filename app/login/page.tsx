```tsx
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setLoading(false);
      setError(loginError.message);
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#101828]">
      <div className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {/* BRAND */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111827] text-xl text-white shadow-lg">
                🛡️
              </div>

              <div className="text-left">
                <div className="text-lg font-bold tracking-tight">
                  Protectly
                </div>

                <div className="text-[9px] font-bold tracking-[0.16em] text-gray-400">
                  CONSUMER PROTECTION
                </div>
              </div>
            </Link>
          </div>

          {/* CARD */}
          <div className="rounded-[32px] border border-black/[0.05] bg-white p-6 shadow-xl shadow-black/[0.04] sm:p-8">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                Welcome back
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
                Sign in to Protectly
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Access your purchases, warranties, documents and consumer
                cases.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold text-gray-500"
                >
                  EMAIL ADDRESS
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold text-gray-500"
                  >
                    PASSWORD
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setError(
                        'Password reset will be connected in the next authentication step.'
                      );
                    }}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-900"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-20 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1 text-xs font-semibold text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600">
                  {error}
                </div>
              )}

              {/* LOGIN */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#111827] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in →'}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                New to Protectly?
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* SIGNUP */}
            <Link
              href="/signup"
              className="flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Create an account
            </Link>
          </div>

          {/* TRUST */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-gray-400">
            <span>🔒 Secure authentication</span>
            <span>📄 Private documents</span>
            <span>🛡️ Consumer protection</span>
          </div>
        </div>
      </div>
    </main>
  );
}
```

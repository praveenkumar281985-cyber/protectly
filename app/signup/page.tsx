'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccess('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError('Please enter your name.');
      return;
    }

    if (!cleanEmail) {
      setError('Please enter your email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      // If email confirmation is enabled, Supabase normally returns
      // a user without an active session until the email is verified.
      if (data.user && !data.session) {
        setSuccess(
          'Account created. Please check your email and click the confirmation link to continue.'
        );
        return;
      }

      // If email confirmation is disabled, the user can be signed in immediately.
      if (data.session) {
        setSuccess('Account created successfully. Opening Protectly...');

        setTimeout(() => {
          router.replace('/');
          router.refresh();
        }, 700);

        return;
      }

      setSuccess(
        'Account created successfully. Please check your email to continue.'
      );
    } catch (signupError) {
      console.error(signupError);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-5 py-10 text-[#101828]">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center justify-center">
        <div className="w-full rounded-[32px] border border-black/[0.06] bg-white p-7 shadow-xl sm:p-9">
          {/* BRAND */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] text-2xl text-white shadow-lg">
              🛡️
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
              Protectly
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Start protecting your purchases, warranties and documents.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-500">
                FULL NAME
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                disabled={loading}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-gray-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-500">
                EMAIL
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-gray-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-500">
                PASSWORD
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-gray-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-500">
                CONFIRM PASSWORD
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-gray-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium leading-5 text-emerald-700">
                {success}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#111827] px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          {/* LOGIN */}
          <div className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-gray-900 hover:underline"
            >
              Sign in
            </Link>
          </div>

          {/* TRUST */}
          <div className="mt-6 flex justify-center gap-4 text-[11px] text-gray-400">
            <span>🔒 Secure</span>
            <span>•</span>
            <span>🛡️ Private</span>
            <span>•</span>
            <span>📄 Protected</span>
          </div>
        </div>
      </div>
    </main>
  );
}
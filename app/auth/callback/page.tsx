'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Completing your sign in...');

  useEffect(() => {
    let mounted = true;

    async function handleAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setMessage('Account verified. Opening Protectly...');
        router.replace('/');
        router.refresh();
      } else {
        setMessage('Your confirmation link has expired or is invalid.');
      }
    }

    handleAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-5">
      <div className="w-full max-w-md rounded-[32px] border border-black/[0.06] bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] text-2xl text-white">
          🛡️
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Protectly
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {message}
        </p>
      </div>
    </main>
  );
}
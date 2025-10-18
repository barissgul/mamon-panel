'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Title } from 'rizzui/typography';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/giris');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Title>Yükleniyor...</Title>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Title>Dashboard - Hoş Geldiniz</Title>
      <div className="mt-4">
        <p>Giriş yapıldı! Burası dashboard sayfanız olacak.</p>
      </div>
    </>
  );
}


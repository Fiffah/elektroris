"use client";

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  // Fungsi untuk navigasi ke halaman admin
  const goToAdmin = () => {
    router.push('/admin');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <p className="text-lg mb-4">Selamat datang di Toko Elektroris!</p>
      <button
        onClick={goToAdmin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Go to Admin Page
      </button>
    </div>
  );
}

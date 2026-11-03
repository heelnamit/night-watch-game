'use client';
import Link from 'next/link';

export default function GameHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-accent/50">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-white">NIGHT WATCH</h1>
        <p className="text-xs text-gray-400">BLACKWOOD APARTMENTS</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-xs text-cctv-green">
          <span className="w-2 h-2 rounded-full bg-cctv-green animate-pulse"></span>
          SYSTEM ONLINE
        </span>
        <span className="font-mono text-sm text-gray-300">12:00 AM</span>
      </div>
      <Link href="/" className="px-4 py-2 bg-warning text-white font-bold text-xs uppercase hover:bg-red-900 transition-colors">
        Exit Shift
      </Link>
    </header>
  );
}

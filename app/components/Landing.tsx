"use client";

import CreateSecureChat from "./CreateSecureChat";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Soft gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('/noise.png')]" />

      {/* Content */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Header */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-widest uppercase">
          <span className="block text-emerald-400">GHOSTROOM</span>
          <span className="block text-slate-100">Self-Destruct Chat</span>
        </h1>

        <p className="mt-6 max-w-xl text-sm md:text-base text-slate-400 leading-relaxed">
          Messages that vanish forever. No history. No recovery. Zero trust.
          <span className="block mt-2 text-cyan-400">
            Once destroyed — it never existed.
          </span>
        </p>

        {/* CTA */}
        <div className="mt-10 flex gap-4">
          <CreateSecureChat />
        </div>

        {/* Terminal box */}
        <div className="mt-14 w-full max-w-2xl rounded-lg bg-slate-900/80 border border-slate-700 shadow-lg backdrop-blur p-5 text-left font-mono text-sm">
          <p className="text-emerald-400">$ initializing secure session…</p>
          <p className="text-cyan-400">$ generating ephemeral keys</p>
          <p className="text-cyan-400">$ enabling self-destruct protocol</p>
          <p className="text-emerald-300 animate-pulse">$ ready █</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-xs text-slate-500 tracking-wide">
        no logs • no tracking • no mercy for data
      </footer>
    </main>
  );
}

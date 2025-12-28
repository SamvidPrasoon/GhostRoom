import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-slate-200 px-6">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

      <div className="relative z-10 text-center space-y-6 max-w-lg">
        <p className="text-xs tracking-widest text-red-400 uppercase">
          Signal Lost
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
          Room Not Found
        </h1>

        <p className="text-slate-400 leading-relaxed">
          This secure room may have{" "}
          <span className="text-red-400">self-destructed</span>, expired, or
          never existed.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-2 rounded
                     border border-cyan-400 text-cyan-400
                     hover:bg-cyan-400 hover:text-black transition font-semibold"
        >
          Return to Terminal
        </Link>
      </div>
    </div>
  );
}

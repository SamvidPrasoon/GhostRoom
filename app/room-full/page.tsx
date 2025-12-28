import Link from "next/link";

export default function RoomFullPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center font-mono text-slate-200 px-6">
      {/* Soft red glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-500/5 pointer-events-none" />

      <div className="relative z-10 text-center space-y-6 max-w-lg">
        <p className="text-xs tracking-widest text-red-400 uppercase">
          Access Denied
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-red-500">
          Room is Full
        </h1>

        <p className="text-slate-400 leading-relaxed">
          This secure channel allows only{" "}
          <span className="text-red-400">two participants</span>. No additional
          connections are permitted.
        </p>

        <div className="flex justify-center gap-4 mt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2 rounded border border-red-400 text-red-400 font-semibold hover:bg-red-500 hover:text-black transition"
          >
            Exit
          </Link>

          <Link
            href="/create"
            className="inline-flex items-center justify-center px-6 py-2 rounded border border-red-400 text-red-400 font-semibold hover:bg-red-500 hover:text-black transition"
          >
            Create New Room
          </Link>
        </div>
      </div>
    </div>
  );
}

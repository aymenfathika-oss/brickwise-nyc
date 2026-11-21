import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-2 border-ink px-6 py-4 flex items-center justify-between bg-paper">
      <Link href="/" className="flex items-center gap-2.5 group">
        <span className="font-mono text-xs font-bold border-2 border-ink bg-ink text-paper px-1.5 py-0.5 -rotate-3 group-hover:rotate-0 transition-transform">
          BBL
        </span>
        <span className="font-display font-bold text-xl tracking-tight">Brickwise</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm font-semibold uppercase tracking-wide">
        <Link href="/" className="hover:text-stamp transition-colors">
          Search
        </Link>
        <Link href="/saved" className="hover:text-stamp transition-colors">
          Saved
        </Link>
      </nav>
    </header>
  );
}

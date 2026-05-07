export default function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0f0f0f]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo placeholder */}
        <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse shrink-0" />
        {/* Nav placeholders — desktop only */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
          <div className="h-8 w-20 rounded-full bg-white/10 animate-pulse" />
        </div>
        {/* Hamburger placeholder — mobile only */}
        <div className="md:hidden ml-auto w-8 h-6 rounded bg-white/10 animate-pulse" />
      </div>
    </header>
  );
}

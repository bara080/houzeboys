export default function HeroSkeleton() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 w-full grid md:grid-cols-2 gap-12 items-center">
      {/* Left column skeleton */}
      <div className="space-y-6">
        <div className="h-24 w-72 md:w-96 bg-white/10 rounded-xl animate-pulse" />
        <div className="h-8 w-56 bg-white/10 rounded-lg animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full max-w-md bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-4/5 max-w-md bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-3/5 max-w-md bg-white/10 rounded animate-pulse" />
        </div>
        <div className="flex space-x-6 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-5 h-5 bg-white/10 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Right column — form card skeleton */}
      <div className="bg-white/[0.03] border border-white/10 p-8 md:p-10 rounded-3xl space-y-5">
        <div className="h-6 w-44 bg-white/10 rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-full bg-white/10 rounded-xl animate-pulse" />
          </div>
        ))}
        <div className="h-14 w-full bg-white/20 rounded-xl animate-pulse" />
        <div className="h-3 w-64 mx-auto bg-white/10 rounded animate-pulse" />
      </div>
    </section>
  );
}

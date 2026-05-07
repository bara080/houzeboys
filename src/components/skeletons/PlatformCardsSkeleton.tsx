export default function PlatformCardsSkeleton() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 w-full">
      <div className="h-3 w-28 mx-auto bg-white/10 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl flex items-center space-x-4"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

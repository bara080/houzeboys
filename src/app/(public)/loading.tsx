import HeaderSkeleton from "@/components/skeletons/HeaderSkeleton";
import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import PlatformCardsSkeleton from "@/components/skeletons/PlatformCardsSkeleton";

export default function Loading() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeaderSkeleton />
      <HeroSkeleton />
      <PlatformCardsSkeleton />
      <footer className="py-10 text-center border-t border-white/5 mt-auto">
        <div className="h-3 w-64 mx-auto bg-white/10 rounded animate-pulse" />
      </footer>
    </main>
  );
}

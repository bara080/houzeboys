import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PlatformCards from "@/components/PlatformCards";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <HeroSection />
      <PlatformCards />
      <Footer />
    </main>
  );
}

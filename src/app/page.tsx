import Header from "@/components/sections/Header";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import NetworksSection from "@/components/sections/NetworksSection";
import FeaturedServicesSection from "@/components/sections/FeaturedServicesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";
import CtaBanner from "@/components/sections/CtaBanner";
import Footer from "@/components/sections/Footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />
            <HeroSection />
            <StatsSection />
            <NetworksSection />
            <FeaturedServicesSection />
            <HowItWorksSection />
            <WhyUsSection />
            <TestimonialsSection />
            <FaqSection />
            <CtaBanner />
            <Footer />
        </main>
    );
}

import Hero from "./components/Hero";
import StatsAndTestimonial from "./components/Testimonial";
import PricingAndHighlights from "./components/PricingAndHighlights";
import PartnersSection from "./components/PartnersSection";
import SubscribeBar from "./components/SubscribeBar";

type Props = { onSignup?: () => void };

export default function KidemiaLandingPage({ onSignup }: Props) {
  return (
    <div className="font-sans antialiased text-gray-800 bg-white">
      <main className="w-full">
        <Hero onSignup={onSignup} />

        <StatsAndTestimonial />



        <PartnersSection />

        <SubscribeBar />
      </main>
    </div>
  );
}

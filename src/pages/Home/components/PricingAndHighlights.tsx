import PricingCard from "./PricingCard";
import { PricingBG } from "../../../assets/images";

export default function PricingAndHighlights() {
  return (
    <section className="relative bg-[#0a1f35] text-white py-16 overflow-hidden">
      <img
        src={PricingBG}
        alt="Pricing Background"
        className="pointer-events-none select-none absolute"
        style={{
          width: "1458.155px",
          height: "1822.694px",
          top: "-847px",
          left: "-385px",
          opacity: 0.1,
          transform: "rotate(48.09deg)",
        }}
      />
      <div className="absolute inset-0 bg-[#08192d]/90" />
      <div className="relative max-w-6xl mx-auto px-6">
        <h3 className="text-center text-3xl md:text-4xl font-bold mb-3">
          Pricing
        </h3>

        <p className="text-center text-sm md:text-base opacity-80 mb-12">
          Flexible pricing plans for students, siblings and families
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <PricingCard
            title="Student"
            features={[
              "Unlimited Subjects",
              "10 Tests per Month",
              "One-time leaderboard access",
            ]}
          />
          <PricingCard
            title="Sibling"
            features={[
              "Unlimited Subjects",
              "Unlimited Tests per Month",
              "One-time leaderboard access",
            ]}
          />
          <PricingCard
            title="Family"
            features={[
              "Unlimited Subjects",
              "Unlimited Tests per Month",
              "Unlimited leaderboard access",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

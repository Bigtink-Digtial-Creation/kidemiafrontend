import { offersData } from "../../staticData/home";
import OfferCard from "../Cards/OfferCard";

export default function Offer() {
  return (
    <div className="mx-auto py-8 md:py-12 px-4 md:px-24 bg-kidemia-biege2">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-center text-kidemia-black">
          What We Offer
        </h3>
        <p className="text-kidemia-grey/60 text-base text-center">
          From Live Tests to Insighful Analytics, Kidemia offers you a suite of
          resources required to excel academically
        </p>
      </div>

      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offersData.map((offer) => (
            <OfferCard
              key={offer.title}
              title={offer.title}
              description={offer.description}
              icon={offer.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

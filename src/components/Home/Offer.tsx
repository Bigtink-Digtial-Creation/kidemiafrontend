import { offersData } from "../../staticData/home";
import OfferCard from "../Cards/OfferCard";

export default function Offer() {
  return (
    <div className="mx-auto py-8 md:py-12 px-4 md:px-24 bg-kidemia-biege2">
      <div>
        <h3 className="text-2xl font-bold  text-kidemia-black">
          What We Offer
        </h3>
      </div>

      <div className="pt-8">
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

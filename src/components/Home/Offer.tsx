import { offersData } from "../../staticData/home";
import OfferCard from "../Cards/OfferCard";

export default function Offer() {
  return (
    <div className="mx-auto py-8 md:py-12 px-4 md:px-24 bg-kidemia-biege2">
      <div className="flex flex-col justify-center items-center space-y-3">
        <div className="bg-kidemia-white shadow-2xl text-kidemia-black border-kidemia-success border-[1px] inline-block px-4 py-1 rounded-full text-sm font-semibold">
          What We Offer
        </div>
        <h3 className="text-2xl md:text-4xl font-bold text-center text-kidemia-grey/60 tracking-wider max-w-2xl">
          From Live Tests to Insighful Analytics,{" "}
          <span className="text-kidemia-primary underline">Kidemia</span> offers
          you a suite of resources required to excel academically
        </h3>
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

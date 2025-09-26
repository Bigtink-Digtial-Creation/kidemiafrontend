import type { IconType } from "react-icons";

interface OfferCardI {
  icon: IconType;
  title: string;
  description: string;
}

export default function OfferCard({ icon, title, description }: OfferCardI) {
  const IconComponent = icon;
  return (
    <div className="w-full py-8 px-6 space-y-3 shadow rounded-2xl bg-kidemia-biege/25">
      <div className="w-14 h-14 rounded-full shadow-sm flex justify-center items-center bg-kidemia-biege aspect-square">
        <IconComponent className="text-2xl text-kidemia-primary font-bold" />
      </div>

      <div className="space-y-2.5">
        <h4 className="text-lg font-semibold text-kidemia-black3">{title}</h4>
        <p className="text-sm text-kidemia-grey tracking-wide">{description}</p>
      </div>
    </div>
  );
}

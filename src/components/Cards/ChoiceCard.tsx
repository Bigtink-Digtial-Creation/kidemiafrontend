interface ChoiceCardI {
  id: string;
  title: string;
  description: string;
}

export default function ChoiceCard({ id, title, description }: ChoiceCardI) {
  return (
    <div className="w-full py-8 px-6 space-y-3 hover:shadow rounded-2xl">
      <div className="w-14 h-14 rounded-full shadow-sm flex justify-center items-center bg-kidemia-biege aspect-square">
        <h3 className="text-2xl text-kidemia-primary font-bold">{id}</h3>
      </div>
      <div className="space-y-2.5">
        <h4 className="text-lg font-semibold text-kidemia-black3">{title}</h4>
        <p className="text-sm text-kidemia-grey tracking-wide">{description}</p>
      </div>
    </div>
  );
}

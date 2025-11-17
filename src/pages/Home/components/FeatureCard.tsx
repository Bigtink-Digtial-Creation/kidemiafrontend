interface FeatureCardProps {
  icon: string;
  title: string;
  subtitle: string;
}

export default function FeatureCard({
  icon,
  title,
  subtitle,
}: FeatureCardProps) {
  return (
    <div className="bg-kidemia-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
      <div className="mb-3">
        <img src={icon} alt={title} className="w-10 h-10 object-contain" />
      </div>
      <h4 className="font-bold text-base text-[#0a1f35]">{title}</h4>
      <p className="mt-2 text-xs text-gray-600 leading-relaxed">{subtitle}</p>
    </div>
  );
}

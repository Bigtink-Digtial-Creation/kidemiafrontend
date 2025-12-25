import {
  hero,
  ChartIcon,
  GameIcon,
  VRIcon,
  ProIcon,
} from "../../../assets/images";
import FeatureCard from "./FeatureCard";
import { AuthRoutes } from "../../../routes";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";


export default function Hero({ onSignup }: { onSignup?: () => void }) {
  return (
    <section className="relative bg-[#ea7f33] overflow-hidden pt-16 md:pt-20">
      <div className="relative max-w-6xl mx-auto px-6">

        <div className="relative min-h-[320px] py-3 md:min-h-0 flex items-start">

          <div className="absolute inset-y-0 right-[-140px] md:hidden z-10 pointer-events-none">
            <img
              src={hero}
              alt="Student"
              className="h-full w-auto scale-110 object-cover"
            />
          </div>

          <div className="absolute inset-y-0 left-0 right-0 md:hidden z-15 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F28729]/100 via-[#F28729]/100 to-transparent backdrop-blur-[1px]" />
          </div>

          <div className="relative z-20 w-full md:w-1/2 text-white pt-12 md:pt-4 text-left px-4 md:px-6 md:text-left">
            <h1 className="text-[42px] md:text-5xl lg:text-[52px] font-bold leading-[1.15]">
              Smart Learning Starts Here
            </h1>

            <p className="mt-4  text-base md:text-lg opacity-90 max-w-[280px] md:max-w-md">
              Empowering Nigerian kids with engaging, personalized education
            </p>

            <div className="mt-6 flex">
              <Link
                to={AuthRoutes.signup}
                onClick={() => onSignup?.()}
                className="w-full md:w-auto px-10 py-3.5 rounded-lg md:rounded-md
                      bg-[#1e88a8] text-white font-semibold text-base inline-flex items-center gap-3
                      justify-center md:justify-start whitespace-nowrap hover:bg-[#1a7591]
                      transition">
                <span>Start Learning</span>
                <ArrowRight className="hidden md:block w-5 h-5 shrink-0" />
              </Link>
            </div>

          </div>

          {/* Desktop image - positioned on right */}
          <div className="hidden md:flex absolute right-0 top-0 h-full items-start z-10">
            <img
              src={hero}
              alt="Student"
              className="h-auto w-auto object-contain"
            />
          </div>
        </div>

        {/* DESKTOP FEATURES */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mt-12 pb-10 relative z-20">
          <FeatureCard
            icon={ProIcon}
            title="Kidemia Pro"
            subtitle="Unlock exclusive content and tools for accelerated learning"
          />
          <FeatureCard
            icon={GameIcon}
            title="Gamified Learning"
            subtitle="Fun challenges and rewards to make learning enjoyable"
          />
          <FeatureCard
            icon={VRIcon}
            title="Immersive AR/VR"
            subtitle="Explore subjects in 3D with augmented and virtual reality"
          />
          <FeatureCard
            icon={ChartIcon}
            title="Exam Analytics"
            subtitle="Track your progress with performance insights"
          />
        </div>

        {/* MOBILE FEATURES */}
        <div className="lg:hidden grid grid-cols-2 gap-4 pb-10 px-4 relative z-20">
          <FeatureCard
            icon={ProIcon}
            title="Kidemia Pro"
            subtitle="Unlock exclusive content and tools for accelerated learning"
          />
          <FeatureCard
            icon={GameIcon}
            title="Gamified Learning"
            subtitle="Fun challenges and rewards to make learning enjoyable"
          />
          <FeatureCard
            icon={VRIcon}
            title="Immersive AR/VR"
            subtitle="Explore subjects in 3D with augmented/virtual reality"
          />
          <FeatureCard
            icon={ChartIcon}
            title="Exam Analytics"
            subtitle="Track your progress with performance insights"
          />
        </div>
      </div>
    </section>
  );
}
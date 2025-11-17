import { FaLongArrowAltRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
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

export default function Hero({ onSignup }: { onSignup?: () => void }) {
  return (
    <section className="relative bg-[#ea7f33] overflow-visible pt-20 pb-0">
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-0 md:pt-10 relative">
        <div className="flex flex-col-reverse md:flex-row items-start gap-8 md:gap-12 relative">
          {/* LEFT SIDE - Text Content */}
          <div className="w-full md:w-1/2 text-white z-20 pb-8 md:pb-16 flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl lg:text-[52px] font-bold leading-tight">
              Smart Learning
              <br />
              Starts Here
            </h1>

            <p className="mt-5 text-base md:text-lg opacity-90 leading-relaxed">
              Empowering Nigerian kids with engaging, personalized education.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={AuthRoutes.signup}>
                <button
                  onClick={() => onSignup?.()}
                  className="px-16 py-3 rounded-md bg-[#1e88a8] text-white font-semibold flex items-center gap-3 hover:bg-[#1a7591] transition"
                >
                  Start Learning <FaLongArrowAltRight />
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-end relative md:absolute md:right-0 md:top-0 md:bottom-[-120px]">
            <div className="hidden md:block w-[380px] lg:w-[460px] relative z-10">
              <img
                src={hero}
                alt="Student"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* MOBILE - Girl on right side, partially clipped */}
            <div className="hidden md:hidden absolute right-[-40px] top-[-60px] w-[280px] h-[400px] z-10 overflow-hidden">
              <img
                src={hero}
                alt="Student"
                className="w-full h-full object-cover object-left-top"
                style={{ objectPosition: "left left" }}
              />
            </div>
          </div>
        </div>

        {/* FEATURE CARDS — Desktop only, positioned at bottom */}
        <div className="hidden lg:grid grid-cols-4 gap-4 relative z-20 pb-8 mt-8">
          <FeatureCard
            icon={ProIcon}
            title="Kidemia Pro"
            subtitle="Unlock practice content and tools for accelerated learning"
          />
          <FeatureCard
            icon={GameIcon}
            title="Gamified Learning"
            subtitle="Fun challenges and rewards to motivate learners"
          />
          <FeatureCard
            icon={VRIcon}
            title="Immersive AR/VR"
            subtitle="Bring subjects to life with interactive experiences"
          />
          <FeatureCard
            icon={ChartIcon}
            title="Exam Analytics"
            subtitle="Track progress with performance insights"
          />
        </div>
      </div>

      {/* Mobile/Tablet feature cards carousel */}
      <div className="lg:hidden px-6 pb-8 mt-6 relative z-20">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1.2}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
        >
          <SwiperSlide>
            <FeatureCard
              icon={ProIcon}
              title="Kidemia Pro"
              subtitle="Unlock practice content"
            />
          </SwiperSlide>
          <SwiperSlide>
            <FeatureCard
              icon={GameIcon}
              title="Gamified Learning"
              subtitle="Fun challenges"
            />
          </SwiperSlide>
          <SwiperSlide>
            <FeatureCard
              icon={VRIcon}
              title="Immersive AR/VR"
              subtitle="Interactive experiences"
            />
          </SwiperSlide>
          <SwiperSlide>
            <FeatureCard
              icon={ChartIcon}
              title="Exam Analytics"
              subtitle="Performance insights"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}

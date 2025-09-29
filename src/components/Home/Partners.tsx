import { Image } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { schoolLogos } from "../../staticData/home";

export default function Partners() {
  return (
    <div className="mx-auto py-8 md:py-16 px-4 md:px-24 bg-kidemia-biege2">
      <div className="flex flex-col justify-center items-center space-y-3">
        <div className="bg-kidemia-white shadow-2xl text-kidemia-black border-kidemia-success border-[1px] inline-block px-4 py-1 rounded-full text-sm font-semibold">
          Our Partners
        </div>
        <h3 className="text-2xl md:text-4xl font-bold text-center text-kidemia-grey/60 tracking-wider max-w-2xl">
          Partnering Educational Institutions
        </h3>
      </div>
      <div className="py-12">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={1500}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {schoolLogos.map((school) => (
            <SwiperSlide key={school.id}>
              <div className="relative flex justify-center items-center h-64 w-[350px] lg:w-[300px]">
                <Image
                  src={school.src}
                  alt="parnters"
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

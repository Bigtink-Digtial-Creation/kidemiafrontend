import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import AppImage from "../../../components/AppImage";
import { partners } from "../../../staticData/partners";

export default function PartnersSection() {
  return (
    <section id="partners" className="py-16 bg-[#0a1f35] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Partnering Institutions
          </h3>
        </div>

        <div className="mt-8">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            loop
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
          >
            {partners.map((partner, index) => (
              <SwiperSlide
                key={index}
                className="flex items-center justify-center p-4"
              >
                <AppImage
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 object-contain opacity-70 hover:opacity-100 transition"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

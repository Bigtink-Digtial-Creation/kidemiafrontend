import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function StatsAndTestimonial() {
  const testimonials = [
    {
      text: "My child has not only met my expectations for learning, but has far exceeded them!",
      author: "Parent",
    },
    {
      text: "The interactive lessons keep my kids engaged and excited about learning every day!",
      author: "Parent",
    },
    {
      text: "Kidemia has transformed how my children approach their studies. Highly recommended!",
      author: "Parent",
    },
  ];

  return (
    <section className="bg-[#0a1f35] text-white py-12 md:py-16 relative z-30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 items-start">
          {/* Stat 1 */}
          <div className="text-center md:text-left">
            <div className="text-4xl md:text-5xl font-bold">1,000+</div>
            <div className="mt-2 text-sm md:text-base opacity-80">
              Program Sessions
            </div>
          </div>

          {/* Stat 2 */}
          <div className="text-center md:text-left">
            <div className="text-4xl md:text-5xl font-bold">95%</div>
            <div className="mt-2 text-sm md:text-base opacity-80">
              Registered Success
            </div>
          </div>

          {/* Testimonial Carousel */}
          <div className="col-span-2 md:col-span-1">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              loop
              autoplay={{ delay: 4000, disableOnInteraction: false }}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="backdrop-blur-sm rounded-xl p-6 ">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                        👤
                      </div>
                      <div className="flex-1">
                        <p className="text-sm md:text-base leading-relaxed italic">
                          "{t.text}"
                        </p>
                        <p className="mt-2 text-xs opacity-70">— {t.author}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

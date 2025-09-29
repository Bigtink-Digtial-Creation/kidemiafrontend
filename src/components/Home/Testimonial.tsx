import { motion } from "framer-motion";
import { testimonials } from "../../staticData/home";
import TestimonialCard from "../Cards/TestimonialCard";

export default function Testimonial() {
  return (
    <div className="mx-auto py-8 md:py-12 px-4 md:px-24 bg-kidemia-biege2">
      <div className="flex flex-col justify-center items-center space-y-3">
        <div className="bg-kidemia-white shadow-2xl text-kidemia-black border-kidemia-success border-[1px] inline-block px-4 py-1 rounded-full text-sm font-semibold">
          Ratings and Reviews
        </div>
        <h3 className="text-2xl md:text-4xl font-bold text-center text-kidemia-grey/60 tracking-wider max-w-2xl">
          Real Stories. Real People. Real Loft.
        </h3>
      </div>

      <div className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-6"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, index) => (
              <TestimonialCard
                key={t.id}
                name={t.name}
                role={t.role}
                image={t.image}
                text={t.text}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

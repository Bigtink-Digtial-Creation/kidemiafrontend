import { motion, type Variants } from "framer-motion";
import { testimonials } from "../../staticData/home";
import TestimonialCard from "../Cards/TestimonialCard";

export default function Testimonial() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, index) => (
              <motion.div key={t.id} variants={itemVariants}>
                <TestimonialCard
                  name={t.name}
                  role={t.role}
                  image={t.image}
                  text={t.text}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

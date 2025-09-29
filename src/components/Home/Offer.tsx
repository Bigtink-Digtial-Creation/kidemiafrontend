import { motion } from "framer-motion";
import { offersData } from "../../staticData/home";
import OfferCard from "../Cards/OfferCard";
import { containerVariants, itemVariants } from "./homeVariants";

export default function Offer() {
  return (
    <motion.div
      className="mx-auto py-8 md:py-12 px-4 md:px-24 bg-kidemia-biege2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="flex flex-col justify-center items-center space-y-3"
        variants={itemVariants}
      >
        <div className="bg-kidemia-white shadow-2xl text-kidemia-black border-kidemia-success border-[1px] inline-block px-4 py-1 rounded-full text-sm font-semibold">
          What We Offer
        </div>
        <h3 className="text-2xl md:text-4xl font-bold text-center text-kidemia-grey/60 tracking-wider max-w-2xl">
          From Live Tests to Insighful Analytics,{" "}
          <span className="text-kidemia-primary underline">Kidemia</span> offers
          you a suite of resources required to excel academically
        </h3>
      </motion.div>

      <div className="py-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {offersData.map((offer) => (
            <motion.div key={offer.title} variants={itemVariants}>
              <OfferCard
                title={offer.title}
                description={offer.description}
                icon={offer.icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import StatCard from "../../pages/Dashboard/components/StatCard";
import { topSubjects } from "../../staticData/home";
import {
  cardVariants,
  containerPopularVariants,
  headingVariants,
} from "./homeVariants";

export default function PopularSubjects() {
  return (
    <motion.div
      className="mx-auto py-8 md:py-12 px-4 bg-kidemia-biege2"
      variants={containerPopularVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="flex flex-col justify-center items-center space-y-2"
        variants={headingVariants}
      >
        <div className="bg-kidemia-white shadow-2xl text-kidemia-black border-kidemia-success border-[1px] inline-block px-4 py-1 rounded-full text-sm font-semibold">
          Popular Test Subjects
        </div>
        <h3 className="text-2xl md:text-4xl font-bold  text-kidemia-grey/60 text-center tracking-wider max-w-2xl">
          Ace your faves, one subject at a time!
        </h3>
      </motion.div>

      <motion.div
        className="py-8 grid grid-cols-2 md:grid-cols-6 gap-4 md:px-24"
        variants={containerPopularVariants}
      >
        {topSubjects.map((subject) => (
          <motion.div key={subject.id} variants={cardVariants}>
            <StatCard
              icon={subject.icon}
              title={subject.title}
              figure={subject.figure}
              sub="Exams & Tests Taken"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

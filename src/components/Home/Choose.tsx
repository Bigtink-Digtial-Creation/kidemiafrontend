import { motion } from "framer-motion";
import { Image } from "@heroui/react";
import dash from "../../assets/images/general/dash.png";
import ChoiceCard from "../Cards/ChoiceCard";
import { containerVariants, itemVariants } from "./homeVariants";

export default function Choose() {
  return (
    <motion.div
      className="mx-auto py-8 md:py-12 px-4 md:px-24 bg-kidemia-biege/25 space-y-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="flex flex-col justify-center items-center space-y-2"
        variants={itemVariants}
      >
        <div className="bg-kidemia-white shadow-2xl text-kidemia-black border-kidemia-success border-[1px] inline-block px-4 py-1 rounded-full text-sm font-semibold">
          The Right Choice For You
        </div>
        <h3 className="text-2xl md:text-4xl font-bold text-kidemia-grey/60 text-center tracking-wider max-w-2xl">
          High level tests backed with instant results and seamless
          collaboration between students, guardians and tutors
        </h3>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center"
        variants={containerVariants}
      >
        <motion.div className="space-y-6" variants={itemVariants}>
          <ChoiceCard
            id={"01"}
            title={"Instant Results"}
            description={
              "Students no longer have to wait days or weeks to see how they performed. Our platform delivers instant grading and feedback, helping learners quickly identify areas for improvement."
            }
          />
          <ChoiceCard
            id={"02"}
            title={"Seamless Collaboration"}
            description={
              "We bridge the gap between students, guardians, and teachers, ensuring that everyone stays on the same page when it comes to academic progress and performance."
            }
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Image src={dash} className="object-cover" alt="app image" />
          <ChoiceCard
            id={"03"}
            title={"Data-Driven Insights"}
            description={
              "With powerful analytics, both teachers and guardians can track trends, spot weaknesses, and measure growth over time, ensuring informed decision-making."
            }
          />
        </motion.div>

        <motion.div className="space-y-6" variants={itemVariants}>
          <ChoiceCard
            id={"04"}
            title={"Secure & Reliable"}
            description={
              "Built with security in mind, the platform safeguards student data and ensures smooth, uninterrupted access to learning resources anytime, anywhere."
            }
          />
          <ChoiceCard
            id={"05"}
            title={"Personalized Learning Experience"}
            description={
              "Our smart exam engine adapts to student performance, offering challenges that match their level and encouraging steady growth without overwhelming them."
            }
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

import { motion, type Variants } from "framer-motion";
import { Numbers } from "../../components/Home";
import { Button } from "@heroui/react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutUs() {
  return (
    <section className="min-h-screen mx-auto py-24 px-4 md:px-16 space-y-24">
      <motion.div
        className="bg-kidemia-biege/25 py-12 px-4 rounded-3xl flex flex-col justify-center items-center space-y-3"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="bg-kidemia-white shadow-2xl text-kidemia-black border-kidemia-success border-[1px] inline-block px-4 py-1 rounded-full text-sm font-semibold">
          About Us
        </div>

        <h3 className="text-2xl md:text-4xl font-bold text-center text-kidemia-grey/60 max-w-4xl">
          At Kidemia, we're passionate about empowering learners to grow,
          explore, and reach their full potential. Our mission is to make
          learning engaging, accessible, and rewarding for students everywhere.
        </h3>
      </motion.div>

      {/* Who We Are */}
      <motion.div
        className="max-w-5xl mx-auto space-y-6 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-kidemia-black">Who We Are</h2>
        <p className="text-kidemia-grey text-lg leading-relaxed max-w-3xl mx-auto">
          Kidemia is a learning-driven platform dedicated to transforming the
          way students engage with knowledge. We bring together innovative
          tools, expert educators, and an inspiring community to make education
          dynamic, interactive, and fun.
        </p>
      </motion.div>

      {/* Our Story Section */}
      <motion.div
        className="py-16 bg-kidemia-biege/25 rounded-3xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mx-auto px-6 space-y-12">
          <h2 className="text-3xl font-bold text-center text-kidemia-black">
            Our Story
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-kidemia-grey/20">
            {/* History */}
            <div className="px-6 py-8 space-y-3">
              <h3 className="text-lg font-semibold text-kidemia-black">
                History Of The Company
              </h3>
              <p className="text-kidemia-grey text-base leading-relaxed">
                Kidemia started as a small idea — to make learning more
                interactive and accessible. What began as a dream to connect
                knowledge and curiosity has evolved into a thriving ecosystem
                for students, teachers, and lifelong learners.
              </p>
            </div>

            {/* Mission */}
            <div className="px-6 py-8 space-y-3">
              <h3 className="text-lg font-semibold text-kidemia-black">
                Mission
              </h3>
              <p className="text-kidemia-grey text-base leading-relaxed">
                To empower learners with tools and opportunities to succeed,
                inspiring a love for learning through accessible, engaging, and
                personalized education.
              </p>
            </div>

            {/* Values */}
            <div className="px-6 py-8 space-y-3">
              <h3 className="text-lg font-semibold text-kidemia-black">
                Company Values
              </h3>
              <p className="text-kidemia-grey text-base leading-relaxed">
                Innovation, inclusivity, and integrity define us. We believe
                education should be a shared experience that builds curiosity,
                confidence, and community impact.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* What We Do */}
      <motion.div
        className="max-w-5xl py-12 mx-auto text-center space-y-6"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-kidemia-black">What We Do</h2>
        <p className="text-kidemia-grey text-lg leading-relaxed max-w-3xl mx-auto">
          We design interactive learning experiences, from personalized lessons
          to hands-on challenges. Our platform bridges the gap between curiosity
          and understanding, helping learners of all backgrounds unlock their
          potential.
        </p>
      </motion.div>

      {/* Team Section */}
      <motion.div
        className="max-w-6xl mx-auto px-6 space-y-8 py-12"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center text-kidemia-black">
          Meet The Team
        </h2>
        <p className="text-center text-kidemia-grey max-w-3xl mx-auto text-lg">
          Behind Kidemia is a passionate team of educators, designers, and
          developers committed to building the future of learning.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-8">
          {[1, 2, 3, 4, 5, 6].map((member) => (
            <div
              key={member}
              className="bg-kidemia-biege/20 py-12 px-6 rounded-2xl flex flex-col items-center shadow-sm"
            >
              <div className="w-24 h-24 bg-kidemia-grey/20 rounded-full mb-4" />
              <h4 className="font-semibold text-kidemia-black">
                Team Member {member}
              </h4>
              <p className="text-sm text-kidemia-grey">Role / Position</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Our Impact */}
      <motion.div
        className="mx-auto px-6 space-y-4"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center text-kidemia-black">
          Our Impact
        </h2>
        <Numbers />
      </motion.div>

      {/* Join Us */}
      <motion.div
        className="text-center py-16 space-y-4 bg-kidemia-biege/30 rounded-3xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-kidemia-black">
          Join Us On Our Journey
        </h2>
        <p className="text-kidemia-grey max-w-2xl mx-auto text-lg">
          We're always looking for creative minds who believe in the power of
          education. Let's shape the future of learning together.
        </p>

        <Button
          type="submit"
          variant="solid"
          size="lg"
          className="bg-kidemia-secondary text-kidemia-white font-semibold"
          radius="sm"
        >
          Get Involved
        </Button>
      </motion.div>
    </section>
  );
}

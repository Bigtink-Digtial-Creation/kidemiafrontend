import { motion, type Variants } from "framer-motion";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { AuthRoutes } from "../../routes";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Cta() {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="py-12 px-4">
      <motion.div
        className="relative flex flex-col justify-center items-center 
        bg-gradient-to-r from-kidemia-biege/30 via-kidemia-biege/25 to-kidemia-biege/30
        rounded-3xl mx-auto max-w-screen-2xl h-[400px] px-4 md:px-20 py-6 md:py-12 
        gap-8 md:gap-12 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <motion.div
          className="absolute inset-0 bg-kidemia-primary/5 blur-3xl rounded-3xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="space-y-3 py-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-kidemia-black text-base font-medium text-center">
            Join the Kidemia Train of Excellence
          </p>
          <h1 className="text-3xl md:text-5xl text-kidemia-secondary font-semibold text-center">
            Ready to Transform Learning?
          </h1>
          <p className="tracking-wide text-base md:text-lg text-kidemia-grey text-center px-2">
            Sign up today and join a smarter way to teach, learn, and grow.
          </p>

          <div className="py-4 flex justify-center items-center">
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.12 }}
            >
              <Button
                className="bg-kidemia-secondary text-kidemia-white font-bold"
                size="md"
                radius="sm"
                type="button"
                onPress={() => navigate(AuthRoutes.signup)}
                endContent={<FaLongArrowAltRight />}
              >
                Get Started Today
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

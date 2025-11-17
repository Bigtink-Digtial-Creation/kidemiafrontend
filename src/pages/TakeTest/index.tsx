import { Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { SidebarRoutes, TestRoutes } from "../../routes";
import { motion } from "framer-motion";

export default function TakeTestPage() {
  const navigate = useNavigate();

  return (
    <section className="relative py-10 px-4 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-kidemia-biege/20 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-4 text-center mt-16"
      >
        <h2 className="text-4xl md:text-5xl text-kidemia-black font-bold tracking-tight">
          Welcome to the Kidemia Test Center
        </h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl mx-auto space-y-2"
        >
          <p className="text-lg md:text-xl text-kidemia-grey font-medium leading-relaxed">
            This is your moment to become a champion. Stay focused, stay
            confident, and trust your preparation.
          </p>

          <p className="text-lg md:text-xl text-kidemia-grey font-medium leading-relaxed">
            When you are ready, click{" "}
            <span className="font-bold text-kidemia-primary">Continue</span> to
            begin your journey.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-col md:flex-row items-center gap-4 md:gap-6 max-w-xl mx-auto mt-10"
      >
        <Button
          className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full shadow-sm hover:shadow-md transition-shadow"
          variant="faded"
          size="md"
          radius="sm"
          type="button"
          onPress={() => navigate(SidebarRoutes.dashboard)}
        >
          Cancel
        </Button>

        <Button
          className="bg-kidemia-secondary text-kidemia-white font-medium w-full shadow-sm hover:shadow-lg transition-shadow"
          size="md"
          radius="sm"
          type="button"
          onPress={() => navigate(TestRoutes.testSubjects)}
        >
          Continue
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-kidemia-primary/20 blur-2xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ delay: 0.2, duration: 1.2 }}
        className="absolute top-20 left-10 w-24 h-24 rounded-full bg-kidemia-secondary/20 blur-2xl pointer-events-none"
      />
    </section>
  );
}

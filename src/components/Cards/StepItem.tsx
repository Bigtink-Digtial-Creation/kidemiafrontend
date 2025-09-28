import { motion, type Variants } from "framer-motion";

export const StepItem = ({
  id,
  text,
  description,
  isLast,
}: {
  id: string;
  text: string;
  description: string;
  isLast: boolean;
}) => {
  const numberVariants: Variants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: {
      scaleY: 0,
      opacity: 0,
    },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
      },
    },
  };

  const textVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  return (
    <div className="flex items-start space-x-6">
      <div className="flex flex-col items-center">
        <motion.span
          className="text-kidemia-primary/50 font-bold text-3xl"
          variants={numberVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {id}
        </motion.span>
        {!isLast && (
          <motion.div
            className="w-px h-12 mt-2 bg-kidemia-primary/50 origin-top"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          />
        )}
      </div>

      <motion.div
        className="pt-1 space-y-1"
        variants={textVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h3 className="font-bold text-xl text-kidemia-primary">{text}</h3>
        <p className="text-base text-kidemia-grey">{description}</p>
      </motion.div>
    </div>
  );
};

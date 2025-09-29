import React from "react";
import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

interface TestimonialProps {
  name: string;
  role: string;
  image: string;
  text: string;
  index?: number;
}
export default function TestimonialCard({
  name,
  role,
  image,
  text,
  index,
}: TestimonialProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="w-full"
      initial={{ rotate: index === 1 ? 4 : 0 }}
    >
      <Card
        shadow={index === 1 ? "lg" : "sm"}
        className="rounded-xl p-4 bg-kidemia-white"
      >
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={image}
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-kidemia-black">
                {name}
              </h4>
              <p className="text-xs text-kidemia-grey/50 font-semibold">
                {role}
              </p>
            </div>
          </div>
          <p className="text-sm text-kidemia-grey">{text}</p>
          <span className="text-5xl text-gray-300 text-center">“</span>
        </CardBody>
      </Card>
    </motion.div>
  );
}

import { Image } from "@heroui/react";
import dash from "../../assets/images/dash.png";
import ChoiceCard from "../Cards/ChoiceCard";

export default function Choose() {
  return (
    <div className="mx-auto py-8 md:py-12 px-4 md:px-24 bg-kidemia-biege/25 space-y-12">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold  text-kidemia-black">
          Why <span className="text-kidemia-secondary">Kidemia</span> is The
          Right Choice for You
        </h3>
        <p className="text-sm md:text-base text-kidemia-grey">
          High level tests backed with instant results and seamless
          collaboration between students, guardians and tutors
        </p>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center">
          <div className="space-y-6">
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
          </div>

          <div>
            <Image src={dash} className="object-cover" alt="app image" />
            <ChoiceCard
              id={"03"}
              title={"Data-Driven Insights"}
              description={
                "With powerful analytics, both teachers and guardians can track trends, spot weaknesses, and measure growth over time, ensuring informed decision-making."
              }
            />
          </div>

          <div className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}

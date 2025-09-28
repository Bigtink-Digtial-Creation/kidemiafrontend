import { GrTest } from "react-icons/gr";
import { FaChalkboardTeacher, FaQuestionCircle } from "react-icons/fa";
import { TbChartInfographic, TbDeviceDesktopAnalytics } from "react-icons/tb";
import { SiGoogleearthengine } from "react-icons/si";

export const offersData = [
  {
    icon: GrTest,
    title: "Live Tests",
    description:
      "Students can participate in scheduled live tests that simulate real exam conditions. This feature helps them practice time management, experience exam pressure, and get instant results to gauge readiness.",
  },
  {
    icon: FaQuestionCircle,
    title: "High Yield Questions",
    description:
      "Access a curated pool of frequently tested and high-value questions designed to improve exam performance. These questions are updated regularly to align with current curricula and exam trends.",
  },
  {
    icon: TbDeviceDesktopAnalytics,
    title: "Insightful Analytics",
    description:
      "Both students and teachers can view in-depth performance insights, including strengths, weaknesses, accuracy rates, and time spent per question. Analytics help track progress and highlight areas needing improvement.",
  },
  {
    icon: SiGoogleearthengine,
    title: "Smart Exam Engine",
    description:
      "An AI-powered engine that auto-grades tests, prevents question repetition, and adapts difficulty levels to match student performance. It ensures fair, accurate, and personalized assessments.",
  },
  {
    icon: TbChartInfographic,
    title: "Guardian Dashboard",
    description:
      "Guardians can log in to a dedicated dashboard to monitor their ward’s performance. It includes grades, attendance, progress over time, and comparison reports to stay actively involved in their education.",
  },
  {
    icon: FaChalkboardTeacher,
    title: "Teacher Tools",
    description:
      "Teachers can easily upload questions, create assignments, grade tests, and track student progress. They also receive class-wide insights to identify trends and adjust teaching strategies accordingly.",
  },
];

export const forStudents = [
  {
    id: "01",
    text: " Take interactive exams and tests online.",
    description: "Engage in fun tests and exams",
  },
  {
    id: "02",
    text: "Receive instant grades and feedback.",
    description: "Test results dont have to wait for too long again.",
  },
  {
    id: "03",
    text: " Track your learning progress over time.",
    description:
      "Stay at the top of your game by keeping track of your progress",
  },
];

export const forGuardian = [
  {
    id: "01",
    text: " Monitor your child's academic performance.",
    description: "Get daily updates about how your ward is performing.",
  },
  {
    id: "02",
    text: "View progress reports and grading history.",
    description: "Access your kid's progress reports and histroy in real time",
  },
  {
    id: "03",
    text: "Stay connected with teachers for feedback.",
    description: "Direct access to your ward's teachers and thier feedback",
  },
];

export const forTeachers = [
  {
    id: "01",
    text: "Upload and manage test questions with ease.",
    description: "Access to the best test upload and management system",
  },
  {
    id: "02",
    text: "Grade student submissions quickly.",
    description: "Provide students with thier grades instantly",
  },
  {
    id: "03",
    text: "Track class performance and provide support.",
    description: "Access performance metrics and provide detailed support",
  },
];

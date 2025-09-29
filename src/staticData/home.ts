import { GrTest } from "react-icons/gr";
import {
  FaBook,
  FaCalculator,
  FaChalkboardTeacher,
  FaFlask,
  FaGlobe,
  FaLaptopCode,
  FaPaintBrush,
  FaQuestionCircle,
} from "react-icons/fa";
import { TbChartInfographic, TbDeviceDesktopAnalytics } from "react-icons/tb";
import { SiGoogleearthengine } from "react-icons/si";
import { MdBiotech, MdHistoryEdu, MdScience } from "react-icons/md";
import { GiAtom, GiGreekTemple } from "react-icons/gi";
import { BiMusic } from "react-icons/bi";
import { HomeRoutes } from "../routes";

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

export const topSubjects = [
  { id: 1, icon: FaBook, title: "English", figure: "85+" },
  { id: 2, icon: FaCalculator, title: "Mathematics", figure: "92+" },
  { id: 3, icon: MdScience, title: "Physics", figure: "76+" },
  { id: 4, icon: FaFlask, title: "Chemistry", figure: "81+" },
  { id: 5, icon: GiAtom, title: "Biology", figure: "79+" },
  { id: 6, icon: FaGlobe, title: "Geography", figure: "70+" },
  { id: 7, icon: MdHistoryEdu, title: "History", figure: "65+" },
  { id: 8, icon: GiGreekTemple, title: "Civics", figure: "68+" },
  { id: 9, icon: FaLaptopCode, title: "Computer Science", figure: "88+" },
  { id: 10, icon: FaPaintBrush, title: "Arts", figure: "74+" },
  { id: 11, icon: BiMusic, title: "Music", figure: "60+" },
  { id: 12, icon: MdBiotech, title: "Technology", figure: "83+" },
];

export const footerData = [
  {
    title: "Organization",
    links: [
      { label: "About Us", href: HomeRoutes.about },
      { label: "Contact Us", href: HomeRoutes.contact },
      { label: "Subjects", href: HomeRoutes.subjects },
      { label: "Tests", href: HomeRoutes.test },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Publications", href: "#" },
    ],
  },
];

export const schoolLogos = [
  {
    id: "1",
    src: "https://i.pinimg.com/1200x/81/f8/ab/81f8abb2bbe4f4b31b7e0b6d8a1f1dde.jpg",
  },
  {
    id: "2",
    src: "https://i.pinimg.com/736x/7d/9b/93/7d9b936804fe7eac6962b64ee902d390.jpg",
  },
  {
    id: "3",
    src: "https://i.pinimg.com/1200x/a2/a2/2c/a2a22cb2b5cc8a4115731282c63b5e83.jpg",
  },
  {
    id: "4",
    src: "https://i.pinimg.com/736x/44/c4/1f/44c41f1567290c720d6cff7fe3cf587a.jpg",
  },
  {
    id: "5",
    src: "https://i.pinimg.com/736x/ec/ce/9f/ecce9f34b9cf3bc867d301e43c326db3.jpg",
  },
  {
    id: "6",
    src: "https://i.pinimg.com/736x/53/04/78/5304781f92c5b42ca6b34331424a18df.jpg",
  },
  {
    id: "7",
    src: "https://i.pinimg.com/736x/b0/d7/8d/b0d78d099de03e6ab296c2af2debc96b.jpg",
  },
  {
    id: "8",
    src: "https://i.pinimg.com/1200x/bf/f0/d3/bff0d3bc0d69d95f03ff23f8882a5920.jpg",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Christine Jackson",
    role: "Student",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
  },
  {
    id: 2,
    name: "Yasmine Garcia",
    role: "Parent",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
  },
  {
    id: 3,
    name: "Sakura Palastri",
    role: "Student",
    image: "https://randomuser.me/api/portraits/women/30.jpg",
    text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
  },
  {
    id: 4,
    name: "Bác. Lõ Lính",
    role: "Teacher",
    image: "https://randomuser.me/api/portraits/men/35.jpg",
    text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
  },
  {
    id: 5,
    name: "Ibrahim Mahmud",
    role: "Student",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
  },
  {
    id: 6,
    name: "Margaret Taylor",
    role: "Parent",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
    text: "If you're not using testimonials, you're missing out on a golden opportunity to turn visitors and potential buyers into actual customers.",
  },
];

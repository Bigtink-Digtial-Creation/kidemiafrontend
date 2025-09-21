import { TbMathSymbols, TbMathXPlusY } from "react-icons/tb";
import { ImStatsBars } from "react-icons/im";
import { BsAlphabetUppercase } from "react-icons/bs";
import { FaBook } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { GoBeaker } from "react-icons/go";
import { MdOutlineRocketLaunch } from "react-icons/md";
import type { ApexOptions } from "apexcharts";

export interface TableRowI {
  sn: number;
  title: string;
  averageScore: number;
  status: "completed" | "pending" | "failed";
  comment: string;
  dateCreated: string;
}

export const categoriesData = [
  "Math",
  "English",
  "Biology",
  "Physics",
  "Chemistry",
];

export const dataSeries = [
  { name: "Test 1", data: [65, 70, 55, 80, 60] },
  { name: "Test 2", data: [75, 85, 60, 90, 70] },
];

export const mockTableData: TableRowI[] = [
  {
    sn: 1,
    title: "Mathematics Test 1",
    averageScore: 78,
    status: "completed",
    comment: "Good performance overall",
    dateCreated: "2025-01-12",
  },
  {
    sn: 2,
    title: "English Assignment",
    averageScore: 65,
    status: "completed",
    comment: "Needs more grammar practice",
    dateCreated: "2025-01-15",
  },
  {
    sn: 3,
    title: "Biology Exam",
    averageScore: 52,
    status: "pending",
    comment: "Scheduled for next week",
    dateCreated: "2025-01-20",
  },
  {
    sn: 4,
    title: "Chemistry Quiz",
    averageScore: 84,
    status: "completed",
    comment: "Excellent grasp of reactions",
    dateCreated: "2025-01-25",
  },
  {
    sn: 5,
    title: "Physics Project",
    averageScore: 40,
    status: "failed",
    comment: "Resubmission required",
    dateCreated: "2025-02-01",
  },
  {
    sn: 6,
    title: "Physics Project",
    averageScore: 40,
    status: "failed",
    comment: "Resubmission required",
    dateCreated: "2025-02-01",
  },
  {
    sn: 7,
    title: "Physics Project",
    averageScore: 40,
    status: "failed",
    comment: "Resubmission required",
    dateCreated: "2025-02-01",
  },
  {
    sn: 8,
    title: "Physics Project",
    averageScore: 40,
    status: "failed",
    comment: "Resubmission required",
    dateCreated: "2025-02-01",
  },
  {
    sn: 9,
    title: "Physics Project",
    averageScore: 40,
    status: "failed",
    comment: "Resubmission required",
    dateCreated: "2025-02-01",
  },
  {
    sn: 10,
    title: "Physics Project",
    averageScore: 40,
    status: "failed",
    comment: "Resubmission required",
    dateCreated: "2025-02-01",
  },
];

export const subjectsData = [
  {
    icon: TbMathSymbols,
    title: "Mathematics",
    topics: "14 Topics",
  },
  {
    icon: TbMathXPlusY,
    title: "Calculus",
    topics: "14 Topics",
  },
  {
    icon: ImStatsBars,
    title: "Statistics",
    topics: "14 Topics",
  },
  {
    icon: BsAlphabetUppercase,
    title: "English",
    topics: "14 Topics",
  },
  {
    icon: FaBook,
    title: "Literature",
    topics: "14 Topics",
  },
  {
    icon: GiBrain,
    title: "Quantitative Reasoning",
    topics: "14 Topics",
  },
  {
    icon: GoBeaker,
    title: "Chemistry",
    topics: "14 Topics",
  },
  {
    icon: MdOutlineRocketLaunch,
    title: "Physics",
    topics: "14 Topics",
  },
];

export const topicsData = [
  { id: 1, value: "Algebra Basics" },
  { id: 2, value: "World War II" },
  { id: 3, value: "Photosynthesis" },
  { id: 4, value: "Computer Networks" },
  { id: 5, value: "Shakespearean Literature" },
  { id: 6, value: "Trigonometry" },
  { id: 7, value: "Periodic Table" },
  { id: 8, value: "Human Anatomy" },
  { id: 9, value: "Economics: Supply & Demand" },
  { id: 10, value: "Environmental Conservation" },
  { id: 11, value: "Calculus Derivatives" },
  { id: 12, value: "Astronomy: Solar System" },
  { id: 13, value: "Programming Fundamentals" },
  { id: 14, value: "Ancient Civilizations" },
  { id: 15, value: "Genetics & DNA" },
  { id: 16, value: "Probability & Statistics" },
  { id: 17, value: "Chemistry Reactions" },
  { id: 18, value: "Geography: Climate Zones" },
  { id: 19, value: "Art History: Renaissance" },
  { id: 20, value: "Political Science Basics" },
];

export const value = 45;

export const options: ApexOptions = {
  chart: {
    type: "radialBar",
    sparkline: { enabled: true },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "70%",
      },
      track: {
        background: "transparent",
        strokeWidth: "100%",
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: "32px",
          fontWeight: 600,
          color: "#BF4C20",
          offsetY: 0,
          formatter: (val) => `${val}%`,
        },
      },
      startAngle: -180,
      endAngle: 180,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "horizontal",
      gradientToColors: ["#ff7b00"],
      stops: [0, 100],
    },
  },
  colors: ["#e55b00"],
  stroke: {
    lineCap: "round",
  },
};

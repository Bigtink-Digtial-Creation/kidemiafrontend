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

export const mockResultsData = [
  {
    sn: 1,
    subject: "Mathematics",
    averageScore: 78,
    remark: "Good performance, but room for improvement",
    dateTaken: "2025-01-12",
  },
  {
    sn: 2,
    subject: "English Language",
    averageScore: 85,
    remark: "Excellent understanding of concepts",
    dateTaken: "2025-01-18",
  },
  {
    sn: 3,
    subject: "Biology",
    averageScore: 62,
    remark: "Fair, needs more focus on diagrams",
    dateTaken: "2025-01-21",
  },
  {
    sn: 4,
    subject: "Chemistry",
    averageScore: 90,
    remark: "Outstanding work in practicals and theory",
    dateTaken: "2025-02-02",
  },
  {
    sn: 5,
    subject: "Physics",
    averageScore: 71,
    remark: "Above average, calculations could improve",
    dateTaken: "2025-02-05",
  },
  {
    sn: 6,
    subject: "Geography",
    averageScore: 68,
    remark: "Decent effort, revise case studies",
    dateTaken: "2025-02-10",
  },
  {
    sn: 7,
    subject: "History",
    averageScore: 80,
    remark: "Very good recall and analysis",
    dateTaken: "2025-02-15",
  },
  {
    sn: 8,
    subject: "Economics",
    averageScore: 74,
    remark: "Solid understanding of principles",
    dateTaken: "2025-02-18",
  },
  {
    sn: 9,
    subject: "Government",
    averageScore: 59,
    remark: "Needs significant improvement",
    dateTaken: "2025-02-20",
  },
  {
    sn: 10,
    subject: "Literature",
    averageScore: 88,
    remark: "Excellent critical analysis",
    dateTaken: "2025-02-22",
  },
];


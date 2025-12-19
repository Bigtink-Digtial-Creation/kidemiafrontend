import type { IconType } from "react-icons";

// API Response Types
export interface UserStatisticsResponse {
  user_id: string;
  stats: UserStats;
  test_performance_chart: PerformanceChart;
  exam_performance_chart: PerformanceChart;
  subject_history: AssessmentHistoryItem[];
  exam_history: AssessmentHistoryItem[];
  summary: PerformanceSummary;
}

export interface UserStats {
  tests_attempted: number;
  test_correct_answers: number;
  exams_attempted: number;
  exam_correct_answers: number;
  avg_time_per_question: number;
}

export interface PerformanceChart {
  categories: string[];
  series: ChartSeries[];
}

export interface ChartSeries {
  name: string;
  data: number[];
}

export interface AssessmentHistoryItem {
  sn: number;
  title: string;
  assessment_id: string;
  attempt_id: string;
  average_score: string;
  status: "excellent" | "good" | "needs improvement" | "pending";
  comment: string;
  date_created: string;
}

export interface PerformanceSummary {
  test_performance: number;
  exam_performance: number;
}

// Component Props Types
export interface StatsCardProps {
  icon: IconType;
  title: string;
  figure: string;
  sub?: string;
}

export interface AnalyticsChartProps {
  testCategories: string[];
  testDataSeries: ChartSeries[];
  examCategories: string[];
  examDataSeries: ChartSeries[];
}

export interface AssessmentHistoryProps {
  subjectHistory: AssessmentHistoryItem[];
  examHistory: AssessmentHistoryItem[];
}

export interface AssessmentTableProps {
  data: AssessmentHistoryItem[];
  emptyMessage?: string;
}

export interface ReportSummaryProps {
  testPerformance: number;
  examPerformance: number;
}

// Status color mapping
export type StatusColorType = "success" | "warning" | "danger" | "default";

export const STATUS_COLOR_MAP: Record<AssessmentHistoryItem["status"], StatusColorType> = {
  excellent: "success",
  good: "warning",
  "needs improvement": "danger",
  pending: "default",
};
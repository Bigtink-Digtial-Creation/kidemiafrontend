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

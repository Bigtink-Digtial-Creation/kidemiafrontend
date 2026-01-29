

export interface AssignmentMonitor {
    id: string;
    assessment_title: string;
    assessment_id: string;
    ward_name: string;
    ward_id: string;
    assigned_at: string;
    due_date: string | null;
    status: "assigned" | "started" | "completed" | "overdue";
    attempt_count: number;
    max_attempts: number;
    attempts_remaining: number;
    last_attempt_score: number | null;
    score: number | null;
    percentage: number | null;
    passed: boolean | null;
    tab_switches: number | null;
    webcam_violations: number | null;
    fullscreen_exits: number | null;
}
import {
    Card,
    CardBody,
    Button,
    Chip,
    Divider,
} from "@heroui/react";
import {
    FiClock,
    FiBookOpen,
    FiVideo,
    FiEye,
    FiPlay,
} from "react-icons/fi";
import { AssessmentRoutes, WardRoutes } from "../../../routes";


export default function WardAssignmentCard({ assignment, navigate }: { assignment: any; navigate: any }) {
    const isCompleted = assignment.status === "completed";
    const isOverdue = assignment.status === "overdue";

    return (
        <Card shadow="sm" className="border-none bg-content1 hover:bg-content2 transition-colors">
            <CardBody className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Info Side */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Chip
                                size="sm"
                                variant="flat"
                                color={isCompleted ? "success" : isOverdue ? "danger" : "primary"}
                            >
                                {assignment.subject_name}
                            </Chip>
                            {assignment.due_date && !isCompleted && (
                                <span className={`text-xs font-medium ${isOverdue ? 'text-danger' : 'text-warning'}`}>
                                    Due {new Date(assignment.due_date).toLocaleDateString()}
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold mb-1">{assignment.assessment_title}</h3>
                        <p className="text-sm text-default-500 mb-4">Assigned by {assignment.assigned_by_name}</p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <MetaItem icon={<FiClock />} text={`${assignment.duration_minutes}m`} />
                            <MetaItem icon={<FiBookOpen />} text={`${assignment.total_questions} Questions`} />
                            {assignment.requires_webcam && <MetaItem icon={<FiVideo />} text="Proctored" color="text-warning" />}
                        </div>
                    </div>

                    {/* Result/Action Side */}
                    <Divider orientation="vertical" className="hidden md:block h-auto" />

                    <div className="flex flex-row md:flex-col justify-between items-center md:justify-center md:min-w-[180px] gap-4">
                        {isCompleted && assignment.score !== null && (
                            <div className="text-center">
                                <span className="text-2xl font-bold text-success">{assignment.score}%</span>
                                <p className="text-xs uppercase tracking-wider text-default-400 font-semibold">Final Score</p>
                            </div>
                        )}

                        <Button
                            fullWidth
                            color={isCompleted ? "default" : isOverdue ? "danger" : "primary"}
                            className="bg-kidemia-secondary text-white"
                            variant={isCompleted || isOverdue ? "flat" : "solid"}
                            startContent={isCompleted ? <FiEye /> : <FiPlay />}
                            onPress={() => {
                                const route = isCompleted
                                    ? AssessmentRoutes.assessmentResult
                                    : WardRoutes.assessmentInstructions;
                                navigate(
                                    route
                                        .replace(":assessment_id", assignment.assessment_id)
                                        .replace(":id", assignment.assessment_id)
                                );

                            }}
                        >

                            {isCompleted ? "Results" : assignment.status === "started" ? "Continue" : "Start"}
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}



function MetaItem({ icon, text, color = "text-default-400" }: { icon: any; text: string; color?: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className={color}>{icon}</span>
            <span className="text-sm font-medium text-default-600">{text}</span>
        </div>
    );
}
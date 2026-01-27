import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    Card,
    CardBody,
    Button,
    Input,
    Select,
    SelectItem,
    addToast,
    Textarea,
    Chip,
    Divider,
} from "@heroui/react";
import { FiArrowLeft, FiPlus, FiBook, FiUsers, FiClock, FiCalendar } from "react-icons/fi";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { GuardianRoutes } from "../../routes";

interface Topic {
    id: string;
    name: string;
    subject_id: string;
}

export default function CreateAssessmentPage() {
    const navigate = useNavigate();

    // Form state
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
    const [numberOfQuestions, setNumberOfQuestions] = useState("10");
    const [duration, setDuration] = useState("30");
    const [selectedWards, setSelectedWards] = useState<Set<string>>(new Set());
    const [dueDate, setDueDate] = useState("");
    const [instructions, setInstructions] = useState("");

    // Queries
    const { data: guardianData } = useQuery({
        queryKey: [QueryKeys.guardianProfile],
        queryFn: () => ApiSDK.GuardiansService.getMyGuardianProfileApiV1GuardiansMeGet(),
    });

    const profile = guardianData?.data;

    const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
        queryKey: [QueryKeys.allSubjects],
        queryFn: () => ApiSDK.SubjectsService?.getSubjectsApiV1SubjectsGet?.(),
    });

    const { data: topicsData, isLoading: topicsLoading } = useQuery({
        queryKey: [QueryKeys.allTopics, selectedSubject],
        queryFn: () => ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(selectedSubject),
        enabled: !!selectedSubject,
    });

    const { data: wardsData, isLoading: wardsLoading } = useQuery({
        queryKey: [QueryKeys.myWards, profile?.id],
        queryFn: () => ApiSDK.GuardiansService.getMyWardsApiV1GuardiansGuardianIdWardsGet(profile?.id!),
        enabled: !!profile?.id,
    });

    // Mutation
    const createAssessment = useMutation({
        mutationFn: (data: any) => ApiSDK.GuardiansService.createAndAssignAssessmentApiV1GuardiansGuardianIdAssessmentsPost(profile!.id, data),
        onSuccess: () => {
            addToast({ title: "Success", description: "Assessment created successfully!", color: "success" });
            navigate(GuardianRoutes.dashboard);
        },
        onError: (error: any) => {
            addToast({ title: "Failed", description: error.message || "Failed to create", color: "danger" });
        },
    });

    const handleSubmit = () => {
        if (!selectedSubject || selectedTopics.size === 0 || selectedWards.size === 0) {
            addToast({ title: "Required Fields", description: "Please complete all required selections", color: "warning" });
            return;
        }

        const assessmentData = {
            subject_id: selectedSubject,
            topic_ids: Array.from(selectedTopics),
            number_of_questions: parseInt(numberOfQuestions),
            duration_minutes: parseInt(duration),
            ward_ids: Array.from(selectedWards),
            due_date: dueDate || null,
            instructions: instructions || null,
            shuffle_questions: true,
            shuffle_options: true,
            allow_review: true,
        };

        createAssessment.mutate(assessmentData);
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
            {/* Header - Mobile Responsive */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <Button
                    isIconOnly
                    variant="flat"
                    className="w-10 h-10 min-w-10 bg-white shadow-sm"
                    onPress={() => navigate(GuardianRoutes.dashboard)}
                >
                    <FiArrowLeft />
                </Button>
                <div>
                    <h1 className="text-xl md:text-md font-bold text-slate-900">Create Practice Test</h1>
                    <p className="text-sm text-slate-500">Auto-generate and assign assessments to your wards</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardBody className="p-6 space-y-8">
                            {/* Step 1: Subject & Topics */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><FiBook /></div>
                                    <h3 className="font-bold text-slate-800">Academic Context</h3>
                                </div>

                                <Select
                                    label="Subject"
                                    placeholder="Which subject is this for?"
                                    variant="bordered"
                                    isLoading={subjectsLoading}
                                    selectedKeys={selectedSubject ? [selectedSubject] : []}
                                    onChange={(e) => {
                                        setSelectedSubject(e.target.value);
                                        setSelectedTopics(new Set());
                                    }}
                                >
                                    {(subjectsData?.items || []).map((subject: any) => (
                                        <SelectItem key={subject.id} textValue={subject.name}>{subject.name}</SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    label="Topics"
                                    placeholder={selectedSubject ? "Search or select topics" : "Select a subject first"}
                                    selectionMode="multiple"
                                    variant="bordered"
                                    isDisabled={!selectedSubject}
                                    isLoading={topicsLoading}
                                    selectedKeys={selectedTopics}
                                    onSelectionChange={(keys) => setSelectedTopics(keys as Set<string>)}
                                    className="max-w-full"
                                    // This makes it searchable and handles hundreds of items
                                    isMultiline={true}
                                    renderValue={(items) => (
                                        <div className="flex flex-wrap gap-1">
                                            {items.map((item) => (
                                                <Chip key={item.key} size="sm" variant="flat" color="warning">{item.textValue}</Chip>
                                            ))}
                                        </div>
                                    )}
                                >
                                    {(topicsData?.items || []).map((topic: Topic) => (
                                        <SelectItem key={topic.id} textValue={topic.name}>{topic.name}</SelectItem>
                                    ))}
                                </Select>
                            </section>

                            <Divider />

                            {/* Step 2: Config */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    label="Question Count"
                                    variant="bordered"
                                    value={numberOfQuestions}
                                    onChange={(e) => setNumberOfQuestions(e.target.value)}
                                    startContent={<div className="text-slate-400 text-xs">#</div>}
                                />
                                <Input
                                    type="number"
                                    label="Duration (Mins)"
                                    variant="bordered"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    startContent={<FiClock className="text-slate-400" />}
                                />
                            </section>

                            <Textarea
                                label="Instructions"
                                placeholder="Any special notes for the wards?"
                                variant="bordered"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                            />
                        </CardBody>
                    </Card>

                    {/* Step 3: Assignment */}
                    <Card className="border-none shadow-sm">
                        <CardBody className="p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><FiUsers /></div>
                                <h3 className="font-bold text-slate-800">Assign Wards</h3>
                            </div>

                            <Select
                                label="Select Wards"
                                placeholder="Assign to one or more wards"
                                selectionMode="multiple"
                                variant="bordered"
                                isLoading={wardsLoading}
                                selectedKeys={selectedWards}
                                onSelectionChange={(keys) => setSelectedWards(keys as Set<string>)}
                                renderValue={(items) => (
                                    <div className="flex flex-wrap gap-1">
                                        {items.map((item) => (
                                            <Chip key={item.key} size="sm" className="bg-slate-100">{item.textValue}</Chip>
                                        ))}
                                    </div>
                                )}
                            >
                                {(wardsData?.data || []).map((ward: any) => (
                                    <SelectItem key={ward.id} textValue={ward.full_name}>
                                        {ward.full_name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Input
                                type="datetime-local"
                                label="Due Date"
                                variant="bordered"
                                placeholder=" "
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                startContent={<FiCalendar className="text-slate-400" />}
                            />
                        </CardBody>
                    </Card>
                </div>

                {/* Sidebar Summary - Becomes bottom action bar on mobile */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6 bg-slate-900 text-white border-none">
                        <CardBody className="p-6 space-y-6">
                            <h3 className="text-lg font-bold">Summary</h3>

                            <div className="space-y-4">
                                <SummaryRow label="Subject" value={selectedSubject ? subjectsData?.items?.find((s: any) => s.id === selectedSubject)?.name! : "None"} />
                                <SummaryRow label="Topics" value={`${selectedTopics.size} selected`} />
                                <SummaryRow label="Questions" value={numberOfQuestions} />
                                <SummaryRow label="Time Limit" value={`${duration} mins`} />
                                <SummaryRow label="Wards" value={`${selectedWards.size} assigned`} />
                            </div>

                            <Button
                                className="w-full bg-orange-500 text-white font-bold h-14 rounded-xl shadow-lg shadow-orange-900/20"
                                startContent={<FiPlus />}
                                onPress={handleSubmit}
                                isLoading={createAssessment.isPending}
                            >
                                Create & Assign
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="font-semibold text-white truncate max-w-[120px]">{value}</span>
        </div>
    );
}
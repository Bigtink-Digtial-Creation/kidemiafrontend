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
    Switch,
    RadioGroup,
    Radio,
    Tabs,
    Tab,
} from "@heroui/react";
import {
    FiArrowLeft,
    FiPlus,
    FiBook,
    FiUsers,
    FiClock,
    FiCalendar,
    FiShield,
    FiEye,
    FiSettings,
    FiAlertCircle,
} from "react-icons/fi";
import { ApiSDK } from "../../sdk";
import { QueryKeys } from "../../utils/queryKeys";
import { GuardianRoutes } from "../../routes";

interface Topic {
    id: string;
    name: string;
    subject_id: string;
}

export default function CreateChallengeAssessment() {
    const navigate = useNavigate();

    // Basic Form State
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
    const [numberOfQuestions, setNumberOfQuestions] = useState("10");
    const [duration, setDuration] = useState("30");
    const [selectedWards, setSelectedWards] = useState<Set<string>>(new Set());
    const [dueDate, setDueDate] = useState("");
    const [availableFrom, setAvailableFrom] = useState("");
    const [instructions, setInstructions] = useState("");

    // Assessment Configuration
    const [passingPercentage, setPassingPercentage] = useState("50");
    const [maxAttempts, setMaxAttempts] = useState("1");
    const [shuffleQuestions, setShuffleQuestions] = useState(true);
    const [shuffleOptions, setShuffleOptions] = useState(true);
    const [allowNavigation, setAllowNavigation] = useState(true);
    const [allowReview, setAllowReview] = useState(true);

    // Result Display
    const [resultDisplayMode, setResultDisplayMode] = useState("immediate");
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
    const [showExplanations, setShowExplanations] = useState(false);

    // Proctoring Configuration
    const [enableProctoring, setEnableProctoring] = useState(true);
    const [requireWebcam, setRequireWebcam] = useState(true);
    const [fullscreenRequired, setFullscreenRequired] = useState(true);
    const [detectTabSwitching, setDetectTabSwitching] = useState(true);
    const [maxTabSwitches, setMaxTabSwitches] = useState("3");

    // Auto-submit
    const [autoSubmit, setAutoSubmit] = useState(true);

    // Active Tab
    const [activeTab, setActiveTab] = useState("content");

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
        queryFn: () =>
            ApiSDK.SubjectTopicsService.getTopicsBySubjectApiV1TopicsSubjectSubjectIdGet(
                selectedSubject
            ),
        enabled: !!selectedSubject,
    });

    const { data: wardsData, isLoading: wardsLoading } = useQuery({
        queryKey: [QueryKeys.myWards, profile?.id],
        queryFn: () =>
            ApiSDK.GuardiansService.getMyWardsApiV1GuardiansGuardianIdWardsGet(
                profile?.id!
            ),
        enabled: !!profile?.id,
    });

    // Mutation
    const createAssessment = useMutation({
        mutationFn: (data: any) =>
            ApiSDK.GuardiansService.createAndAssignAssessmentApiV1GuardiansGuardianIdAssessmentsPost(
                profile!.id,
                data
            ),
        onSuccess: () => {
            addToast({
                title: "Success",
                description: "Challenge created and assigned successfully!",
                color: "success",
            });
            navigate(GuardianRoutes.dashboard);
        },
        onError: (error: any) => {
            addToast({
                title: "Failed",
                description: error.body?.detail || error?.body?.message || error.message || "Failed to create challenge",
                color: "danger",
            });
        },
    });

    const handleSubmit = () => {
        // Validation
        if (!selectedSubject || selectedTopics.size === 0 || selectedWards.size === 0) {
            addToast({
                title: "Required Fields",
                description: "Please complete all required selections",
                color: "warning",
            });
            return;
        }

        const assessmentData = {
            // Content
            subject_id: selectedSubject,
            topic_ids: Array.from(selectedTopics),
            number_of_questions: parseInt(numberOfQuestions),

            // Timing
            duration_minutes: parseInt(duration),
            due_date: dueDate || null,
            available_from: availableFrom || null,

            // Assignment
            ward_ids: Array.from(selectedWards),
            instructions: instructions || null,

            // Configuration
            passing_percentage: parseFloat(passingPercentage),
            max_attempts: parseInt(maxAttempts),
            shuffle_questions: shuffleQuestions,
            shuffle_options: shuffleOptions,
            allow_question_navigation: allowNavigation,
            allow_review: allowReview,

            // Results
            result_display_mode: resultDisplayMode,
            show_correct_answers: showCorrectAnswers,
            show_explanations: showExplanations,

            // Proctoring
            enable_proctoring: enableProctoring,
            require_webcam: requireWebcam,
            fullscreen_required: fullscreenRequired,
            detect_tab_switching: detectTabSwitching,
            max_tab_switches: parseInt(maxTabSwitches),

            // Auto-submit
            auto_submit_on_time_up: autoSubmit,
        };

        createAssessment.mutate(assessmentData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto pt-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        isIconOnly
                        variant="flat"
                        className="bg-white shadow-md hover:shadow-lg transition-shadow"
                        onPress={() => navigate(GuardianRoutes.dashboard)}
                    >
                        <FiArrowLeft className="text-xl" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                            Create Challenge Assessment
                        </h1>
                        <p className="text-slate-600 mt-1 text-md">
                            Build a comprehensive, proctored assessment for your wards
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Tabs
                            selectedKey={activeTab}
                            onSelectionChange={(key) => setActiveTab(key as string)}
                            classNames={{
                                tabList: "bg-white shadow-sm rounded-xl p-1",
                                cursor: "bg-gradient-to-r from-orange-500 to-orange-600 shadow-md",
                                tab: "font-semibold",
                                tabContent: "group-data-[selected=true]:text-white",
                            }}
                        >
                            {/* CONTENT TAB */}
                            <Tab
                                key="content"
                                title={
                                    <div className="flex items-center gap-2">
                                        <FiBook />
                                        <span>Content</span>
                                    </div>
                                }
                            >
                                <Card className="mt-6 border-none shadow-md">
                                    <CardBody className="p-8 space-y-8">
                                        {/* Subject Selection */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                                                    <FiBook className="text-orange-600 text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg">
                                                        Select Subject & Topics
                                                    </h3>
                                                    <p className="text-sm text-slate-500">
                                                        Choose what this assessment covers
                                                    </p>
                                                </div>
                                            </div>

                                            <Select
                                                label="Subject *"
                                                placeholder="Which subject?"
                                                variant="bordered"
                                                size="lg"
                                                isLoading={subjectsLoading}
                                                selectedKeys={selectedSubject ? [selectedSubject] : []}
                                                onChange={(e) => {
                                                    setSelectedSubject(e.target.value);
                                                    setSelectedTopics(new Set());
                                                }}
                                                classNames={{
                                                    trigger: "border-2 hover:border-orange-300",
                                                }}
                                            >
                                                {(subjectsData?.items || []).map((subject: any) => (
                                                    <SelectItem key={subject.id} textValue={subject.name}>
                                                        {subject.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>

                                            <Select
                                                label="Topics * (1-20)"
                                                placeholder={
                                                    selectedSubject
                                                        ? "Select up to 20 topics"
                                                        : "Select a subject first"
                                                }
                                                selectionMode="multiple"
                                                variant="bordered"
                                                size="lg"
                                                isDisabled={!selectedSubject}
                                                isLoading={topicsLoading}
                                                selectedKeys={selectedTopics}
                                                onSelectionChange={(keys) =>
                                                    setSelectedTopics(keys as Set<string>)
                                                }
                                                isMultiline={true}
                                                classNames={{
                                                    trigger: "border-2 hover:border-orange-300 min-h-[60px]",
                                                }}
                                                renderValue={(items) => (
                                                    <div className="flex flex-wrap gap-2 py-1">
                                                        {items.map((item) => (
                                                            <Chip
                                                                key={item.key}
                                                                size="sm"
                                                                variant="flat"
                                                                className="bg-orange-100 text-orange-700 font-medium"
                                                            >
                                                                {item.textValue}
                                                            </Chip>
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                {(topicsData?.items || []).map((topic: Topic) => (
                                                    <SelectItem key={topic.id} textValue={topic.name}>
                                                        {topic.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>

                                        <Divider />

                                        {/* Question Configuration */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-slate-800">
                                                Assessment Configuration
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <Input
                                                    type="number"
                                                    label="Questions"
                                                    variant="bordered"
                                                    value={numberOfQuestions}
                                                    onChange={(e) => setNumberOfQuestions(e.target.value)}
                                                    min="5"
                                                    max="100"
                                                    description="5-100 questions"
                                                    classNames={{
                                                        inputWrapper: "border-2 hover:border-orange-300",
                                                    }}
                                                />
                                                <Input
                                                    type="number"
                                                    label="Duration (mins)"
                                                    variant="bordered"
                                                    value={duration}
                                                    onChange={(e) => setDuration(e.target.value)}
                                                    min="10"
                                                    max="300"
                                                    startContent={
                                                        <FiClock className="text-slate-400" />
                                                    }
                                                    description="10-300 minutes"
                                                    classNames={{
                                                        inputWrapper: "border-2 hover:border-orange-300",
                                                    }}
                                                />
                                                <Input
                                                    type="number"
                                                    label="Max Attempts"
                                                    variant="bordered"
                                                    value={maxAttempts}
                                                    onChange={(e) => setMaxAttempts(e.target.value)}
                                                    min="1"
                                                    max="5"
                                                    description="1-5 attempts"
                                                    classNames={{
                                                        inputWrapper: "border-2 hover:border-orange-300",
                                                    }}
                                                />
                                            </div>

                                            <Input
                                                type="number"
                                                label="Passing Percentage"
                                                variant="bordered"
                                                value={passingPercentage}
                                                onChange={(e) => setPassingPercentage(e.target.value)}
                                                min="0"
                                                max="100"
                                                endContent={<span className="text-slate-400">%</span>}
                                                description="Minimum score to pass (0-100%)"
                                                classNames={{
                                                    inputWrapper: "border-2 hover:border-orange-300",
                                                }}
                                            />
                                        </div>

                                        <Divider />

                                        {/* Instructions */}
                                        <Textarea
                                            label="Special Instructions"
                                            placeholder="Add any specific guidelines for your wards..."
                                            variant="bordered"
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            minRows={4}
                                            classNames={{
                                                inputWrapper: "border-2 hover:border-orange-300",
                                            }}
                                        />


                                        <div className="flex justify-end pt-4">
                                            <Button
                                                size="lg"
                                                color="warning"
                                                className="font-bold text-white"
                                                endContent={<FiArrowLeft className="rotate-180" />}
                                                onPress={() =>
                                                    setActiveTab("behavior")
                                                }
                                            >
                                                Next: Behavior
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>

                            {/* BEHAVIOR TAB */}
                            <Tab
                                key="behavior"
                                title={
                                    <div className="flex items-center gap-2">
                                        <FiSettings />
                                        <span>Behavior</span>
                                    </div>
                                }
                            >
                                <Card className="mt-6 border-none shadow-md">
                                    <CardBody className="p-8 space-y-8">
                                        {/* Question Behavior */}
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                                <FiSettings className="text-orange-500" />
                                                Question Behavior
                                            </h4>

                                            <div className="space-y-4 bg-slate-50 p-6 rounded-xl">
                                                <Switch
                                                    isSelected={shuffleQuestions}
                                                    onValueChange={setShuffleQuestions}
                                                    classNames={{
                                                        wrapper: "group-data-[selected=true]:bg-orange-500",
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-800">
                                                            Shuffle Questions
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Randomize question order for each ward
                                                        </p>
                                                    </div>
                                                </Switch>

                                                <Switch
                                                    isSelected={shuffleOptions}
                                                    onValueChange={setShuffleOptions}
                                                    classNames={{
                                                        wrapper: "group-data-[selected=true]:bg-orange-500",
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-800">
                                                            Shuffle Options
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Randomize answer choices
                                                        </p>
                                                    </div>
                                                </Switch>

                                                <Switch
                                                    isSelected={allowNavigation}
                                                    onValueChange={setAllowNavigation}
                                                    classNames={{
                                                        wrapper: "group-data-[selected=true]:bg-orange-500",
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-800">
                                                            Allow Question Navigation
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Let wards jump between questions
                                                        </p>
                                                    </div>
                                                </Switch>

                                                <Switch
                                                    isSelected={allowReview}
                                                    onValueChange={setAllowReview}
                                                    classNames={{
                                                        wrapper: "group-data-[selected=true]:bg-orange-500",
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-800">
                                                            Allow Review
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Enable backward navigation
                                                        </p>
                                                    </div>
                                                </Switch>
                                            </div>
                                        </div>

                                        <Divider />

                                        {/* Result Display */}
                                        <div className="space-y-6">
                                            <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                                <FiEye className="text-orange-500" />
                                                Results Display
                                            </h4>

                                            <RadioGroup
                                                label="When should wards see results?"
                                                value={resultDisplayMode}
                                                onValueChange={setResultDisplayMode}
                                                classNames={{
                                                    wrapper: "gap-4",
                                                }}
                                            >
                                                <Radio value="immediate" className="max-w-full">
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold">Immediately</p>
                                                        <p className="text-sm text-slate-500">
                                                            Show results right after submission
                                                        </p>
                                                    </div>
                                                </Radio>
                                                <Radio value="after_submission" className="max-w-full">
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold">After Submission</p>
                                                        <p className="text-sm text-slate-500">
                                                            Show when you review the submission
                                                        </p>
                                                    </div>
                                                </Radio>
                                                <Radio value="after_due_date" className="max-w-full">
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold">After Due Date</p>
                                                        <p className="text-sm text-slate-500">
                                                            Show only after deadline passes
                                                        </p>
                                                    </div>
                                                </Radio>
                                            </RadioGroup>

                                            <div className="space-y-4 bg-slate-50 p-6 rounded-xl">
                                                <Switch
                                                    isSelected={showCorrectAnswers}
                                                    onValueChange={setShowCorrectAnswers}
                                                    classNames={{
                                                        wrapper: "group-data-[selected=true]:bg-orange-500",
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-800">
                                                            Show Correct Answers
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Display which answers were correct
                                                        </p>
                                                    </div>
                                                </Switch>

                                                <Switch
                                                    isSelected={showExplanations}
                                                    onValueChange={setShowExplanations}
                                                    classNames={{
                                                        wrapper: "group-data-[selected=true]:bg-orange-500",
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-800">
                                                            Show Explanations
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Include detailed explanations
                                                        </p>
                                                    </div>
                                                </Switch>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <Button
                                                size="lg"
                                                color="warning"
                                                className="font-bold text-white"
                                                endContent={<FiArrowLeft className="rotate-180" />}
                                                onPress={() =>
                                                    setActiveTab("proctoring")
                                                }
                                            >
                                                Next: Proctoring
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>

                            {/* PROCTORING TAB */}
                            <Tab
                                key="proctoring"
                                title={
                                    <div className="flex items-center gap-2">
                                        <FiShield />
                                        <span>Proctoring</span>
                                    </div>
                                }
                            >
                                <Card className="mt-6 border-none shadow-md">
                                    <CardBody className="p-8 space-y-8">
                                        {/* Proctoring Alert */}
                                        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-orange-100 rounded-lg">
                                                    <FiAlertCircle className="text-orange-600 text-2xl" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-orange-900 mb-2">
                                                        Academic Integrity Features
                                                    </h4>
                                                    <p className="text-sm text-orange-800 leading-relaxed">
                                                        Enable proctoring to monitor wards during the
                                                        assessment. These features help ensure fairness
                                                        and detect potential violations.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Proctoring Toggle */}
                                        <div className="bg-slate-50 p-6 rounded-xl">
                                            <Switch
                                                size="lg"
                                                isSelected={enableProctoring}
                                                onValueChange={setEnableProctoring}
                                                classNames={{
                                                    wrapper: "group-data-[selected=true]:bg-orange-500",
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-slate-800 text-lg">
                                                        Enable Proctoring
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        Turn on monitoring features for this assessment
                                                    </p>
                                                </div>
                                            </Switch>
                                        </div>

                                        {/* Proctoring Options */}
                                        {enableProctoring && (
                                            <div className="space-y-4 pl-4 border-l-4 border-orange-200">
                                                <Switch
                                                    isSelected={requireWebcam}
                                                    onValueChange={setRequireWebcam}
                                                    classNames={{
                                                        wrapper: "group-data-[selected=true]:bg-orange-500",
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-800">
                                                            Require Webcam
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Ward must grant camera access to start
                                                        </p>
                                                    </div>
                                                </Switch>

                                                <Switch
                                                    isSelected={fullscreenRequired}
                                                    onValueChange={setFullscreenRequired}
                                                    classNames={{
                                                        wrapper: "group-data-[selected=true]:bg-orange-500",
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-800">
                                                            Fullscreen Mode
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Assessment must run in fullscreen
                                                        </p>
                                                    </div>
                                                </Switch>

                                                <Switch
                                                    isSelected={detectTabSwitching}
                                                    onValueChange={setDetectTabSwitching}
                                                    classNames={{
                                                        wrapper: "group-data-[selected=true]:bg-orange-500",
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-slate-800">
                                                            Detect Tab Switching
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            Monitor when ward leaves the assessment tab
                                                        </p>
                                                    </div>
                                                </Switch>

                                                {detectTabSwitching && (
                                                    <Input
                                                        type="number"
                                                        label="Max Tab Switches Allowed"
                                                        variant="bordered"
                                                        value={maxTabSwitches}
                                                        onChange={(e) =>
                                                            setMaxTabSwitches(e.target.value)
                                                        }
                                                        min="0"
                                                        max="10"
                                                        description="0-10 tab switches before auto-submit"
                                                        classNames={{
                                                            inputWrapper:
                                                                "border-2 hover:border-orange-300",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        <Divider />

                                        {/* Auto-Submit */}
                                        <div className="bg-slate-50 p-6 rounded-xl">
                                            <Switch
                                                size="lg"
                                                isSelected={autoSubmit}
                                                onValueChange={setAutoSubmit}
                                                classNames={{
                                                    wrapper: "group-data-[selected=true]:bg-orange-500",
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-slate-800 text-lg">
                                                        Auto-Submit on Time Up
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        Automatically submit when time expires
                                                    </p>
                                                </div>
                                            </Switch>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button
                                                size="lg"
                                                color="warning"
                                                className="font-bold text-white"
                                                endContent={<FiArrowLeft className="rotate-180" />}
                                                onPress={() =>
                                                    setActiveTab("assign")
                                                }
                                            >
                                                Next: Assign
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>

                            {/* ASSIGN TAB */}
                            <Tab
                                key="assign"
                                title={
                                    <div className="flex items-center gap-2">
                                        <FiUsers />
                                        <span>Assign</span>
                                    </div>
                                }
                            >
                                <Card className="mt-6 border-none shadow-md">
                                    <CardBody className="p-8 space-y-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                                                <FiUsers className="text-blue-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg">
                                                    Select Wards
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    Who should take this assessment?
                                                </p>
                                            </div>
                                        </div>

                                        <Select
                                            label="Assign to Wards *"
                                            placeholder="Select one or more wards"
                                            selectionMode="multiple"
                                            variant="bordered"
                                            size="lg"
                                            isLoading={wardsLoading}
                                            selectedKeys={selectedWards}
                                            onSelectionChange={(keys) =>
                                                setSelectedWards(keys as Set<string>)
                                            }
                                            isMultiline={true}
                                            classNames={{
                                                trigger: "border-2 hover:border-blue-300 min-h-[60px]",
                                            }}
                                            renderValue={(items) => (
                                                <div className="flex flex-wrap gap-2 py-1">
                                                    {items.map((item) => (
                                                        <Chip
                                                            key={item.key}
                                                            size="sm"
                                                            className="bg-blue-100 text-blue-700 font-medium"
                                                        >
                                                            {item.textValue}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            )}
                                        >
                                            {(wardsData?.data || []).map((ward: any) => (
                                                <SelectItem key={ward.id} textValue={ward.full_name}>
                                                    <div className="flex items-center gap-3 py-2">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                                            {ward.full_name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{ward.full_name}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {ward.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Divider />

                                        {/* Scheduling */}
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-slate-800">Schedule</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    type="datetime-local"
                                                    label="Available From"
                                                    variant="bordered"
                                                    value={availableFrom}
                                                    onChange={(e) => setAvailableFrom(e.target.value)}
                                                    startContent={
                                                        <FiCalendar className="text-slate-400" />
                                                    }
                                                    description="When can wards start?"
                                                    classNames={{
                                                        inputWrapper:
                                                            "border-2 hover:border-blue-300",
                                                    }}
                                                />
                                                <Input
                                                    type="datetime-local"
                                                    label="Due Date"
                                                    variant="bordered"
                                                    value={dueDate}
                                                    onChange={(e) => setDueDate(e.target.value)}
                                                    startContent={
                                                        <FiCalendar className="text-slate-400" />
                                                    }
                                                    description="Deadline for completion"
                                                    classNames={{
                                                        inputWrapper:
                                                            "border-2 hover:border-blue-300",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-6">
                                            <Button
                                                size="lg"
                                                color="success"
                                                className="font-bold px-8 text-white"
                                                isLoading={
                                                    createAssessment.isPending
                                                }
                                                onPress={handleSubmit}
                                            >
                                                Create Challenge
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-none shadow-2xl">
                                <CardBody className="p-8 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
                                            <FiBook className="text-2xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Summary</h3>
                                            <p className="text-sm text-slate-400">
                                                Review before creating
                                            </p>
                                        </div>
                                    </div>

                                    <Divider className="bg-slate-700" />

                                    <div className="space-y-4 text-sm">
                                        <SummaryRow
                                            label="Subject"
                                            value={
                                                selectedSubject
                                                    ? subjectsData?.items?.find(
                                                        (s: any) => s.id === selectedSubject
                                                    )?.name || "—"
                                                    : "—"
                                            }
                                        />
                                        <SummaryRow
                                            label="Topics"
                                            value={`${selectedTopics.size} selected`}
                                        />
                                        <SummaryRow
                                            label="Questions"
                                            value={numberOfQuestions}
                                        />
                                        <SummaryRow
                                            label="Duration"
                                            value={`${duration} minutes`}
                                        />
                                        <SummaryRow
                                            label="Max Attempts"
                                            value={maxAttempts}
                                        />
                                        <SummaryRow
                                            label="Passing Score"
                                            value={`${passingPercentage}%`}
                                        />
                                        <SummaryRow
                                            label="Wards"
                                            value={`${selectedWards.size} assigned`}
                                        />
                                    </div>

                                    <Divider className="bg-slate-700" />

                                    {/* Feature Badges */}
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                            Enabled Features
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {enableProctoring && (
                                                <Chip
                                                    size="sm"
                                                    className="bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                                    startContent={<FiShield />}
                                                >
                                                    Proctoring
                                                </Chip>
                                            )}
                                            {autoSubmit && (
                                                <Chip
                                                    size="sm"
                                                    className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                                >
                                                    Auto-Submit
                                                </Chip>
                                            )}
                                            {shuffleQuestions && (
                                                <Chip
                                                    size="sm"
                                                    className="bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                                >
                                                    Shuffle
                                                </Chip>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg shadow-orange-900/50 hover:shadow-xl hover:shadow-orange-900/60 transition-all"
                                        startContent={<FiPlus className="text-xl" />}
                                        onPress={handleSubmit}
                                        isLoading={createAssessment.isPending}
                                    >
                                        Create Challenge
                                    </Button>

                                    <p className="text-xs text-slate-400 text-center">
                                        Wards will be notified immediately
                                    </p>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-slate-400">{label}</span>
            <span className="font-semibold text-white truncate max-w-[140px]">
                {value}
            </span>
        </div>
    );
}
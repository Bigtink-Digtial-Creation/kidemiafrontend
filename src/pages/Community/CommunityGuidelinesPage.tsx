import { useNavigate } from "react-router";
import {
    ArrowLeft,
    Heart,
    Shield,
    Users,
    MessageCircle,
    ThumbsUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    BookOpen,
    Award,
} from "lucide-react";
import { SidebarRoutes } from "../../routes";

export default function CommunityGuidelinesPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-kidemia-primary to-kidemia-secondary text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <button
                        onClick={() => navigate(SidebarRoutes.community)}
                        className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Community
                    </button>

                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold">Community Guidelines</h1>
                            <p className="text-white/90 mt-2">
                                Building a safe, respectful, and engaging learning environment
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Introduction */}
                <div className="mb-8">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <Heart className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Kidemia Community</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Our community is built on the principles of respect, kindness, and a shared passion for
                                learning. These guidelines help create a positive environment where everyone can learn,
                                share knowledge, and grow together.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                By participating in our community, you agree to follow these guidelines. Violations may
                                result in content removal, warnings, or account suspension.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Core Values */}
                <Section
                    icon={<Heart className="w-6 h-6 text-kidemia-primary" />}
                    title="Our Core Values"
                >
                    <ValueCard
                        icon={<Users className="w-5 h-5" />}
                        title="Respect"
                        description="Treat all community members with kindness and respect, regardless of their background or skill level."
                    />
                    <ValueCard
                        icon={<BookOpen className="w-5 h-5" />}
                        title="Learning First"
                        description="We're here to help each other learn and grow. Focus on educational content and constructive discussions."
                    />
                    <ValueCard
                        icon={<ThumbsUp className="w-5 h-5" />}
                        title="Helpfulness"
                        description="Share knowledge generously and support fellow learners with patience and encouragement."
                    />
                    <ValueCard
                        icon={<Award className="w-5 h-5" />}
                        title="Quality"
                        description="Contribute thoughtful, well-written content that adds value to the community."
                    />
                </Section>

                {/* Do's and Don'ts */}
                <Section
                    icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                    title="Do's and Don'ts"
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Do's */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                Please Do
                            </h3>
                            <ul className="space-y-3">
                                <DoItem text="Be respectful and kind to everyone" />
                                <DoItem text="Search before posting to avoid duplicates" />
                                <DoItem text="Use clear, descriptive titles for your posts" />
                                <DoItem text="Provide context and details in your questions" />
                                <DoItem text="Accept helpful answers and upvote quality content" />
                                <DoItem text="Use appropriate tags for better discovery" />
                                <DoItem text="Cite sources when sharing information" />
                                <DoItem text="Acknowledge and learn from corrections" />
                            </ul>
                        </div>

                        {/* Don'ts */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                                Please Don't
                            </h3>
                            <ul className="space-y-3">
                                <DontItem text="Post homework without showing your effort" />
                                <DontItem text="Share personal information publicly" />
                                <DontItem text="Use offensive or inappropriate language" />
                                <DontItem text="Spam or post duplicate content" />
                                <DontItem text="Harass, bully, or discriminate against others" />
                                <DontItem text="Share copyrighted content without permission" />
                                <DontItem text="Post off-topic or promotional content" />
                                <DontItem text="Create multiple accounts to manipulate votes" />
                            </ul>
                        </div>
                    </div>
                </Section>

                {/* Content Standards */}
                <Section
                    icon={<MessageCircle className="w-6 h-6 text-blue-600" />}
                    title="Content Standards"
                >
                    <StandardCard
                        title="Questions"
                        items={[
                            "Provide clear context and background information",
                            "Show what you've tried or researched",
                            "Be specific about what you need help with",
                            "Include relevant code, diagrams, or examples",
                            "Use proper formatting for readability",
                        ]}
                    />
                    <StandardCard
                        title="Answers & Replies"
                        items={[
                            "Ensure your answer is accurate and helpful",
                            "Explain your reasoning clearly",
                            "Provide sources or references when applicable",
                            "Be patient with follow-up questions",
                            "Update your answer if you find errors",
                        ]}
                    />
                    <StandardCard
                        title="Discussions"
                        items={[
                            "Stay on topic and add value to the conversation",
                            "Back up opinions with facts and reasoning",
                            "Listen to different perspectives respectfully",
                            "Avoid turning discussions into arguments",
                            "Keep language professional and constructive",
                        ]}
                    />
                </Section>

                {/* Reporting and Moderation */}
                <Section
                    icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
                    title="Reporting & Moderation"
                >
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">How to Report Issues</h3>
                        <p className="text-gray-700 mb-4">
                            If you see content that violates our guidelines, please report it using the flag icon (🚩)
                            on posts and replies. Our moderation team will review all reports promptly.
                        </p>
                        <div className="space-y-2">
                            <ReportReason reason="Spam or promotional content" />
                            <ReportReason reason="Harassment or bullying" />
                            <ReportReason reason="Inappropriate or offensive content" />
                            <ReportReason reason="Misinformation or harmful advice" />
                            <ReportReason reason="Copyright violation" />
                            <ReportReason reason="Personal information shared without consent" />
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Moderation Actions</h3>
                        <p className="text-gray-700 mb-4">Depending on the severity of the violation, we may:</p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>Remove the content and send a warning</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>Temporarily suspend posting privileges</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>Reduce reputation points</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>Permanently ban repeat offenders</span>
                            </li>
                        </ul>
                    </div>
                </Section>

                {/* Reputation System */}
                <Section
                    icon={<Award className="w-6 h-6 text-purple-600" />}
                    title="Reputation & Rewards"
                >
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Earn Reputation Points</h3>
                        <p className="text-gray-700 mb-4">
                            Build your reputation by being an active, helpful community member:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <ReputationItem action="Create a post" points="+5 points" />
                            <ReputationItem action="Reply to a post" points="+2 points" />
                            <ReputationItem action="Get an answer accepted" points="+15 points" />
                            <ReputationItem action="Receive an upvote" points="+1 point" />
                        </div>
                        <p className="text-gray-700 mt-4">
                            Higher reputation unlocks badges and recognition in the community!
                        </p>
                    </div>
                </Section>

                {/* Contact */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Questions About These Guidelines?</h3>
                    <p className="text-gray-700 mb-6">
                        If you have questions or need clarification, please reach out to our support team.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => navigate("/support")}
                            className="px-6 py-3 bg-kidemia-primary text-white rounded-lg hover:bg-kidemia-primary/90 transition-colors font-medium"
                        >
                            Contact Support
                        </button>
                        <button
                            onClick={() => navigate(SidebarRoutes.community)}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Back to Community
                        </button>
                    </div>
                </div>

                {/* Last Updated */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
            </div>
        </div>
    );
}

// Helper Components
interface SectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
    return (
        <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
                {icon}
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            <div className="space-y-6">{children}</div>
        </div>
    );
}

interface ValueCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
    return (
        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center text-kidemia-primary">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </div>
    );
}

function DoItem({ text }: { text: string }) {
    return (
        <li className="flex items-start text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>{text}</span>
        </li>
    );
}

function DontItem({ text }: { text: string }) {
    return (
        <li className="flex items-start text-gray-700">
            <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>{text}</span>
        </li>
    );
}

interface StandardCardProps {
    title: string;
    items: string[];
}

function StandardCard({ title, items }: StandardCardProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                        <span className="text-kidemia-primary mr-2">•</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ReportReason({ reason }: { reason: string }) {
    return (
        <div className="flex items-center text-gray-700">
            <AlertTriangle className="w-4 h-4 text-orange-600 mr-2 flex-shrink-0" />
            <span className="text-sm">{reason}</span>
        </div>
    );
}

function ReputationItem({ action, points }: { action: string; points: string }) {
    return (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="text-gray-700">{action}</span>
            <span className="text-purple-600 font-semibold">{points}</span>
        </div>
    );
}
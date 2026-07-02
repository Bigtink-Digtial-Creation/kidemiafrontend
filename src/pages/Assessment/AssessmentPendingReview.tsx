import { useNavigate } from "react-router";
import { Button, Card, CardBody } from "@heroui/react";
import { Clock3, Home } from "lucide-react";
import { SidebarRoutes } from "../../routes";

export default function AssessmentPendingReview() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
            <Card className="w-full max-w-lg text-center shadow-xl border-0 rounded-[2rem]">
                <CardBody className="p-10 space-y-5">
                    <div className="w-16 h-16 mx-auto bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                        <Clock3 size={30} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Submitted — Pending Review</h2>
                    <p className="text-slate-500 leading-relaxed">
                        Your responses have been recorded. This assessment includes questions
                        that require manual review, so your result isn't available yet.
                        You'll be notified once grading is complete.
                    </p>
                    <Button
                        size="lg"
                        className="mt-4 bg-kidemia-secondary text-white font-bold rounded-2xl px-8"
                        onPress={() => navigate(SidebarRoutes.dashboard)}
                        startContent={<Home size={18} />}
                    >
                        Back to Dashboard
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
}
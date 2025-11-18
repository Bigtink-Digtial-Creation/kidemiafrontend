import { useNavigate } from "react-router";
import { Button, Card, CardBody, Image } from "@heroui/react";
import { Home, LayoutDashboard } from "lucide-react";
import AppLogo from "../../assets/images/logo/appDarkLogo.png";
import { attemptResultAtom } from "../../store/test.atom";
import { useAtomValue } from "jotai";
// import { useResetAtom } from "jotai/utils";

const gradeRemarkMap: Record<string, string> = {
  A: "Excellent work!",
  B: "Good job!",
  C: "Fair performance, needs improvement",
  D: "Below average, study more",
  F: "Poor performance, try again",
};


export default function AssessmentResult() {
  const navigate = useNavigate();
  const result = useAtomValue(attemptResultAtom);
  // const resetAttempt = useResetAtom(attemptResultAtom);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#E8DCC4]">
        <Card className="w-full max-w-md text-center shadow-xl border-0">
          <CardBody className="p-8 space-y-4">
            <p className="text-lg font-medium text-[#2C3E50]">
              No assessment data found
            </p>
            <p className="text-sm text-[#5A6C7D]">
              Please complete an assessment first to view results
            </p>
            <Button
              className="mt-6 bg-[#D2691E] text-white hover:bg-[#C85A3C]"
              onClick={() => navigate("/")}
            >
              Go to Dashboard
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8DCC4]">
      <div className="bg-[#C85A3C] h-6 sm:h-8"></div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="max-w-5xl mx-auto flex flex-col items-center">

          <Image src={AppLogo} alt="Logo" width={100} className="mb-8 sm:mb-12" />

          <div className="flex flex-col items-center mb-8 sm:mb-12">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 mb-4 sm:mb-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 sm:-translate-y-2 w-2 sm:w-3 h-4 sm:h-6 bg-[#C85A3C] rounded-full"></div>

              <div
                className="w-40 h-40 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #D2691E, #C85A3C 40%, #A0472D 70%, #8B3A26)",
                }}
              >
                <span className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  {result.percentage}
                </span>
              </div>
            </div>

            <h2 className="text-xl mt-1 sm:text-2xl lg:text-3xl font-bold text-[#2C3E50] text-center px-4">
              You scored {result.score}/{result.total_questions} Overall
            </h2>
          </div>

          {/* Remark & Comment */}
          <div className="max-w-2xl w-full mb-8 sm:mb-12 px-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <span className="text-[#2C3E50] font-bold text-base sm:text-lg min-w-[100px] sm:min-w-[120px]">
                Remark:
              </span>
              <span className="text-[#5A6C7D] text-base sm:text-lg">{gradeRemarkMap[result.grade]}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <span className="text-[#2C3E50] font-bold text-base sm:text-lg min-w-[100px] sm:min-w-[120px]">
                Grade:
              </span>
              <span className="text-[#5A6C7D] text-base sm:text-lg">{result.grade}</span>
            </div>
          </div>


          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#D2691E] hover:bg-[#C85A3C] text-white font-semibold px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg transition-colors"
              onClick={() => navigate("/corrections")}
            >
              View Corrections
            </Button>

            <div className="flex gap-4 sm:gap-6">
              <Button
                size="lg"
                variant="light"
                className="text-[#2C3E50] hover:text-[#1a252f] font-semibold px-4 sm:px-6 py-5 sm:py-6 text-base sm:text-lg flex items-center gap-2 transition-colors"
                onClick={() => navigate("/")}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Home</span>
              </Button>

              <Button
                size="lg"
                variant="light"
                className="text-[#2C3E50] hover:text-[#1a252f] font-semibold px-4 sm:px-6 py-5 sm:py-6 text-base sm:text-lg flex items-center gap-2 transition-colors"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

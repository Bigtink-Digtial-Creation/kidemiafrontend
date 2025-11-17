import { useSetAtom } from "jotai";
import { useNavigate } from "react-router";
import { FaArrowRight, FaRegQuestionCircle } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoTimeOutline } from "react-icons/io5";
import { MdCreditScore } from "react-icons/md";
import { assessmentAtom } from "../../store/test.atom";

interface AssessmentCardI {
  id: string;
  title: string;
  code: string;
  timeMins: number;
  questionsNo: number;
  attemptsNo: number;
  priceNo: string;
  avgScore: string;
}

export default function AssessmentCard({
  id,
  title,
  code,
  timeMins,
  questionsNo,
  attemptsNo,
  priceNo,
  avgScore,
}: AssessmentCardI) {
  const navigate = useNavigate();
  const setAssessment = useSetAtom(assessmentAtom);

  const handlePracticeClick = () => {
    setAssessment({
      title,
      code,
      avgScore,
      timeMins,
      questionsNo,
    });
    navigate(`/assessment/intructions/${id}`);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="
          bg-amber-50/40
          border border-gray-300/40
          rounded-xl
          overflow-hidden
          shadow-sm
          hover:shadow-md
          transition-shadow
          duration-200
          flex
          flex-col
          h-full
        "
      >
        {/* Header Section */}
        <div className="p-4 sm:p-5 space-y-1.5">
          <h3 className="text-gray-900 font-semibold text-base sm:text-lg leading-snug line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="px-4 sm:px-5 pb-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm bg-white/50 rounded-lg px-3 py-2.5 border border-gray-200/50">
              <IoTimeOutline className="text-orange-500 text-base sm:text-lg flex-shrink-0" />
              <span className="text-gray-700 font-medium whitespace-nowrap">
                {timeMins} mins
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm bg-white/50 rounded-lg px-3 py-2.5 border border-gray-200/50">
              <FaRegQuestionCircle className="text-orange-500 text-base sm:text-lg flex-shrink-0" />
              <span className="text-gray-700 font-medium whitespace-nowrap">
                {questionsNo} Qs
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm bg-white/50 rounded-lg px-3 py-2.5 border border-gray-200/50">
              <FaRegCircleCheck className="text-orange-500 text-base sm:text-lg flex-shrink-0" />
              <span className="text-gray-700 font-medium whitespace-nowrap">
                {attemptsNo} tries
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm bg-white/50 rounded-lg px-3 py-2.5 border border-gray-200/50">
              <MdCreditScore className="text-orange-500 text-base sm:text-lg flex-shrink-0" />
              <span className="text-gray-700 font-medium whitespace-nowrap">
                {avgScore} avg
              </span>
            </div>
          </div>
        </div>

        {/* Footer with Price and Button */}
        <div className="mt-auto px-4 sm:px-5 pb-4 sm:pb-5">
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200/50">
            <p className="text-gray-600 font-semibold text-sm sm:text-base whitespace-nowrap">
              {priceNo} Units
            </p>

            <button
              onClick={handlePracticeClick}
              className="
                bg-orange-500
                hover:bg-orange-600
                active:bg-orange-700
                text-white
                font-semibold
                text-sm
                px-4
                py-2.5
                rounded-lg
                transition-colors
                duration-200
                flex
                items-center
                gap-2
                shadow-sm
                hover:shadow
                whitespace-nowrap
              "
            >
              Start
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

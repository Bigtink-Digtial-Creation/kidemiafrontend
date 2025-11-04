import  { useEffect, useState } from "react";
import { attemptResultAtom } from "../../store/test.atom";
import { useAtomValue } from "jotai";
import { Button, Card, CardBody, CardFooter, Chip } from "@heroui/react";
import { FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router";
import { SidebarRoutes } from "../../routes";
import confetti from "canvas-confetti";

export default function AssessmentResult() {
  const result = useAtomValue(attemptResultAtom);
  const navigate = useNavigate();
  const [hasTriggeredConfetti, setHasTriggeredConfetti] =
    useState<boolean>(false);

  // Trigger confetti once when result is loaded
  useEffect(() => {
    if (result && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);

      // confetti burst
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [result, hasTriggeredConfetti]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <p className="text-lg text-kidemia-grey font-medium">
          No attempt data found. Please complete an assessment first.
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-5xl w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-center items-center space-y-2 py-4">
        <h3 className="text-3xl text-kidemia-primary font-semibold">
          Congratulations
        </h3>
        <p className="text-kidemia-grey text-base">
          Below is your asseesment result
        </p>
      </div>
      <div>
        <Card
          shadow="none"
          className="border border-kidemia-grey/20 bg-kidemia-white"
        >
          <CardBody className="space-y-6 py-6 px-8">
            <div className="flex items-center justify-between flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-bold text-kidemia-black text-center">
                Assessment Result
              </h2>
              <div className="flex items-center gap-2 text-kidemia-grey/70 ">
                <p>Status</p>
                <Chip
                  variant="flat"
                  size="sm"
                  color="success"
                  className="text-xs font-bold capitalize"
                >
                  {result.status}
                </Chip>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">Attempt</p>
                  <p>#{result.attempt_number}</p>
                  <p>1</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">Grade</p>
                  <p className="capitalize">{result.grade}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">Score</p>
                  <p>{result.score}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">Percentage</p>
                  <p>{`${result.percentage}%`}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">
                    Correct Answers
                  </p>
                  <p>{result.correct_answers}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">
                    Incorrect Answers
                  </p>
                  <p>{result.incorrect_answers}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">
                    Partially Correct
                  </p>
                  <p>{result.partially_correct}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">
                    Total Questions
                  </p>
                  <p>{result.total_questions}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">
                    Points Earned
                  </p>
                  <p>{result.points_earned}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">
                    Points Possible
                  </p>
                  <p>{result.points_possible}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">
                    Time Spent (s)
                  </p>
                  {/* <p>{result.time_spent_seconds}</p> */}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiFileText className="w-4 h-4 text-kidemia-secondary" />
                <div className="space-y-1">
                  <p className="font-medium text-kidemia-black">
                    Certificate Issued
                  </p>
                  <p>{result.certificate_issued ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </CardBody>

          <CardFooter className="bg-kidemia-biege/10 border-t border-kidemia-grey/10 px-6 py-6">
            <div className="w-full flex justify-between items-center">
              <div>
                {result.certificate_url && (
                  <div className="text-center pt-4">
                    <a
                      href={result.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-yellow-500 text-white font-medium px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                    >
                      View Certificate
                    </a>
                  </div>
                )}
              </div>

              <Button
                className="bg-kidemia-secondary text-white font-semibold shadow-md hover:shadow-lg"
                size="md"
                radius="md"
                onPress={() => navigate(SidebarRoutes.dashboard)}
              >
                Dashboard
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

import { Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { AuthRoutes } from "../../routes";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Cta() {
  const navigate = useNavigate();

  return (
    <div className="py-12 px-4">
      <div className="relative flex flex-col justify-center items-center bg-kidemia-biege/25 rounded-3xl mx-auto max-w-screen-2xl h-[400px] px-4 md:px-20 py-6 md:py-12 gap-8 md:gap-12 overflow-hidden">
        <div className="space-y-3 py-4">
          <p className="text-kidemia-black text-base font-medium text-center">
            Join the Kidemia Train of Excellence
          </p>
          <h1 className="text-3xl md:text-5xl text-kidemia-secondary font-semibold text-center">
            Ready to Transform Learning?
          </h1>
          <p className="tracking-wide text-base md:text-lg text-kidemia-grey text-center px-2">
            Sign up today and join a smarter way to teach, learn, and grow.
          </p>
          <div className="py-4 flex justify-center items-center">
            <Button
              className="bg-kidemia-secondary text-kidemia-white font-bold"
              size="md"
              radius="sm"
              type="button"
              onPress={() => navigate(AuthRoutes.signup)}
              endContent={<FaLongArrowAltRight />}
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Avatar, AvatarGroup, Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { AuthRoutes, HomeRoutes } from "../../routes";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-evenly items-center mx-auto py-24 px-4 md:px-16 gap-6 bg-kidemia-biege/25">
      <div className="md:w-1/2 space-y-4">
        <h1 className="text-kidemia-secondary text-4xl md:text-[80px] font-semibold font-san text-center md:text-start tracking-wide">
          Learn, Monitor, and Teach, All in One Place.
        </h1>

        <p className="text-base px-6 md:px-0 text-kidemia-grey text-center md:text-justify tracking-wide">
          A modern education platform that connects students, guardians, and
          teachers for better learning outcomes.
        </p>

        <div className="py-4 flex justify-center md:justify-start items-center gap-3 md:gap-6">
          <Button
            className="bg-kidemia-secondary text-kidemia-white font-bold"
            size="md"
            radius="sm"
            type="button"
            onPress={() => navigate(AuthRoutes.signup)}
            endContent={<FaLongArrowAltRight />}
          >
            Get Started
          </Button>

          <Button
            className="bg-kidemia-biege border border-enita-black2 font-bold text-kidemia-primary"
            variant="faded"
            size="md"
            radius="sm"
            type="button"
            onPress={() => navigate(HomeRoutes.about)}
            endContent={<FaLongArrowAltRight />}
          >
            Learn More
          </Button>
        </div>

        <div>
          <AvatarGroup
            isBordered
            max={5}
            className="flex justify-center items-center md:justify-start w-full"
            renderCount={(count) => (
              <p className="text-sm text-kidemia-grey font-medium ms-2">
                +{count}k Active Student and Teachers around the Globe.{" "}
              </p>
            )}
            total={100}
          >
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
            <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
          </AvatarGroup>
        </div>
      </div>
      <div className="md:w-2/5">
        <img
          src="src/assets/images/hero.svg"
          alt="hero-image"
          className="w-full object-cover"
        />
      </div>
    </div>
  );
}

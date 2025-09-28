import { forGuardian, forStudents, forTeachers } from "../../staticData/home";
import { StepItem } from "../Cards/StepItem";

export default function Works() {
  return (
    <div className="mx-auto py-8 md:py-12 px-4 bg-kidemia-biege2">
      <div className="flex flex-col justify-center items-center space-y-2">
        <div className="bg-kidemia-white shadow-2xl text-kidemia-black border-kidemia-success border-[1px] inline-block px-4 py-1 rounded-full text-sm font-semibold">
          How It Works
        </div>
        <h3 className="text-2xl md:text-4xl font-bold  text-kidemia-grey/60 text-center tracking-wider max-w-2xl">
          Wheather you are a student, guardian or teacher,{" "}
          <span className="text-kidemia-primary underline">Kidemia</span> has
          something for you
        </h3>
      </div>
      <div className="py-12 space-y-32 md:px-24">
        {/* student */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-items-center items-center">
          <div>
            <div className="space-y-3">
              <h3 className="text-kidemia-grey/60 text-2xl font-semibold text-center md:text-justify">
                For Students
              </h3>

              {forStudents.map((step, index) => (
                <div key={step.id}>
                  <StepItem
                    id={step.id}
                    text={step.text}
                    description={step.description}
                    isLast={index === forStudents.length - 1}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="order-first md:order-last w-full md:w-1/2 aspect-[4/3]">
            <img
              src="src/assets/images/student.svg"
              alt="student"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* guardian */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-items-center items-center">
          <div className="w-full md:w-1/2 aspect-[4/3]">
            <img
              src="src/assets/images/parents.svg"
              alt="student"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="space-y-3">
              <h3 className="text-kidemia-grey/60 text-2xl  font-semibold text-center md:text-start  md:w-[328px]">
                For Guardians
              </h3>

              {forGuardian.map((step, index) => (
                <div key={step.id}>
                  <StepItem
                    id={step.id}
                    text={step.text}
                    description={step.description}
                    isLast={index === forGuardian.length - 1}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* tutor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-items-center items-center">
          <div>
            <div className="space-y-3">
              <h3 className="text-kidemia-grey/60 text-2xl font-semibold text-center md:text-justify">
                For Teachers
              </h3>
              {forTeachers.map((step, index) => (
                <div key={step.id}>
                  <StepItem
                    id={step.id}
                    text={step.text}
                    description={step.description}
                    isLast={index === forTeachers.length - 1}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="order-first md:order-last w-full md:w-1/2 aspect-[4/3]">
            <img
              src="src/assets/images/teacher.svg"
              alt="teacher"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Counter } from "../Cards/Counter";

export default function Numbers() {
  return (
    <div className="px-6 py-20 relative overflow-hidden bg-[#1C1C1C]- px-4- py-8- w-full- bg-kidemia-success/70- bg-kidemia-biege-">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center">
        <div className="space-y-2">
          <h3 className="text-5xl text-center font-bold border-t-[1px]  border-kidemia-secondary/30  py-4  text-kidemia-primary">
            <Counter to={111000} format="k+" />
          </h3>
          <p className="opacity-80 text-kidemia-grey font-medium max-w-[250px]">
            Exams and Tests Taken
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-5xl text-center font-bold border-t-[1px]  border-kidemia-secondary/30 py-4 text-kidemia-primary">
            <Counter to={80000} format="k+" />
          </h3>
          <p className="opacity-80 text-kidemia-grey font-medium max-w-[250px]">
            Subject Covered
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-5xl text-center font-bold border-t-[1px]  border-kidemia-secondary/30 py-4 text-kidemia-primary">
            <Counter to={120000} format="k+" />
          </h3>
          <p className="opacity-80 text-kidemia-grey font-medium max-w-[250px]">
            Students Reached
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-5xl text-center font-bold border-t-[1px]  border-kidemia-secondary/30 py-4 text-kidemia-primary">
            <Counter to={11000} format="k+" />
          </h3>
          <p className="opacity-80 text-kidemia-grey font-medium max-w-[250px]">
            Tutors Across the Globe
          </p>
        </div>
      </div>
    </div>
  );
}

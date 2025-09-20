import { TbClock12 } from "react-icons/tb";

export default function TestSubjectsPage() {
  return (
    <section className="py-4 space-y-6 md:px-12">
      <div className="space-y-3">
        <h2 className="text-2xl text-kidemia-black font-semibold text-center">
          Pick a subject you would love to write a test on
        </h2>
        <div className="flex justify-center items-center gap-1 text-base text-kidemia-grey text-center font-medium">
          <TbClock12 className="text-kidemia-secondary text-xl font-bold" />{" "}
          Time limit: 20mins
        </div>
      </div>

      <div className="py-6">
        cards here
      </div>
    </section>
  )
}

export default function Works() {
  return (
    <div className="mx-auto py-8 md:py-12 px-4 bg-kidemia-biege2">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold  text-kidemia-black text-center">
          How It Works
        </h3>
        <p className="text-kidemia-grey/60 text-base text-center">
          Wheather you are a student, guardian or teacher, Kidemia has something
          for you
        </p>
      </div>
      <div className="py-8 space-y-6 md:px-24">
        {/* student */}
        <div className="flex flex-col md:flex-row justify-evenly items-center">
          <div>
            <div className="space-y-3">
              <h3 className="text-kidemia-primary text-2xl  font-medium text-center md:text-justify">
                For Students
              </h3>
              <ul className="list-decimal list-inside space-y-3">
                <li className="text-kidemia-black font-medium">
                  Take interactive exams and tests online.
                </li>
                <li className="text-kidemia-black font-medium">
                  Receive instant grades and feedback.
                </li>
                <li className="text-kidemia-black font-medium">
                  Track your learning progress over time.
                </li>
              </ul>
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
        <div className="flex flex-col md:flex-row justify-between- justify-evenly items-center">
          <div className="w-full md:w-1/2 aspect-[4/3]">
            <img
              src="src/assets/images/parents.svg"
              alt="student"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="space-y-3">
              <h3 className="text-kidemia-primary text-2xl  font-medium text-center md:text-start  md:w-[328px]">
                For Guardians
              </h3>
              <ul className="list-decimal list-inside space-y-3">
                <li className="text-kidemia-black font-medium">
                  Monitor your child's academic performance.
                </li>
                <li className="text-kidemia-black font-medium">
                  View progress reports and grading history.
                </li>
                <li className="text-kidemia-black font-medium">
                  Stay connected with teachers for feedback.
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* tutor */}
        <div className="flex flex-col md:flex-row justify-evenly items-center">
          <div>
            <div className="space-y-3">
              <h3 className="text-kidemia-primary text-2xl font-medium text-center md:text-justify">
                For Teachers
              </h3>
              <ul className="list-decimal list-inside space-y-3">
                <li className="text-kidemia-black font-medium">
                  Upload and manage test questions with ease.
                </li>
                <li className="text-kidemia-black font-medium">
                  Grade student submissions quickly.
                </li>
                <li className="text-kidemia-black font-medium">
                  Track class performance and provide support.
                </li>
              </ul>
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

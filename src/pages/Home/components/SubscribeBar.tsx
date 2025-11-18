export default function SubscribeBar() {
  return (
    <section className="bg-[#FFF3DB] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-xl md:text-2xl font-bold text-[#0a1f35]">
              Join the Kidees Community!
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              Connect with other parents and educators — get tips together
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <input
              className="flex-1 md:w-[320px] px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#1e88a8] focus:outline-none text-sm"
              placeholder="Enter email address"
              type="email"
            />
            <button className="px-4 py-3 bg-[#0a1f35] text-white rounded-lg font-semibold text-sm hover:bg-[#0d2842] transition whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

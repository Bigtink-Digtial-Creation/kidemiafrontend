import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { FcGoogle } from "react-icons/fc";

type Billing = "monthly" | "annual";

export default function SubscriptionPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const search = new URLSearchParams(location.search);
  const billing = (search.get("billing") as Billing) || "annual";

  const planName = id ? id.replace(/-/g, " ") : "Student";

  // dynamic derived values
  const price = billing === "annual" ? "₦2100" : "₦500";
  const period = billing === "annual" ? "per annum" : "per month";
  const features = [
    "Unlimited Subjects",
    "10 Tests per Month",
    "One-time leaderboard access",
  ];

  // simple auth stub: store user in localStorage
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const isAuthenticated = !!localStorage.getItem("kidemia_user");

  useEffect(() => {
    // if user is authenticated, you may choose to redirect to payment provider immediately
    // For this demo, we simply keep them on page and show the form replaced by a "Continue to payment" button
  }, [isAuthenticated]);

  // const redirectBack = search.get("redirect") || location.pathname + location.search;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // small validation
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    // simulate API register
    setTimeout(() => {
      localStorage.setItem(
        "kidemia_user",
        JSON.stringify({ name: form.name, email: form.email }),
      );
      setLoading(false);
      // after registration, redirect back to checkout URL (if provided)
      // we keep the current URL in the redirect query param during navigation from the PricingCard
      // but if not present we default to the same page
      const redirectTo =
        search.get("redirect") || `/checkout/${id}/plan?billing=${billing}`;
      navigate(redirectTo);
    }, 900);
  };

  const handleGoogle = () => {
    // simulate OAuth login
    localStorage.setItem(
      "kidemia_user",
      JSON.stringify({ name: "Google User", email: "google@example.com" }),
    );
    // Redirect back to checkout (if redirect param given)
    const redirectTo =
      search.get("redirect") || `/checkout/${id}/plan?billing=${billing}`;
    navigate(redirectTo);
  };

  const handleContinueToPayment = () => {
    // Here you would call your backend to create a checkout session
    // For this demo we will just alert and simulate redirect to payment provider
    alert(
      `Creating checkout session for ${planName} (${billing}) — price: ${price}`,
    );
    // example: window.location.href = checkoutSessionUrl
  };

  const handleLogout = () => {
    localStorage.removeItem("kidemia_user");
    // keep user on page
    navigate(location.pathname + location.search);
  };

  return (
    <div className="min-h-screen w-full bg-[#07182C] text-white flex flex-col items-center px-4 py-10">
      {/* App logo placeholder: replace with <Image> from your design system if needed */}
      <div className="h-20 mb-10 flex items-center justify-center">
        <div className="w-36 h-12 bg-white/5 rounded flex items-center justify-center text-xl font-bold">
          KIDEMIA
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Pricing Card */}
        <div className="bg-[#07182C] border border-white/10 rounded-3xl p-6 shadow-xl col-span-1">
          <h3 className="text-2xl font-semibold">
            <span className="text-[#FF8C22]">{planName}</span> Plan
          </h3>

          {/* Toggle (readonly - reflects billing query) */}
          <div className="flex items-center mt-6 bg-white/5 p-1 rounded-full w-max">
            <div
              className={`px-4 py-1 rounded-full text-xs ${billing === "monthly" ? "opacity-100 text-white" : "opacity-60 text-gray-300"}`}
            >
              Monthly
            </div>
            <div
              className={`px-4 py-1 rounded-full text-xs flex items-center gap-2 ${billing === "annual" ? "bg-white/20 backdrop-blur-md font-semibold scale-105 text-white" : "opacity-60 text-gray-300"}`}
            >
              Annual
              {billing === "annual" && (
                <span className="text-[10px] bg-[#1cc557] text-black px-2 py-0.5 rounded-full">
                  20% off
                </span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-5xl font-bold">{price}</span>
            <div className="h-8 w-px bg-white/20"></div>
            <span className="text-sm italic opacity-70">{period}</span>
          </div>
        </div>

        {/* Features */}
        <div className="col-span-1 flex flex-col justify-start pt-4">
          <h4 className="text-xl font-semibold mb-4">Features:</h4>

          <ul className="space-y-4 text-sm">
            {features.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span>{item}</span>
                <span className="bg-[#1cc557] rounded-full h-5 w-5 flex items-center justify-center text-[10px] text-black font-bold">
                  ✓
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Other Plans */}
        <div className="col-span-1 flex flex-col gap-4 pt-4">
          <h4 className="text-xl font-semibold mb-2">Other Plans:</h4>

          {["Sibling", "Family"].map((plan) => (
            <div
              key={plan}
              className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex items-center justify-between"
            >
              <span className="text-[#FF8C22] font-medium">{plan} Plan</span>
              <span className="text-sm">₦2100 | per month</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full max-w-4xl border-t border-white/10 my-10" />

      {/* Subscription Message */}
      <div className="text-center mb-7">
        <h3 className="text-lg font-semibold">
          You are about to Subscribe to the{" "}
          {billing === "annual" ? "Annual" : "Monthly"} {planName} Plan
        </h3>
        <p className="text-sm opacity-70 mt-1">
          Your subscription would begin once you sign up
        </p>
      </div>

      {/* Auth Section */}
      <div className="w-full max-w-md">
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="text-center text-sm opacity-80">
              You are signed in.
            </div>
            <button
              onClick={handleContinueToPayment}
              className="w-full bg-[#2AA2A0] py-3 rounded-xl font-medium text-sm transition"
            >
              Continue to Payment
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-white/5 border border-white/10 py-3 rounded-xl text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleGoogle}
              className="w-full bg-white text-black py-3 rounded-full flex items-center justify-center gap-2 text-sm font-medium"
            >
              <FcGoogle size={22} /> Continue with Google
            </button>

            <div className="text-center my-5 opacity-60">OR</div>

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                type="text"
                placeholder="Name"
                className="w-full bg-white/5 border border-white/10 py-3 px-4 rounded-xl text-sm focus:outline-none"
              />

              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 py-3 px-4 rounded-xl text-sm focus:outline-none"
              />

              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 py-3 px-4 rounded-xl text-sm focus:outline-none"
              />

              <input
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-white/5 border border-white/10 py-3 px-4 rounded-xl text-sm focus:outline-none"
              />

              <p className="text-xs opacity-70 text-center leading-relaxed">
                By signing up you agree to all our{" "}
                <span className="underline">Terms of Use</span> and{" "}
                <span className="underline">Privacy Policy</span>
              </p>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-[#2AA2A0] hover:bg-[#1e8d8b] py-3 rounded-xl font-medium text-sm transition"
              >
                {loading ? "Processing..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-sm mt-4 opacity-80">
              Already have an account?{" "}
              <span
                className="font-semibold underline cursor-pointer"
                onClick={() =>
                  navigate(
                    `/login?redirect=${encodeURIComponent(`/checkout/${id}/plan?billing=${billing}`)}`,
                  )
                }
              >
                LOGIN
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

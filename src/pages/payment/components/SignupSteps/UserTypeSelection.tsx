import { FcGoogle } from "react-icons/fc";
import type { UserType } from "../../../../sdk/generated";

interface UserTypeSelectionProps {
  onSelectUserType: (type: UserType) => void;
  onGoogleSignup: () => void;
  onSwitchToLogin: () => void;
  planId: string;
  billing: string;
}

export default function UserTypeSelection({
  onSelectUserType,
  onGoogleSignup,
  onSwitchToLogin,
}: UserTypeSelectionProps) {
  return (
    <div className="space-y-6">
      <h4 className="text-xl font-semibold text-center mb-6">I am a...</h4>

      <button
        onClick={() => onSelectUserType("student")}
        className="w-full bg-white/5 border-2 border-white/10 hover:border-[#FF8C22] hover:bg-white/10 py-6 rounded-2xl transition group"
      >
        <div className="text-4xl mb-2">🎓</div>
        <div className="text-lg font-semibold group-hover:text-[#FF8C22]">Student</div>
        <div className="text-sm opacity-70 mt-1">I'm learning on my own</div>
      </button>

      <button
        onClick={() => onSelectUserType("guardian")}
        className="w-full bg-white/5 border-2 border-white/10 hover:border-[#FF8C22] hover:bg-white/10 py-6 rounded-2xl transition group"
      >
        <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
        <div className="text-lg font-semibold group-hover:text-[#FF8C22]">Parent/Guardian</div>
        <div className="text-sm opacity-70 mt-1">Subscribing for my child</div>
      </button>

      <button
        onClick={() => onSelectUserType("institution_admin")}
        className="w-full bg-white/5 border-2 border-white/10 hover:border-[#FF8C22] hover:bg-white/10 py-6 rounded-2xl transition group"
      >
        <div className="text-4xl mb-2">🏫</div>
        <div className="text-lg font-semibold group-hover:text-[#FF8C22]">Institution</div>
        <div className="text-sm opacity-70 mt-1">School or educational organization</div>
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#07182C] text-white/60">OR</span>
        </div>
      </div>

      <button
        onClick={onGoogleSignup}
        className="hidden w-full bg-white text-black hover:bg-gray-100 py-4 rounded-xl flex items-center justify-center gap-3 text-base font-semibold transition shadow-lg"
      >
        <FcGoogle size={24} /> Continue with Google
      </button>

      <p className="text-center text-sm mt-6 opacity-80">
        Already have an account?{" "}
        <span
          className="font-semibold text-[#FF8C22] underline cursor-pointer hover:text-[#ff9d3d]"
          onClick={onSwitchToLogin}
        >
          LOGIN
        </span>
      </p>
    </div>
  );
}
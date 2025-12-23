import React from "react";
import type { UserType } from "../../../../sdk/generated";

interface FinalConfirmationProps {
    signupForm: any;
    setSignupForm: (form: any) => void;
    selectedUserType: UserType | null;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export default function FinalConfirmation({
    signupForm,
    setSignupForm,
    selectedUserType,
    onSubmit,
    onBack,
    isSubmitting,
}: FinalConfirmationProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-[#FF8C22] hover:underline text-sm"
                    >
                        ← Back
                    </button>
                </div>
                <h4 className="text-xl font-semibold">Almost Done!</h4>
                <p className="text-sm opacity-70">Step 4 of 4</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="opacity-70">Name:</span>
                    <span className="font-medium">
                        {signupForm.first_name} {signupForm.last_name}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="opacity-70">Email:</span>
                    <span className="font-medium">{signupForm.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="opacity-70">Account Type:</span>
                    <span className="font-medium capitalize">{selectedUserType}</span>
                </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={signupForm.agreeTerms}
                    onChange={(e) =>
                        setSignupForm({ ...signupForm, agreeTerms: e.target.checked })
                    }
                    className="mt-1 h-5 w-5 rounded border-white/10 bg-white/5 text-[#2AA2A0] focus:ring-2 focus:ring-[#2AA2A0] focus:ring-offset-0"
                    required
                />
                <span className="text-xs opacity-80 leading-relaxed">
                    I agree to Kidemia's{" "}
                    <span className="text-[#FF8C22] underline">Terms of Service</span> and{" "}
                    <span className="text-[#FF8C22] underline">Privacy Policy</span>
                </span>
            </label>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#2AA2A0] to-[#1e8d8b] hover:from-[#1e8d8b] hover:to-[#2AA2A0] py-4 rounded-xl font-semibold text-base transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Creating Account..." : "Complete Sign Up"}
            </button>
        </form>
    );
}
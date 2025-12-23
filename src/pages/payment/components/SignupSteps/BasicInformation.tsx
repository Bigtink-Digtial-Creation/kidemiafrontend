import React from "react";

interface BasicInformationProps {
    signupForm: any;
    setSignupForm: (form: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export default function BasicInformation({
    signupForm,
    setSignupForm,
    onSubmit,
    onBack,
}: BasicInformationProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
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
                <h4 className="text-xl font-semibold">Basic Information</h4>
                <p className="text-sm opacity-70">Step 2 of 4</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input
                    value={signupForm.first_name}
                    onChange={(e) => setSignupForm({ ...signupForm, first_name: e.target.value })}
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                    required
                />
                <input
                    value={signupForm.last_name}
                    onChange={(e) => setSignupForm({ ...signupForm, last_name: e.target.value })}
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                    required
                />
            </div>

            <input
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                required
            />

            <input
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                type="password"
                placeholder="Password (min. 8 characters)"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                required
                minLength={8}
            />

            <input
                value={signupForm.confirm}
                onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })}
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                required
            />

            <button
                type="submit"
                className="w-full bg-[#2AA2A0] hover:bg-[#1e8d8b] py-3 rounded-xl font-medium text-sm transition mt-6"
            >
                Continue
            </button>
        </form>
    );
}
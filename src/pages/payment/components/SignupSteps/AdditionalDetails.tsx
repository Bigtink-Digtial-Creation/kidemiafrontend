import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiSDK } from "../../../../sdk";
import type { CategoryConfigResponse, UserType } from "../../../../sdk/generated";

interface AdditionalDetailsProps {
    signupForm: any;
    setSignupForm: (form: any) => void;
    selectedUserType: UserType | null;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export default function AdditionalDetails({
    signupForm,
    setSignupForm,
    selectedUserType,
    onSubmit,
    onBack,
}: AdditionalDetailsProps) {
    // Fetch exam categories for students
    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
    } = useQuery({
        queryKey: ["exam-categories"],
        queryFn: async () => {
            return ApiSDK.AssessmentCategoriesService.getCategoryConfigsApiV1CategoriesGet();
        },
        enabled: selectedUserType === "student",
    });

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
                <h4 className="text-xl font-semibold">Additional Details</h4>
                <p className="text-sm opacity-70">Step 3 of 4</p>
            </div>

            {selectedUserType === "student" && (
                <>
                    <div>
                        <label className="text-sm opacity-70 block mb-2">
                            What exam are you preparing for?
                        </label>
                        {isCategoriesLoading ? (
                            <div className="w-full bg-white/5 border border-white/10 py-3 px-4 rounded-xl text-sm text-center">
                                Loading exam options...
                            </div>
                        ) : (
                            <select
                                value={signupForm.studentCategory}
                                onChange={(e) => setSignupForm({ ...signupForm, studentCategory: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                                required
                            >
                                <option value="">Select Exam</option>
                                {categoriesData?.map((category: CategoryConfigResponse) => (
                                    <option key={category.id} value={category.id}>
                                        {category.display_name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="text-sm opacity-70 block mb-2">
                            Guardian's Email (Optional)
                        </label>
                        <input
                            value={signupForm.guardianEmail}
                            onChange={(e) => setSignupForm({ ...signupForm, guardianEmail: e.target.value })}
                            type="email"
                            placeholder="guardian@example.com"
                            className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                        />
                        <p className="text-xs opacity-60 mt-1">
                            Your guardian will receive updates about your progress
                        </p>
                    </div>
                </>
            )}

            {selectedUserType === "guardian" && (
                <>
                    <input
                        value={signupForm.guardianEmail}
                        onChange={(e) => setSignupForm({ ...signupForm, guardianEmail: e.target.value })}
                        type="email"
                        placeholder="Your Email"
                        className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                        required
                    />
                    <p className="text-xs opacity-70 mt-2">
                        You'll receive updates about your child's learning progress
                    </p>
                </>
            )}

            {selectedUserType === "institution_admin" && (
                <>
                    <input
                        value={signupForm.institutionName}
                        onChange={(e) => setSignupForm({ ...signupForm, institutionName: e.target.value })}
                        type="text"
                        placeholder="Institution Name"
                        className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                        required
                    />

                    <input
                        value={signupForm.institutionAddress}
                        onChange={(e) => setSignupForm({ ...signupForm, institutionAddress: e.target.value })}
                        type="text"
                        placeholder="Institution Address"
                        className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                        required
                    />

                    <input
                        value={signupForm.institutionContact}
                        onChange={(e) => setSignupForm({ ...signupForm, institutionContact: e.target.value })}
                        type="tel"
                        placeholder="Contact Number"
                        className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 px-4 rounded-xl text-sm focus:outline-none transition"
                        required
                    />
                    <p className="text-xs opacity-70 mt-2">
                        Note: Institution registration is currently being set up. We'll contact you shortly.
                    </p>
                </>
            )}

            <button
                type="submit"
                className="w-full bg-[#2AA2A0] hover:bg-[#1e8d8b] py-3 rounded-xl font-medium text-sm transition mt-6"
            >
                Continue
            </button>
        </form>
    );
}
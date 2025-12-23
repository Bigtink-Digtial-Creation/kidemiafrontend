import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { ApiSDK } from "../../../sdk";
import { apiErrorParser } from "../../../utils/errorParser";
import type { RegisterRequest, UserType } from "../../../sdk/generated";
import UserTypeSelection from "./SignupSteps/UserTypeSelection";
import BasicInformation from "./SignupSteps/BasicInformation";
import AdditionalDetails from "./SignupSteps/AdditionalDetails";
import FinalConfirmation from "./SignupSteps/FinalConfirmation";



type SignupStep = 1 | 2 | 3 | 4;

interface SignupFlowProps {
    onSuccess: () => void;
    onSwitchToLogin: () => void;
    planId: string;
    billing: "monthly" | "annual";
}

export default function SignupFlow({
    onSuccess,
    onSwitchToLogin,
    planId,
    billing,
}: SignupFlowProps) {
    const [currentStep, setCurrentStep] = useState<SignupStep>(1);
    const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
    const [signupForm, setSignupForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm: "",
        studentCategory: "",
        guardianEmail: "",
        institutionName: "",
        institutionAddress: "",
        institutionContact: "",
        agreeTerms: false,
    });

    // Registration mutation
    const signupMutation = useMutation({
        mutationFn: (formData: RegisterRequest) =>
            ApiSDK.AuthenticationService.registerApiV1AuthRegisterPost(formData),
        onSuccess(data) {
            if (data) {
                addToast({
                    title: data?.message || "Account created successfully!",
                    description: "Please login to continue",
                    color: "success",
                });
                onSuccess();
            }
        },
        onError(error) {
            const parsedError = apiErrorParser(error);
            addToast({
                title: "Registration Failed",
                description: parsedError.message,
                color: "danger",
            });
        },
    });

    const handleUserTypeSelect = (type: UserType) => {
        setSelectedUserType(type);
        setCurrentStep(2);
    };

    const handleGoogleSignup = () => {
        addToast({
            title: "Coming Soon",
            description: "Google sign up will be available soon",
            color: "primary",
        });
    };

    const handleStepSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep === 2) {
            // Validate basic info
            if (!signupForm.first_name || !signupForm.last_name || !signupForm.email || !signupForm.password) {
                addToast({
                    title: "Missing Information",
                    description: "Please fill in all required fields",
                    color: "warning",
                });
                return;
            }
            if (signupForm.password !== signupForm.confirm) {
                addToast({
                    title: "Password Mismatch",
                    description: "Passwords do not match",
                    color: "danger",
                });
                return;
            }
            if (signupForm.password.length < 8) {
                addToast({
                    title: "Weak Password",
                    description: "Password must be at least 8 characters long",
                    color: "warning",
                });
                return;
            }
            setCurrentStep(3);
        } else if (currentStep === 3) {
            // Validate user-specific info
            if (selectedUserType === "student" && !signupForm.studentCategory) {
                addToast({
                    title: "Missing Information",
                    description: "Please select the exam you are preparing for",
                    color: "warning",
                });
                return;
            }
            if (selectedUserType === "guardian" && !signupForm.guardianEmail) {
                addToast({
                    title: "Missing Information",
                    description: "Please provide your contact information",
                    color: "warning",
                });
                return;
            }
            if (selectedUserType === "institution_admin" && (!signupForm.institutionName || !signupForm.institutionAddress)) {
                addToast({
                    title: "Missing Information",
                    description: "Please fill in all institution details",
                    color: "warning",
                });
                return;
            }
            setCurrentStep(4);
        } else if (currentStep === 4) {
            // Final step - complete signup
            if (!signupForm.agreeTerms) {
                addToast({
                    title: "Terms Required",
                    description: "Please agree to the terms and conditions",
                    color: "warning",
                });
                return;
            }
            completeSignup();
        }
    };

    const completeSignup = () => {
        const payload: RegisterRequest = {
            email: signupForm.email,
            password: signupForm.password,
            first_name: signupForm.first_name,
            last_name: signupForm.last_name,
            user_type: selectedUserType as UserType,
            category: selectedUserType === "student" ? signupForm.studentCategory : null,
            guardian_email: selectedUserType === "student" ? signupForm.guardianEmail || null : null,
            school_name: selectedUserType === "institution_admin" ? signupForm.institutionName : null,
            admin_email: selectedUserType === "guardian" ? signupForm.email : null,
            middle_name: null,
            phone_number: selectedUserType === "institution_admin" ? signupForm.institutionContact : null,
            date_of_birth: null,
            username: null,
        };

        signupMutation.mutate(payload);
    };

    return (
        <div className="max-w-md mx-auto">
            {currentStep === 1 && (
                <UserTypeSelection
                    onSelectUserType={handleUserTypeSelect}
                    onGoogleSignup={handleGoogleSignup}
                    onSwitchToLogin={onSwitchToLogin}
                    planId={planId}
                    billing={billing}
                />
            )}

            {currentStep === 2 && (
                <BasicInformation
                    signupForm={signupForm}
                    setSignupForm={setSignupForm}
                    onSubmit={handleStepSubmit}
                    onBack={() => setCurrentStep(1)}
                />
            )}

            {currentStep === 3 && (
                <AdditionalDetails
                    signupForm={signupForm}
                    setSignupForm={setSignupForm}
                    selectedUserType={selectedUserType}
                    onSubmit={handleStepSubmit}
                    onBack={() => setCurrentStep(2)}
                />
            )}

            {currentStep === 4 && (
                <FinalConfirmation
                    signupForm={signupForm}
                    setSignupForm={setSignupForm}
                    selectedUserType={selectedUserType}
                    onSubmit={handleStepSubmit}
                    onBack={() => setCurrentStep(3)}
                    isSubmitting={signupMutation.isPending}
                />
            )}
        </div>
    );
}
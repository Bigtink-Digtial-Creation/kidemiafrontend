import React, { useState } from "react";
import { useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineEmail } from "react-icons/md";
import { BiScan } from "react-icons/bi";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { ApiSDK } from "../../../sdk";
import { apiErrorParser } from "../../../utils/errorParser";
import {
    loggedinUserAtom,
    storedAuthTokenAtom,
    userRoleAtom,
} from "../../../store/user.atom";
import type { LoginRequest } from "../../../sdk/generated";

interface LoginFormProps {
    onSuccess: () => void;
    onBackToSignup: () => void;
}

export default function LoginForm({ onSuccess, onBackToSignup }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const setStoredToken = useSetAtom(storedAuthTokenAtom);
    const setLoggedInUser = useSetAtom(loggedinUserAtom);
    const setRole = useSetAtom(userRoleAtom);

    const loginMutation = useMutation({
        mutationFn: (formData: LoginRequest) =>
            ApiSDK.AuthenticationService.loginApiV1AuthLoginPost(formData),
        onSuccess(data) {
            if (data) {
                const token = data.access_token;
                ApiSDK.OpenAPI.TOKEN = token;
                setStoredToken(token);
                setLoggedInUser(data);
                setRole(data.user?.roles?.[0].name ?? null);
                onSuccess();
            }
        },
        onError(error) {
            const parsedError = apiErrorParser(error);
            addToast({
                title: "Login Failed",
                description: parsedError.message,
                color: "danger",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            addToast({
                title: "Missing Information",
                description: "Please fill in all fields",
                color: "warning",
            });
            return;
        }

        loginMutation.mutate({ email, password, remember_me: false });
    };

    const handleGoogleLogin = () => {
        addToast({
            title: "Coming Soon",
            description: "Google login will be available soon",
            color: "primary",
        });
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="mb-6">
                <button
                    type="button"
                    onClick={onBackToSignup}
                    className="text-[#FF8C22] hover:underline text-sm mb-4"
                >
                    ← Back to Sign Up
                </button>
                <h4 className="text-xl font-semibold">Welcome Back</h4>
                <p className="text-sm opacity-70">Login to continue with your subscription</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <MdOutlineEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF8C22] text-xl" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 pl-12 pr-4 rounded-xl text-sm focus:outline-none transition"
                        required
                        disabled={loginMutation.isPending}
                    />
                </div>

                <div className="relative">
                    <BiScan className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF8C22] text-xl" />
                    <input
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-white/5 border border-white/10 focus:border-[#FF8C22]/50 py-3 pl-12 pr-12 rounded-xl text-sm focus:outline-none transition"
                        required
                        disabled={loginMutation.isPending}
                    />
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FF8C22] text-xl"
                    >
                        {isVisible ? <FaEyeSlash /> : <FaRegEye />}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-[#2AA2A0] hover:bg-[#1e8d8b] py-3 rounded-xl font-medium text-sm transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#07182C] text-white/60">OR</span>
                </div>
            </div>

            <button
                onClick={handleGoogleLogin}
                disabled={loginMutation.isPending}
                className="w-full bg-white text-black hover:bg-gray-100 py-4 rounded-xl flex items-center justify-center gap-3 text-base font-semibold transition shadow-lg disabled:opacity-50"
            >
                <FcGoogle size={24} /> Continue with Google
            </button>
        </div>
    );
}
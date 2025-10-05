import { atom } from "jotai";

export type SignUpInfoT = "STEPONE" | "STEPTWO" | "STEPTHREE" | "STEPFOUR";

export const signupInfoStep = atom<SignUpInfoT>("STEPONE");

export const signupFormData = atom({
  stepOne: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  stepTwo: {
    role: "",
  },
  stepThree: {
    examOrSchool: "",
  },
  stepFour: {
    guardianOrAdminEmail: "",
  },
});

import {
  partnerOne,
  partnerTwo,
  partnerThree,
  partnerFour,
  partnerFive,
} from "../assets/images";

export interface Partner {
  name: string;
  logo: string;
}
export const partners: Partner[] = [
  {
    name: "EstaPort Primary School",
    logo: partnerOne,
  },
  {
    name: "Firefly Academy",
    logo: partnerTwo,
  },
  {
    name: "GreenSprings School",
    logo: partnerThree,
  },

  {
    name: "Temple School",
    logo: partnerFour,
  },
  {
    name: "Honeyland School",
    logo: partnerFive,
  },
  {
    name: "EstaPort Primary School",
    logo: partnerOne,
  },
  {
    name: "Firefly Academy",
    logo: partnerTwo,
  },
  {
    name: "GreenSprings School",
    logo: partnerThree,
  },
];

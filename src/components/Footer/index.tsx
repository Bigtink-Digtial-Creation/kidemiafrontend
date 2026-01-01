import { Image } from "@heroui/react";
import AppImage from "../AppImage";
import {
  AppLogo,
  ApplePlayLogo,
  GooglePlayLogo,
  FooterMap,
} from "../../assets/images";
import { Link } from "react-router";
import { HomeRoutes } from "../../routes";

export default function Footer() {
  return (
    <footer
      className="bg-[#08192d] text-white py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(8, 25, 45, 0.9), rgba(8, 25, 45, 0.9)), url(${FooterMap})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src={AppLogo} alt="logo" width={80} />
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              A smarter way to teach, learn, and grow.
            </p>
          </div>

          <div>
            <h6 className="font-bold text-base mb-3">Company</h6>
            <ul className="text-sm opacity-80 space-y-2">
              <li className="hover:opacity-100 cursor-pointer">About</li>
              <li className="hover:opacity-100 cursor-pointer">Careers</li>
              <li className="hover:opacity-100 cursor-pointer">Help Center</li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold text-base mb-3">Support</h6>
            <ul className="text-sm opacity-80 space-y-2">
              <li>
                <Link
                  to={HomeRoutes.faq}
                  className="hover:opacity-100 transition-opacity"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to={HomeRoutes.terms}
                  className="hover:opacity-100 transition-opacity"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to={HomeRoutes.privacy}
                  className="hover:opacity-100 transition-opacity"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to={HomeRoutes.refund}
                  className="hover:opacity-100 transition-opacity"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>


          <div>
            <h6 className="font-bold text-base mb-3">Get the app</h6>
            <div className="flex gap-3">
              <div className="w-32 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer transition">
                <AppImage
                  src={ApplePlayLogo}
                  alt={"apple play"}
                  className="max-h-16 object-contain opacity-70 hover:opacity-100 transition"
                />
              </div>
              <div className="w-32 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer transition">
                <AppImage
                  src={GooglePlayLogo}
                  alt={"Google Play"}
                  className="max-h-16 object-contain opacity-70 hover:opacity-100 transition"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-sm opacity-70">
          © {new Date().getFullYear()} Kidemia. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

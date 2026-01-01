import { Image } from "@heroui/react";
import { Outlet } from "react-router";
import { AppDarkLogo } from "../assets/images";


export default function EmailLayout() {

    return (
        <section className="min-h-screen flex items-center justify-center bg-kidemia-biege">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-kidemia-primary" />
            <div className="relative bg-kidemia-biege w-full max-w-5xl mx-auto rounded-lg shadow-lg py-12 px-4 space-y-4 z-10">
                <div className="flex justify-center">
                    <Image src={AppDarkLogo} alt="logo" width={150} />
                </div>

                <div className="flex justify-center items-center">
                    <Outlet />
                </div>
            </div>
        </section>
    );
}

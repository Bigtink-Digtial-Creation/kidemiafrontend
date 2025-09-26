import { Outlet } from "react-router";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomeLayout() {
  return (
    <>
      <NavBar />
      <main className="py-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

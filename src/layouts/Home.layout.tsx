import { Outlet } from "react-router";
import NavBar from "../components/Navbar";

export default function HomeLayout() {
  return (
    <>
      <NavBar />
      <main className="py-4">
        <Outlet />
      </main>
    </>
  );
}

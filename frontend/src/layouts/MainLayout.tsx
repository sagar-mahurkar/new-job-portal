import { Outlet } from "react-router-dom";
import Navbar from "../shared/components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout;
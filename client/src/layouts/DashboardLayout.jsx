import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function DashboardLayout() {
    return (
        <>
            <Navbar />

            <div className="dashboard-container">

                <Sidebar />

                <main className="dashboard-content">
                    <Outlet />
                </main>

            </div>
        </>
    );
}

export default DashboardLayout;
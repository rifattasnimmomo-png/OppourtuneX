import { Link } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {

    return (

        <aside className="sidebar">

            <Link to="/student-dashboard">
                Dashboard
            </Link>

            <Link to="/feed">
                Feed
            </Link>

            <Link to="/internships">
                Internships
            </Link>

            <Link to="/scholarships">
                Scholarships
            </Link>

            <Link to="/profile">
                Profile
            </Link>

        </aside>

    );

}

export default Sidebar;
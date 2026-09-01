import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const displayName =
        user.companyName ||
        user.universityName ||
        user.name ||
        "User";

    return (
        <nav className="navbar">

            <div className="logo">
                OppurtuneX
            </div>

            <div className="navbar-right">

                <span>
                    Welcome, {displayName}
                </span>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;
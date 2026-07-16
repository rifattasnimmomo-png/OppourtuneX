import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/userService";
import "../styles/auth.css";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await loginUser(form);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            if (res.data.user.role === "student") {
                navigate("/student-dashboard");
            }
            else if (res.data.user.role === "company") {
                navigate("/company-dashboard");
            }
            else {
                navigate("/university-dashboard");
            }

        }

        catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }

    };

    return (

        <div className="auth-container">

            <form className="auth-form" onSubmit={handleSubmit}>

                <h2>Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Login
                </button>

                <p>
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>

            </form>

        </div>

    );

}

export default Login;
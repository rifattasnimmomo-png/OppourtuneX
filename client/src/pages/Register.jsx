import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/userService";
import "../styles/auth.css";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
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

            await registerUser(form);

            alert("Registration Successful!");

            navigate("/");

        }

        catch (err) {

            alert(err.response?.data?.message || "Registration Failed");

        }

    };

    return (

        <div className="auth-container">

            <form className="auth-form" onSubmit={handleSubmit}>

                <h2>Create Account</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                />

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

                <select
                    name="role"
                    onChange={handleChange}
                    value={form.role}
                >

                    <option value="student">Student</option>

                    <option value="company">Company</option>

                    <option value="university">University</option>

                </select>

                <button type="submit">
                    Register
                </button>

                <p>

                    Already have an account?

                    <Link to="/"> Login</Link>

                </p>

            </form>

        </div>

    );

}

export default Register;
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import UniversityDashboard from "./pages/UniversityDashboard";

import Feed from "./pages/Feed";
import Internships from "./pages/Internships";
import Scholarships from "./pages/Scholarships";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {

    return (

        

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route element={<DashboardLayout />}>

                   <Route
                        path="/student-dashboard"
                        element={
                            <ProtectedRoute>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/company-dashboard"
                        element={
                            <ProtectedRoute>
                                <CompanyDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/university-dashboard"
                        element={
                            <ProtectedRoute>
                                <UniversityDashboard />
                            </ProtectedRoute>
                                }
                    />

                    <Route
                        path="/feed"
                        element={
                            <ProtectedRoute>
                                <Feed />
                            </ProtectedRoute>
                        }
                    />

                   <Route
                        path="/internships"
                        element={
                            <ProtectedRoute>
                                <Internships />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/scholarships"
                        element={
                            <ProtectedRoute>
                                <Scholarships />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                </Route>

                <Route path="*" element={<NotFound />} />

            </Routes>

        

    );

}

export default App;
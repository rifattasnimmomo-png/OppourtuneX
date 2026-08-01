import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
<<<<<<< HEAD
=======
import Notifications from "./pages/Notifications";
>>>>>>> 66821a5 (Add updated opportunity calendar feature)

import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import UniversityDashboard from "./pages/UniversityDashboard";

import Feed from "./pages/Feed";
import Internships from "./pages/Internships";
import Scholarships from "./pages/Scholarships";
import Bookmarks from "./pages/Bookmarks";
<<<<<<< HEAD
=======
import DirectMessages from "./pages/DirectMessages";
import OpportunityCalendar from "./pages/OpportunityCalendar";
import MatchingScore from "./pages/MatchingScore";
import ResumeBuilder from "./pages/ResumeBuilder";
>>>>>>> 66821a5 (Add updated opportunity calendar feature)
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {

    return (

        

            <Routes>

                <Route path="/" element={<Login />} />
<<<<<<< HEAD
=======
                <Route path="/login" element={<Login />} />
>>>>>>> 66821a5 (Add updated opportunity calendar feature)

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
                        path="/bookmarks"
                        element={
                            <ProtectedRoute>
                                <Bookmarks />
                            </ProtectedRoute>
                        }
                    />

                    <Route
<<<<<<< HEAD
=======
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <DirectMessages />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/calendar"
                        element={
                            <ProtectedRoute>
                                <OpportunityCalendar />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/matching-score"
                        element={
                            <ProtectedRoute>
                                <MatchingScore />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/resume-builder"
                        element={
                            <ProtectedRoute>
                                <ResumeBuilder />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute>
                                <Notifications />
                            </ProtectedRoute>
                        }
                    />

                    <Route
>>>>>>> 66821a5 (Add updated opportunity calendar feature)
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
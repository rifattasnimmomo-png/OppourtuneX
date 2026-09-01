import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Notifications from "./pages/Notifications";

import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import UniversityDashboard from "./pages/UniversityDashboard";

import Feed from "./pages/Feed";
import Internships from "./pages/Internships";
import Scholarships from "./pages/Scholarships";
import Bookmarks from "./pages/Bookmarks";

import DirectMessages from "./pages/DirectMessages";
import OpportunityCalendar from "./pages/OpportunityCalendar";
import MatchingScore from "./pages/MatchingScore";
import ResumeBuilder from "./pages/ResumeBuilder";

import Achievements from "./pages/Achievements";
import ActivityLog from "./pages/ActivityLog";

import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import CreateAssessment from "./pages/CreateAssessment";
import Assessments from "./pages/Assessments";
import TakeAssessment from "./pages/TakeAssessment";
import AssessmentPreview from "./pages/AssessmentPreview";
import AssessmentResult from "./pages/AssessmentResult";
import AssessmentSubmissions from "./pages/AssessmentSubmissions";

import ApplicationHistory from "./pages/ApplicationHistory";
import OpportunityComparison from "./pages/OpportunityComparison";
import Help from "./pages/Help";
import StudentInterviews from "./pages/StudentInterviews";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<DashboardLayout />}>

                <Route
                    path="/student-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/company-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["company"]}>
                            <CompanyDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/university-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["university"]}>
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
                    path="/student-interviews"
                    element={
                        <ProtectedRoute>
                            <StudentInterviews />
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
                    path="/assessments"
                    element={
                        <ProtectedRoute>
                            <Assessments />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessments/create"
                    element={
                        <ProtectedRoute allowedRoles={["company", "university"]}>
                            <CreateAssessment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessments/:id/take"
                    element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <TakeAssessment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessments/:id/result/:studentId"
                    element={
                        <ProtectedRoute>
                            <AssessmentResult />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessments/:id/submissions"
                    element={
                        <ProtectedRoute allowedRoles={["company", "university"]}>
                            <AssessmentSubmissions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessments/:id"
                    element={
                        <ProtectedRoute allowedRoles={["company", "university"]}>
                            <AssessmentPreview />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/achievements"
                    element={
                        <ProtectedRoute>
                            <Achievements />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/activity-log"
                    element={
                        <ProtectedRoute>
                            <ActivityLog />
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
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/application-history"
                    element={
                        <ProtectedRoute>
                            <ApplicationHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/compare"
                    element={
                        <ProtectedRoute>
                            <OpportunityComparison />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/help"
                    element={
                        <ProtectedRoute>
                            <Help />
                        </ProtectedRoute>
                    }
                />

            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default App;
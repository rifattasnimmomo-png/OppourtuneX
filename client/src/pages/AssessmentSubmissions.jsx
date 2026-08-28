import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
getAssessmentById,
getAllSubmissions
} from "../services/assessmentService";

function AssessmentSubmissions() {
const { id } = useParams();

```
const [assessment, setAssessment] = useState(null);
const [submissions, setSubmissions] = useState([]);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");

useEffect(() => {
    loadSubmissions();
}, [id]);

const loadSubmissions = async () => {
    try {
        setLoading(true);
        setMessage("");

        const assessmentResponse = await getAssessmentById(id);
        const submissionsResponse = await getAllSubmissions(id);

        setAssessment(assessmentResponse.data);
        setSubmissions(submissionsResponse.data || []);
    } catch (error) {
        console.log(error);

        setMessage(
            error.response?.data?.message ||
            "Failed to load submissions."
        );
    } finally {
        setLoading(false);
    }
};

if (loading) {
    return <h1>Loading Submissions...</h1>;
}

return (
    <div>
        <h1>Assessment Submissions</h1>

        {assessment && (
            <div
                style={{
                    background: "white",
                    padding: "20px",
                    marginBottom: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                }}
            >
                <h2>{assessment.title}</h2>

                {assessment.description && (
                    <p>{assessment.description}</p>
                )}

                <p>
                    Questions:{" "}
                    <strong>
                        {assessment.questions
                            ? assessment.questions.length
                            : 0}
                    </strong>
                </p>
            </div>
        )}

        {message && (
            <div
                style={{
                    padding: "12px",
                    marginBottom: "20px",
                    background: "#f3f4f6",
                    borderRadius: "8px"
                }}
            >
                {message}
            </div>
        )}

        {submissions.length === 0 ? (
            <div
                style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,.1)"
                }}
            >
                <p>
                    No students have submitted this assessment yet.
                </p>
            </div>
        ) : (
            <div>
                {submissions.map((submission, index) => {
                    const percentage =
                        submission.totalQuestions > 0
                            ? Math.round(
                                  (submission.score /
                                      submission.totalQuestions) *
                                      100
                              )
                            : 0;

                    return (
                        <div
                            key={index}
                            style={{
                                background: "white",
                                padding: "20px",
                                marginBottom: "15px",
                                borderRadius: "10px",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,.1)"
                            }}
                        >
                            <h3>
                                {submission.student &&
                                submission.student.name
                                    ? submission.student.name
                                    : "Unknown Student"}
                            </h3>

                            <p>
                                Email:{" "}
                                {submission.student &&
                                submission.student.email
                                    ? submission.student.email
                                    : "Not available"}
                            </p>

                            <p>
                                Score:{" "}
                                <strong>
                                    {submission.score} /{" "}
                                    {submission.totalQuestions}
                                </strong>
                            </p>

                            <p>
                                Percentage:{" "}
                                <strong>
                                    {percentage}%
                                </strong>
                            </p>

                            <p>
                                Submitted on:{" "}
                                {submission.submittedAt
                                    ? new Date(
                                          submission.submittedAt
                                      ).toLocaleString()
                                    : "Not available"}
                            </p>
                        </div>
                    );
                })}
            </div>
        )}

        <div style={{ marginTop: "20px" }}>
            <Link to="/assessments">
                <button>Back to Assessments</button>
            </Link>
        </div>
    </div>
);
```

}

export default AssessmentSubmissions;

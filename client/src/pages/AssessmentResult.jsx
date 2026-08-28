import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
getAssessmentById,
getStudentResult
} from "../services/assessmentService";

function AssessmentResult() {
const { id, studentId } = useParams();

```
const [assessment, setAssessment] = useState(null);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");

useEffect(() => {
    loadResult();
}, [id, studentId]);

const loadResult = async () => {
    try {
        setLoading(true);
        setMessage("");

        const [assessmentResponse, resultResponse] =
            await Promise.all([
                getAssessmentById(id),
                getStudentResult(id, studentId)
            ]);

        setAssessment(assessmentResponse.data);
        setResult(resultResponse.data);
    } catch (error) {
        console.log(error);

        setMessage(
            error.response?.data?.message ||
            "Failed to load assessment result."
        );
    } finally {
        setLoading(false);
    }
};

if (loading) {
    return <h1>Loading Assessment Result...</h1>;
}

if (message) {
    return (
        <div>
            <h1>Assessment Result</h1>

            <p>{message}</p>

            <Link to="/assessments">
                Back to Assessments
            </Link>
        </div>
    );
}

if (!result) {
    return (
        <div>
            <h1>Assessment Result</h1>

            <p>No result found.</p>

            <Link to="/assessments">
                Back to Assessments
            </Link>
        </div>
    );
}

return (
    <div>

        <h1>Assessment Result</h1>

        <div
            style={{
                background: "white",
                padding: "25px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,.1)"
            }}
        >

            <h2>
                {assessment?.title ||
                    result.assessmentTitle}
            </h2>

            <p>
                Score:{" "}
                <strong>
                    {result.score} / {result.totalQuestions}
                </strong>
            </p>

            <p>
                Percentage:{" "}
                <strong>
                    {result.percentage}%
                </strong>
            </p>

            <p>
                Submitted on:{" "}
                {new Date(
                    result.submittedAt
                ).toLocaleString()}
            </p>

        </div>

        <Link to="/assessments">
            <button>
                Back to Assessments
            </button>
        </Link>

    </div>
);
```

}

export default AssessmentResult;

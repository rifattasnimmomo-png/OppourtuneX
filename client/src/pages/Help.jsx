import { useState } from "react";
import "../styles/help.css";

function Help() {

    const [openQuestion, setOpenQuestion] = useState(null);

    const faqs = [
        {
            question: "What is OppurtuneX?",
            answer:
                "OppurtuneX is a platform that helps students discover internships and scholarships, apply for opportunities, bookmark them, compare opportunities, and manage their applications."
        },
        {
            question: "How do I find an internship?",
            answer:
                "Go to the Internships section from the sidebar. You can search by keyword, location, work type, stipend, and deadline."
        },
        {
            question: "How do I find a scholarship?",
            answer:
                "Open the Scholarships section. You can search by keyword, university, scholarship amount, and application deadline."
        },
        {
            question: "How do I apply for an opportunity?",
            answer:
                "Open the Internships or Scholarships section and click the Apply button on the opportunity you are interested in."
        },
        {
            question: "Can I withdraw an application?",
            answer:
                "Yes. If your application is active, you can use the Withdraw button displayed on the opportunity."
        },
        {
            question: "What does Bookmark do?",
            answer:
                "Bookmark allows you to save an internship or scholarship so you can easily find it later from the Bookmarks section. You can also add personal notes to bookmarked opportunities."
        },
        {
            question: "How does Compare work?",
            answer:
                "Click Add to Compare on internships or scholarships you want to evaluate. Then open Compare from the sidebar to see the selected opportunities side by side."
        },
        {
            question: "How do I remove an opportunity from Compare?",
            answer:
                "Open the Compare section and click Remove on the opportunity you no longer want to compare."
        },
        {
            question: "What is Matching Score?",
            answer:
                "Matching Score helps students understand how well opportunities match their profile, skills, and preferences."
        },
        {
            question: "Where can I see my applications?",
            answer:
                "Open Application History to view your previous applications and their current statuses."
        },
        {
            question: "How do I edit my profile?",
            answer:
                "Open Profile from the sidebar. You can view and update the information available in your profile."
        },
        {
            question: "Who can post internships?",
            answer:
                "Company accounts can create and manage internship postings."
        },
        {
            question: "Who can post scholarships?",
            answer:
                "University accounts can create and manage scholarship postings."
        },
        {
            question: "What should I do if I have a problem?",
            answer:
                "First check the Help section for common questions. If the issue continues, contact the platform administrator or support team."
        }
    ];

    const toggleQuestion = (index) => {

        if (openQuestion === index) {
            setOpenQuestion(null);
        } else {
            setOpenQuestion(index);
        }

    };

    return (

        <div className="help-page">

            <div className="help-header">

                <h1>
                    Help & Frequently Asked Questions
                </h1>

                <p>
                    Find answers to common questions about using OppurtuneX.
                </p>

            </div>

            <div className="faq-container">

                {faqs.map((faq, index) => (

                    <div
                        className="faq-item"
                        key={index}
                    >

                        <button
                            className="faq-question"
                            onClick={() => toggleQuestion(index)}
                        >

                            <span>
                                {faq.question}
                            </span>

                            <span className="faq-icon">
                                {openQuestion === index
                                    ? "−"
                                    : "+"}
                            </span>

                        </button>

                        {openQuestion === index && (

                            <div className="faq-answer">

                                <p>
                                    {faq.answer}
                                </p>

                            </div>

                        )}

                    </div>

                ))}

            </div>

        </div>

    );

}

export default Help;
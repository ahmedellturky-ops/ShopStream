import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import Vector1 from "../assets/Image/Vector1.png";
import Vector2 from "../assets/Image/Vector2.png";

import "../styles/CTA.scss";

const emailSchema = Yup.object({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
});

export default function CTA() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <section className="cta-section">
            <div className="cta-content">
                <span className="cta-label">
                    STAY CONNECTED
                </span>

                <h2>
                    Stay Ahead of the Stream
                </h2>

                <p>
                    Join our inner circle for exclusive early access
                    to product launches, seasonal deals, and curated
                    tech trends. No spam, just high-quality updates.
                </p>

                <Formik
                    initialValues={{
                        email: "",
                    }}
                    validationSchema={emailSchema}
                    onSubmit={(values, { resetForm }) => {
                        console.log("Subscribed email:", values.email);

                        setSubmitted(true);
                        resetForm();
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="cta-form">
                            <div className="cta-input-wrapper">
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                />

                                <ErrorMessage
                                    name="email"
                                    component="span"
                                    className="cta-error"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Join Now
                            </button>
                        </Form>
                    )}
                </Formik>

                {submitted && (
                    <p className="cta-success">
                        Thanks for joining ShopStream!
                    </p>
                )}
            </div>

            <div className="cta-vectors">
                <img
                    src={Vector2}
                    alt=""
                    className="cta-vector-2"
                />

                <img
                    src={Vector1}
                    alt=""
                    className="cta-vector-1"
                />
            </div>
        </section>
    );
}
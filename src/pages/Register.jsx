import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from "formik";

import * as Yup from "yup";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaApple,
  FaArrowRight,
} from "react-icons/fa";

import "../styles/Register.scss";

const registerValidationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .min(
      3,
      "Full name must be at least 3 characters"
    ),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(
      6,
      "Password must be at least 6 characters"
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),

  agreeToTerms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms"
  ),
});

export default function Register() {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>

          <p>
            Create your account to start
            shopping with ShopStream.
          </p>
        </div>

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
          }}
          validationSchema={
            registerValidationSchema
          }
          onSubmit={(values) => {
            console.log(
              "Register values:",
              values
            );
          }}
        >
          <Form className="register-form">

            {/* Full Name */}
            <div className="register-field">
              <label htmlFor="fullName">
                Full Name
              </label>

              <div className="register-input-wrapper">
                <FaUser />

                <Field
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Ahmed Ali"
                />
              </div>

              <ErrorMessage
                name="fullName"
                component="div"
                className="register-error"
              />
            </div>

            {/* Email */}
            <div className="register-field">
              <label htmlFor="email">
                Email
              </label>

              <div className="register-input-wrapper">
                <FaEnvelope />

                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                />
              </div>

              <ErrorMessage
                name="email"
                component="div"
                className="register-error"
              />
            </div>

            {/* Password */}
            <div className="register-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">
                <FaLock />

                <Field
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              <ErrorMessage
                name="password"
                component="div"
                className="register-error"
              />
            </div>

            {/* Confirm Password */}
            <div className="register-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-input-wrapper">
                <FaLock />

                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="register-error"
              />
            </div>

            {/* Terms */}
            <label className="register-terms">
              <Field
                type="checkbox"
                name="agreeToTerms"
              />

              <span>
                I agree to the{" "}
                <span className="terms-link">
                  Terms & Conditions
                </span>
              </span>
            </label>

            <ErrorMessage
              name="agreeToTerms"
              component="div"
              className="register-error register-terms-error"
            />

            {/* Submit */}
            <button
              type="submit"
              className="register-submit"
            >
              <span>
                Create Account
              </span>

              <FaArrowRight />
            </button>
          </Form>
        </Formik>

        {/* Divider */}
        <div className="register-divider">
          <span></span>

          <p>Or continue with</p>

          <span></span>
        </div>

        {/* Social Login */}
        <div className="social-register">
          <button
            type="button"
            className="social-btn"
          >
            <FaGoogle />

            <span>Google</span>
          </button>

          <button
            type="button"
            className="social-btn"
          >
            <FaApple />

            <span>Apple</span>
          </button>
        </div>

        {/* Login Link */}
        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}
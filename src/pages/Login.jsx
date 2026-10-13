
import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useDispatch } from "react-redux";

import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from "formik";

import * as Yup from "yup";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaApple,
  FaArrowRight,
} from "react-icons/fa";

import { login } from "../store/authSlice";
import demoUsers from "../data/demoUsers.json";

import "../styles/Login.scss";

const loginValidationSchema = Yup.object({
  emailOrUsername: Yup.string()
    .required("Email or Username is required"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>

          <p>Please enter your details to sign in.</p>
        </div>

        <Formik
          initialValues={{
            emailOrUsername: "",
            password: "",
            rememberMe: false,
          }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => {
            setLoginError("");

            const enteredEmail =
              values.emailOrUsername.trim().toLowerCase();

            const matchedUser = demoUsers.find(
              (user) =>
                user.emailOrUsername.toLowerCase() ===
                enteredEmail &&
                user.password === values.password
            );

            if (!matchedUser) {
              setLoginError(
                "Invalid email or password. Please try again."
              );

              return;
            }

            // Never store the password in Redux or localStorage.
            const loggedInUser = {
              id: matchedUser.id,
              name: matchedUser.name,
              emailOrUsername: matchedUser.emailOrUsername,
              role: matchedUser.role,
            };

            dispatch(login(loggedInUser));

            if (matchedUser.role === "admin") {
              navigate("/admin", { replace: true });
              return;
            }

            const redirectTo =
              location.state?.from || "/";

            navigate(redirectTo, { replace: true });
          }}
        >
          <Form className="login-form">
            {/* Email / Username */}
            <div className="login-field">
              <label htmlFor="emailOrUsername">
                Email or Username
              </label>

              <div className="login-input-wrapper">
                <FaEnvelope />

                <Field
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  placeholder="name@example.com"
                />
              </div>

              <ErrorMessage
                name="emailOrUsername"
                component="div"
                className="login-error"
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot?
                </button>
              </div>

              <div className="login-input-wrapper">
                <FaLock />

                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <ErrorMessage
                name="password"
                component="div"
                className="login-error"
              />
            </div>

            {/* Remember Me */}
            <label className="remember-me">
              <Field
                type="checkbox"
                name="rememberMe"
              />

              <span>Stay signed in for 30 days</span>
            </label>

            {/* Login Error */}
            {loginError && (
              <div className="login-error" role="alert">
                {loginError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="login-submit"
            >
              <span>Sign In</span>
              <FaArrowRight />
            </button>
          </Form>
        </Formik>

        {/* Divider */}
        <div className="login-divider">
          <span></span>
          <p>Or continue with</p>
          <span></span>
        </div>

        {/* Social Login */}
        <div className="social-login">
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

        {/* Register */}
        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}

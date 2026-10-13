import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
    Formik,
    Form,
    Field,
    ErrorMessage,
} from "formik";

import * as Yup from "yup";

import {
    FaCreditCard,
    FaLock,
    FaTruck,
    FaShieldAlt,
} from "react-icons/fa";

import "../styles/Checkout.scss";

const checkoutValidationSchema = Yup.object({
    firstName: Yup.string()
        .required("First name is required")
        .min(
            2,
            "First name must be at least 2 characters"
        ),

    lastName: Yup.string()
        .required("Last name is required")
        .min(
            2,
            "Last name must be at least 2 characters"
        ),

    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),

    address: Yup.string()
        .required("Address is required"),

    city: Yup.string()
        .required("City is required"),

    zipCode: Yup.string()
        .required("Zip code is required")
        .matches(
            /^[0-9]{4,10}$/,
            "Enter a valid zip code"
        ),

    phone: Yup.string()
        .required("Phone number is required")
        .matches(
            /^[0-9+\-\s]{8,15}$/,
            "Enter a valid phone number"
        ),

    cardholderName: Yup.string()
        .required("Cardholder name is required"),

    cardNumber: Yup.string()
        .required("Card number is required")
        .matches(
            /^[0-9\s]{12,19}$/,
            "Enter a valid card number"
        ),

    expiryDate: Yup.string()
        .required("Expiry date is required")
        .matches(
            /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
            "Use MM/YY format"
        ),

    cvv: Yup.string()
        .required("CVV is required")
        .matches(
            /^[0-9]{3,4}$/,
            "CVV must be 3 or 4 digits"
        ),
});

export default function Checkout() {
    const items = useSelector(
        (state) => state.cart.items
    );

    const subtotal = items.reduce(
        (total, item) =>
            total +
            item.price * item.quantity,
        0
    );

    const shipping = 0;

    const estimatedTax =
        subtotal * 0.08;

    const totalPrice =
        subtotal +
        shipping +
        estimatedTax;

    return (
        <main className="checkout-page">

            {/* Page Header */}
            <div className="checkout-header">
                <div>
                    <span className="checkout-label">
                        SECURE CHECKOUT
                    </span>

                    <h1>
                        Complete Your Order
                    </h1>

                    <p>
                        Enter your information and
                        payment details to complete
                        your purchase.
                    </p>
                </div>
            </div>

            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    address: "",
                    city: "",
                    zipCode: "",
                    phone: "",
                    cardholderName: "",
                    cardNumber: "",
                    expiryDate: "",
                    cvv: "",
                }}

                validationSchema={
                    checkoutValidationSchema
                }

                onSubmit={(values) => {
                    console.log(
                        "Checkout values:",
                        values
                    );
                }}
            >
                <Form className="checkout-layout">

                    {/* LEFT SIDE */}
                    <div className="checkout-main">

                        {/* Shipping Information */}
                        <section className="checkout-section">

                            <div className="section-title">
                                <div className="section-icon">
                                    <FaTruck />
                                </div>

                                <div>
                                    <h2>
                                        Shipping Information
                                    </h2>

                                    <p>
                                        Enter the
                                        information for
                                        your delivery.
                                    </p>
                                </div>
                            </div>

                            <div className="checkout-grid">

                                {/* First Name */}
                                <div className="checkout-field">
                                    <label htmlFor="firstName">
                                        First Name
                                    </label>

                                    <Field
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="Ahmed"
                                    />

                                    <ErrorMessage
                                        name="firstName"
                                        component="div"
                                        className="checkout-error"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="checkout-field">
                                    <label htmlFor="lastName">
                                        Last Name
                                    </label>

                                    <Field
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Ali"
                                    />

                                    <ErrorMessage
                                        name="lastName"
                                        component="div"
                                        className="checkout-error"
                                    />
                                </div>

                                {/* Email */}
                                <div className="checkout-field checkout-field-full">
                                    <label htmlFor="email">
                                        Email Address
                                    </label>

                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                    />

                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="checkout-error"
                                    />
                                </div>

                                {/* Address */}
                                <div className="checkout-field checkout-field-full">
                                    <label htmlFor="address">
                                        Address
                                    </label>

                                    <Field
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder="123 Main Street"
                                    />

                                    <ErrorMessage
                                        name="address"
                                        component="div"
                                        className="checkout-error"
                                    />
                                </div>

                                {/* City */}
                                <div className="checkout-field">
                                    <label htmlFor="city">
                                        City
                                    </label>

                                    <Field
                                        id="city"
                                        name="city"
                                        type="text"
                                        placeholder="Cairo"
                                    />

                                    <ErrorMessage
                                        name="city"
                                        component="div"
                                        className="checkout-error"
                                    />
                                </div>

                                {/* Zip Code */}
                                <div className="checkout-field">
                                    <label htmlFor="zipCode">
                                        Zip Code
                                    </label>

                                    <Field
                                        id="zipCode"
                                        name="zipCode"
                                        type="text"
                                        placeholder="11511"
                                    />

                                    <ErrorMessage
                                        name="zipCode"
                                        component="div"
                                        className="checkout-error"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="checkout-field checkout-field-full">
                                    <label htmlFor="phone">
                                        Phone Number
                                    </label>

                                    <Field
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+20 100 000 0000"
                                    />

                                    <ErrorMessage
                                        name="phone"
                                        component="div"
                                        className="checkout-error"
                                    />
                                </div>

                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="checkout-section">

                            <div className="section-title">
                                <div className="section-icon">
                                    <FaCreditCard />
                                </div>

                                <div>
                                    <h2>
                                        Payment Method
                                    </h2>

                                    <p>
                                        Your payment
                                        information is
                                        encrypted and
                                        secure.
                                    </p>
                                </div>
                            </div>

                            <div className="payment-method">

                                <div className="payment-method-header">
                                    <div className="payment-method-name">
                                        <FaCreditCard />

                                        <span>
                                            Credit / Debit
                                            Card
                                        </span>
                                    </div>

                                    <span className="payment-secure">
                                        <FaLock />
                                        Secure
                                    </span>
                                </div>

                                <div className="checkout-grid">

                                    {/* Cardholder Name */}
                                    <div className="checkout-field checkout-field-full">
                                        <label htmlFor="cardholderName">
                                            Cardholder Name
                                        </label>

                                        <Field
                                            id="cardholderName"
                                            name="cardholderName"
                                            type="text"
                                            placeholder="Ahmed Ali"
                                        />

                                        <ErrorMessage
                                            name="cardholderName"
                                            component="div"
                                            className="checkout-error"
                                        />
                                    </div>

                                    {/* Card Number */}
                                    <div className="checkout-field checkout-field-full">
                                        <label htmlFor="cardNumber">
                                            Card Number
                                        </label>

                                        <Field
                                            id="cardNumber"
                                            name="cardNumber"
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                        />

                                        <ErrorMessage
                                            name="cardNumber"
                                            component="div"
                                            className="checkout-error"
                                        />
                                    </div>

                                    {/* Expiry */}
                                    <div className="checkout-field">
                                        <label htmlFor="expiryDate">
                                            Expiry Date
                                        </label>

                                        <Field
                                            id="expiryDate"
                                            name="expiryDate"
                                            type="text"
                                            placeholder="MM/YY"
                                        />

                                        <ErrorMessage
                                            name="expiryDate"
                                            component="div"
                                            className="checkout-error"
                                        />
                                    </div>

                                    {/* CVV */}
                                    <div className="checkout-field">
                                        <label htmlFor="cvv">
                                            CVV
                                        </label>

                                        <Field
                                            id="cvv"
                                            name="cvv"
                                            type="password"
                                            placeholder="123"
                                            maxLength="4"
                                        />

                                        <ErrorMessage
                                            name="cvv"
                                            component="div"
                                            className="checkout-error"
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="payment-note">
                                <FaShieldAlt />

                                <span>
                                    Your payment
                                    information is
                                    protected with
                                    industry-standard
                                    security.
                                </span>
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="checkout-actions">

                            <Link
                                to="/cart"
                                className="back-to-cart"
                            >
                                Back to Cart
                            </Link>

                            <button
                                type="submit"
                                className="place-order-btn"
                            >
                                Place Order
                            </button>

                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <aside className="checkout-summary">

                        <div className="summary-header">
                            <h2>
                                Order Summary
                            </h2>

                            <span>
                                {items.length} items
                            </span>
                        </div>

                        <div className="summary-products">

                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="summary-product"
                                >
                                    <img
                                        src={
                                            item.thumbnail
                                        }
                                        alt={
                                            item.title
                                        }
                                    />

                                    <div className="summary-product-info">
                                        <h3>
                                            {item.title}
                                        </h3>

                                        <span>
                                            Qty:{" "}
                                            {
                                                item.quantity
                                            }
                                        </span>
                                    </div>

                                    <strong>
                                        $
                                        {(
                                            item.price *
                                            item.quantity
                                        ).toFixed(2)}
                                    </strong>
                                </div>
                            ))}

                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row">
                            <span>
                                Subtotal
                            </span>

                            <strong>
                                $
                                {subtotal.toFixed(
                                    2
                                )}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>
                                Shipping
                            </span>

                            <span className="free-text">
                                Free
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>
                                Estimated Tax
                            </span>

                            <strong>
                                $
                                {estimatedTax.toFixed(
                                    2
                                )}
                            </strong>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>
                                Total
                            </span>

                            <strong>
                                $
                                {totalPrice.toFixed(
                                    2
                                )}
                            </strong>
                        </div>

                        <div className="summary-security">
                            <FaShieldAlt />

                            <div>
                                <strong>
                                    Secure Checkout
                                </strong>

                                <p>
                                    Your personal and
                                    payment information
                                    is protected.
                                </p>
                            </div>
                        </div>

                    </aside>

                </Form>
            </Formik>
        </main>
    );
}
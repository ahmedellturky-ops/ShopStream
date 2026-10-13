import { Link } from "react-router-dom";

import {
    FaMoneyBillWave,
    FaCreditCard,
    FaWallet,
} from "react-icons/fa";
import {
    FaGlobe,
    FaRegCommentDots,
    FaCog,
} from "react-icons/fa";

import "../styles/Footer.scss";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-brand">
                    <h2><Link to="/">ShopStream</Link></h2>

                    <p>
                        Your destination for modern technology,
                        quality products, and everyday essentials.
                    </p>
                    <div className="footer-social">
                        <Link to="/" aria-label="Website">
                            <FaGlobe />
                        </Link>

                        <Link to="/contact" aria-label="Contact">
                            <FaRegCommentDots />
                        </Link>

                        <Link to="/profile" aria-label="Settings">
                            <FaCog />
                        </Link>
                    </div>
                </div>


                <div className="footer-links">

                    <div>
                        <h3>Shop</h3>

                        <Link to="/products">
                            Products
                        </Link>

                        <Link to="/categories">
                            Categories
                        </Link>

                        <Link to="/cart">
                            Cart
                        </Link>
                    </div>

                    <div>
                        <h3>Support</h3>

                        <Link to="/contact">
                            Contact
                        </Link>

                        <Link to="/orders">
                            Orders
                        </Link>

                        <Link to="/profile">
                            Profile
                        </Link>
                    </div>

                    <div>
                        <h3>Legal</h3>

                        <Link to="/privacy">
                            Privacy Policy
                        </Link>

                        <Link to="/terms">
                            Terms & Conditions
                        </Link>
                    </div>

                </div>
            </div>

            <div className="footer-bottom">

                <span>
                    © 2026 ShopStream. All rights reserved.
                </span>

                <div className="footer-bottom-links">

                    <Link
                        to="/privacy"
                        aria-label="Privacy Policy"
                    >
                        <FaMoneyBillWave />
                    </Link>

                    <Link
                        to="/terms"
                        aria-label="Terms and Conditions"
                    >
                        <FaCreditCard />
                    </Link>

                    <Link
                        to="/contact"
                        aria-label="Contact"
                    >
                        <FaWallet />
                    </Link>

                </div>

            </div>
        </footer>
    );
}
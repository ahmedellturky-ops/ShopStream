
import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { useSelector } from "react-redux";

import {
    FaSearch,
    FaShoppingCart,
    FaUserCircle,
    FaHeart,
    FaUserShield,
    FaMoon,
    FaSun,
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";

import "../styles/Navbar.scss";

function Navbar() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const { theme, toggleTheme } = useTheme();

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const wishlistItems = useSelector(
        (state) => state.wishlist.items
    );

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const user = useSelector(
        (state) => state.auth.user
    );

    const isAdmin =
        isAuthenticated && user?.role === "admin";

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const wishlistCount = wishlistItems.length;

    function handleSearch(event) {
        event.preventDefault();

        const trimmedSearch = search.trim();

        if (!trimmedSearch) {
            navigate("/products");
            return;
        }

        navigate(
            `/products?search=${encodeURIComponent(
                trimmedSearch
            )}`
        );
    }

    return (
        <nav className="navbar-custom">
            <div className="navbar-container">

                {/* Logo */}
                <Link
                    to="/"
                    className="navbar-brand"
                >
                    ShopStream
                </Link>

                {/* Navigation Links */}
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/categories">Categories</Link>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="navbar-admin-link"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "7px",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                backgroundColor: "#efedff",
                                color: "#5146e5",
                                fontWeight: 600,
                                fontSize: "13px",
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <FaUserShield />
                            Admin Panel
                        </Link>
                    )}
                </div>

                {/* Navbar Actions */}
                <div className="navbar-actions">

                    {/* Search */}
                    <form
                        className="navbar-search"
                        onSubmit={handleSearch}
                    >
                        <button
                            type="submit"
                            aria-label="Search products"
                        >
                            <FaSearch />
                        </button>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </form>

                    {/* Theme Toggle */}
                    <button
                        type="button"
                        className="navbar-icon navbar-theme-toggle"
                        onClick={toggleTheme}
                        title={
                            theme === "light"
                                ? "Switch to Dark Mode"
                                : "Switch to Light Mode"
                        }
                        aria-label={
                            theme === "light"
                                ? "Switch to Dark Mode"
                                : "Switch to Light Mode"
                        }
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {theme === "light" ? (
                            <FaMoon />
                        ) : (
                            <FaSun />
                        )}
                    </button>

                    {/* Wishlist */}
                    <Link
                        to="/wishlist"
                        className="navbar-icon navbar-wishlist"
                        aria-label="Wishlist"
                    >
                        <FaHeart />

                        {wishlistCount > 0 && (
                            <span className="navbar-wishlist-count">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="navbar-icon navbar-cart"
                        aria-label="Shopping cart"
                    >
                        <FaShoppingCart />

                        {cartCount > 0 && (
                            <span className="navbar-cart-count">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Login / Profile */}
                    <Link
                        to={
                            isAuthenticated
                                ? "/profile"
                                : "/login"
                        }
                        className="navbar-icon"
                        aria-label={
                            isAuthenticated
                                ? "Profile"
                                : "Login"
                        }
                    >
                        <FaUserCircle />
                    </Link>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;


import { useEffect, useState } from "react";

import {
    FaBoxOpen,
    FaUsers,
    FaShoppingCart,
} from "react-icons/fa";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        users: 0,
        carts: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchDashboardStats() {
            try {
                setLoading(true);
                setError("");

                const options = {
                    signal: controller.signal,
                };

                const responses = await Promise.all([
                    fetch("https://dummyjson.com/products?limit=1", options),
                    fetch("https://dummyjson.com/users?limit=1", options),
                    fetch("https://dummyjson.com/carts?limit=1", options),
                ]);

                if (responses.some((response) => !response.ok)) {
                    throw new Error("Failed to load dashboard data.");
                }

                const [productsData, usersData, cartsData] =
                    await Promise.all(
                        responses.map((response) => response.json())
                    );

                setStats({
                    products: productsData.total ?? 0,
                    users: usersData.total ?? 0,
                    carts: cartsData.total ?? 0,
                });
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Something went wrong.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchDashboardStats();

        return () => controller.abort();
    }, [retry]);

    const statCards = [
        {
            title: "Total Products",
            value: stats.products,
            icon: <FaBoxOpen />,
            color: "#5146e5",
            background: "#efedff",
        },
        {
            title: "Total Users",
            value: stats.users,
            icon: <FaUsers />,
            color: "#16865c",
            background: "#e6f7ef",
        },
        {
            title: "Total Carts",
            value: stats.carts,
            icon: <FaShoppingCart />,
            color: "#d97706",
            background: "#fff3df",
        },
    ];

    return (
        <section>
            <div className="mb-4">
                <h2 className="fw-bold mb-2">
                    Dashboard Overview
                </h2>

                <p className="text-secondary mb-0">
                    Monitor your ShopStream store at a glance.
                </p>
            </div>

            {error && (
                <div
                    className="alert alert-danger d-flex justify-content-between align-items-center"
                    role="alert"
                >
                    <span>{error}</span>

                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setRetry((value) => value + 1)}
                    >
                        Try Again
                    </button>
                </div>
            )}

            <div className="row g-3">
                {statCards.map((card) => (
                    <div
                        className="col-12 col-md-6 col-xl-4"
                        key={card.title}
                    >
                        <div
                            className="card h-100 border-0 shadow-sm"
                            style={{ borderRadius: "16px" }}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <span className="text-secondary">
                                        {card.title}
                                    </span>

                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-3"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            color: card.color,
                                            backgroundColor: card.background,
                                            fontSize: "20px",
                                        }}
                                    >
                                        {card.icon}
                                    </div>
                                </div>

                                <h3 className="fw-bold mb-1">
                                    {loading
                                        ? "Loading..."
                                        : new Intl.NumberFormat("en-US").format(
                                            card.value
                                        )}
                                </h3>

                                <small className="text-secondary">
                                    {loading
                                        ? "Fetching data from DummyJSON"
                                        : "Data received from DummyJSON"}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="card border-0 shadow-sm mt-4"
                style={{ borderRadius: "16px" }}
            >
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-2">
                        Welcome to ShopStream Admin
                    </h5>

                    <p className="text-secondary mb-0">
                        Use the sidebar to manage products, users, and carts.
                    </p>
                </div>
            </div>
        </section>
    );
}

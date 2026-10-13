
import { useEffect, useMemo, useState } from "react";

import {
    FaSearch,
    FaShoppingCart,
    FaBoxOpen,
    FaDollarSign,
    FaUsers,
    FaEye,
    FaTimes,
    FaRedo,
} from "react-icons/fa";

import "../../styles/AdminProducts.scss";

const PAGE_SIZE = 8;

function money(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(value) || 0);
}

export default function AdminCarts() {
    const [carts, setCarts] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCart, setSelectedCart] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchCartData() {
            try {
                setLoading(true);
                setError("");

                const options = {
                    signal: controller.signal,
                };

                const [cartResponse, userResponse] =
                    await Promise.all([
                        fetch(
                            "https://dummyjson.com/carts?limit=0",
                            options
                        ),
                        fetch(
                            "https://dummyjson.com/users?limit=0",
                            options
                        ),
                    ]);

                if (!cartResponse.ok || !userResponse.ok) {
                    throw new Error("Failed to load cart data.");
                }

                const [cartData, userData] = await Promise.all([
                    cartResponse.json(),
                    userResponse.json(),
                ]);

                setCarts(cartData.carts || []);
                setUsers(userData.users || []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(
                        "Couldn't load carts. Check your internet connection and retry."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchCartData();

        return () => controller.abort();
    }, [retry]);

    const usersById = useMemo(
        () => new Map(users.map((user) => [user.id, user])),
        [users]
    );

    const filteredCarts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return carts.filter((cart) => {
            const user = usersById.get(cart.userId);

            const customerName = user
                ? `${user.firstName} ${user.lastName}`
                : "";

            const productNames = (cart.products || [])
                .map((product) => product.title)
                .join(" ");

            const matchesSearch =
                String(cart.id).includes(query) ||
                customerName.toLowerCase().includes(query) ||
                (user?.username || "").toLowerCase().includes(query) ||
                productNames.toLowerCase().includes(query);

            const total = Number(
                cart.discountedTotal ?? cart.total ?? 0
            );

            const matchesFilter =
                filter === "all" ||
                (filter === "discounted" &&
                    Number(cart.discountedTotal ?? cart.total) <
                    Number(cart.total ?? 0)) ||
                (filter === "high-value" && total >= 100);

            return matchesSearch && matchesFilter;
        });
    }, [carts, usersById, search, filter]);

    const pageCount = Math.max(
        1,
        Math.ceil(filteredCarts.length / PAGE_SIZE)
    );

    const safePage = Math.min(currentPage, pageCount);

    const visibleCarts = filteredCarts.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    const stats = useMemo(() => {
        const totalValue = carts.reduce(
            (sum, cart) =>
                sum + Number(cart.discountedTotal ?? cart.total ?? 0),
            0
        );

        const totalItems = carts.reduce(
            (sum, cart) => sum + Number(cart.totalQuantity ?? 0),
            0
        );

        return {
            count: carts.length,
            totalValue,
            totalItems,
            averageValue: carts.length
                ? totalValue / carts.length
                : 0,
        };
    }, [carts]);

    const statCards = [
        {
            title: "Total Carts",
            value: stats.count.toLocaleString("en-US"),
            note: "Carts returned by DummyJSON",
            icon: <FaShoppingCart />,
            color: "#5146e5",
            bg: "#efedff",
        },
        {
            title: "Cart Value",
            value: money(stats.totalValue),
            note: "Combined discounted cart totals",
            icon: <FaDollarSign />,
            color: "#16865c",
            bg: "#e6f7ef",
        },
        {
            title: "Items in Carts",
            value: stats.totalItems.toLocaleString("en-US"),
            note: "Combined quantity across carts",
            icon: <FaBoxOpen />,
            color: "#2575cf",
            bg: "#e8f2ff",
        },
        {
            title: "Average Cart Value",
            value: money(stats.averageValue),
            note: "Average value per cart",
            icon: <FaUsers />,
            color: "#d97706",
            bg: "#fff3df",
        },
    ];

    function resetFilters() {
        setSearch("");
        setFilter("all");
        setCurrentPage(1);
    }

    return (
        <section className="admin-products-page">
            {/* Page Header */}
            <div className="admin-products-heading">
                <div>
                    <div className="admin-breadcrumb">
                        ShopStream / Cart Management
                    </div>

                    <h2 className="admin-products-title">
                        Cart Management
                    </h2>

                    <p className="admin-products-subtitle">
                        Review cart contents, quantities, and totals.
                    </p>
                </div>
            </div>

            {/* Cart Statistics */}
            <div className="row g-3 mb-4">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="col-12 col-sm-6 col-xl-3"
                    >
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-start justify-content-between gap-2">
                                    <div>
                                        <p className="text-secondary small mb-2">
                                            {card.title}
                                        </p>

                                        <h4 className="fw-bold mb-2">
                                            {loading ? "—" : card.value}
                                        </h4>
                                    </div>

                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-3"
                                        style={{
                                            width: 42,
                                            height: 42,
                                            flexShrink: 0,
                                            color: card.color,
                                            backgroundColor: card.bg,
                                        }}
                                    >
                                        {card.icon}
                                    </div>
                                </div>

                                <small className="text-secondary">
                                    {card.note}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="admin-inventory-card mb-3">
                <div className="admin-product-toolbar">
                    <div className="admin-product-search">
                        <FaSearch />

                        <input
                            type="search"
                            value={search}
                            placeholder="Search cart ID, customer, or product..."
                            aria-label="Search carts"
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <div className="admin-toolbar-actions">
                        <button
                            type="button"
                            className="admin-outline-btn"
                            onClick={() =>
                                setShowFilters((previous) => !previous)
                            }
                        >
                            Filters
                        </button>

                        <button
                            type="button"
                            className="admin-outline-btn"
                            onClick={resetFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="admin-filter-panel">
                        <div>
                            <label htmlFor="cart-value-filter">
                                Cart Value
                            </label>

                            <select
                                id="cart-value-filter"
                                value={filter}
                                onChange={(event) => {
                                    setFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Carts</option>
                                <option value="discounted">
                                    Carts with a Discount
                                </option>
                                <option value="high-value">
                                    Cart Value $100+
                                </option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div
                    className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center gap-3"
                    role="alert"
                >
                    <span>{error}</span>

                    <button
                        type="button"
                        className="admin-outline-btn"
                        onClick={() => setRetry((value) => value + 1)}
                    >
                        <FaRedo />
                        Retry
                    </button>
                </div>
            )}

            {/* Cart Table */}
            <div className="admin-inventory-card">
                <div className="admin-products-table-wrap">
                    <table className="admin-products-table">
                        <thead>
                            <tr>
                                <th>Cart ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Cart Total</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        />
                                        Loading carts...
                                    </td>
                                </tr>
                            ) : visibleCarts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-5 text-secondary"
                                    >
                                        No carts found.
                                    </td>
                                </tr>
                            ) : (
                                visibleCarts.map((cart) => {
                                    const user = usersById.get(cart.userId);

                                    return (
                                        <tr key={cart.id}>
                                            <td className="fw-semibold">
                                                CART-{String(cart.id).padStart(4, "0")}
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {user
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : `User ${cart.userId}`}
                                                </div>

                                                <small className="text-secondary">
                                                    {user?.email || ""}
                                                </small>
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {cart.totalProducts ?? cart.products?.length ?? 0} products
                                                </div>

                                                <small className="text-secondary">
                                                    {cart.totalQuantity ?? 0} units
                                                </small>
                                            </td>

                                            <td className="fw-semibold">
                                                {money(
                                                    cart.discountedTotal ?? cart.total ?? 0
                                                )}
                                            </td>

                                            <td>
                                                <div className="admin-product-actions">
                                                    <button
                                                        type="button"
                                                        className="admin-outline-btn"
                                                        onClick={() => setSelectedCart(cart)}
                                                    >
                                                        <FaEye />
                                                        View Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredCarts.length > 0 && (
                    <div className="admin-table-footer">
                        <span className="admin-table-count">
                            Showing {(safePage - 1) * PAGE_SIZE + 1}–
                            {Math.min(
                                safePage * PAGE_SIZE,
                                filteredCarts.length
                            )}{" "}
                            of {filteredCarts.length} carts
                        </span>

                        <div className="admin-pagination">
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={safePage === 1}
                                onClick={() =>
                                    setCurrentPage((page) => Math.max(1, page - 1))
                                }
                            >
                                ‹
                            </button>

                            <span className="is-active">
                                {safePage}
                            </span>

                            <span>of {pageCount}</span>

                            <button
                                type="button"
                                aria-label="Next page"
                                disabled={safePage >= pageCount}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.min(pageCount, page + 1)
                                    )
                                }
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-secondary small mt-3 mb-0">
                Cart information comes from DummyJSON sample data.
                These are not live orders or real-time customer sessions.
            </p>

            {/* Cart Details Modal */}
            {selectedCart && (
                <div
                    className="admin-product-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedCart(null);
                        }
                    }}
                >
                    <section
                        className="admin-product-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-details-title"
                    >
                        <div className="admin-product-modal-header">
                            <h3 id="cart-details-title">
                                Cart #{selectedCart.id} Details
                            </h3>

                            <button
                                type="button"
                                aria-label="Close cart details"
                                onClick={() => setSelectedCart(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="admin-product-modal-body">
                            <p className="text-secondary small">
                                Customer:{" "}
                                {(() => {
                                    const user = usersById.get(selectedCart.userId);

                                    return user
                                        ? `${user.firstName} ${user.lastName}`
                                        : `User ${selectedCart.userId}`;
                                })()}
                            </p>

                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(selectedCart.products || []).map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.title}
                                                            style={{
                                                                width: 40,
                                                                height: 40,
                                                                objectFit: "contain",
                                                            }}
                                                        />

                                                        <span>{product.title}</span>
                                                    </div>
                                                </td>

                                                <td>{product.quantity}</td>

                                                <td>
                                                    {money(
                                                        product.discountedTotal ??
                                                        product.total ??
                                                        product.price * product.quantity
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-between border-top pt-3 mt-3">
                                <span className="text-secondary">
                                    Cart Total
                                </span>

                                <strong>
                                    {money(
                                        selectedCart.discountedTotal ??
                                        selectedCart.total ??
                                        0
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-product-modal-footer">
                            <button
                                type="button"
                                className="admin-modal-cancel"
                                onClick={() => setSelectedCart(null)}
                            >
                                Close
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}

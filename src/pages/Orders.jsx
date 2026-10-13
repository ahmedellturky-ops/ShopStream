import {
    FaBox,
    FaCheck,
    FaClock,
    FaTruck,
    FaMapMarkerAlt,
    FaCreditCard,
    FaChevronRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../styles/Orders.scss";

const orders = [
    {
        id: "#OS-99231",
        date: "Oct 12, 2023",
        status: "Delivered",
        estimatedDelivery: "Oct 16, 2023",
        product: {
            name: "StreamPro Wireless Headphones",
            quantity: 1,
            price: "$299.00",
        },
    },
    {
        id: "#OS-98442",
        date: "Oct 15, 2023",
        status: "Shipped",
        estimatedDelivery: "Oct 20, 2023",
        product: {
            name: "Quantum Watch Series 4",
            quantity: 1,
            price: "$449.00",
        },
    },
    {
        id: "#OS-99771",
        date: "Oct 18, 2023",
        status: "Processing",
        estimatedDelivery: "Oct 23, 2023",
        product: {
            name: "Mechanical Chroma Keyboard",
            quantity: 1,
            price: "$189.00",
        },
    },
];

const statusSteps = [
    {
        key: "Placed",
        label: "Placed",
        icon: FaCheck,
    },
    {
        key: "Processing",
        label: "Processing",
        icon: FaClock,
    },
    {
        key: "Shipped",
        label: "Shipped",
        icon: FaTruck,
    },
    {
        key: "Delivered",
        label: "Delivered",
        icon: FaBox,
    },
];

function getStatusIndex(status) {
    return statusSteps.findIndex(
        (step) => step.key === status
    );
}

function OrderCard({ order }) {
    const currentStatusIndex =
        getStatusIndex(order.status);

    return (
        <article className="order-card">

            {/* Order Header */}
            <div className="order-card-header">

                <div>
                    <span className="order-number">
                        Order {order.id}
                    </span>

                    <p>
                        Placed on {order.date}
                    </p>
                </div>

                <span
                    className={`order-status ${order.status.toLowerCase()}`}
                >
                    {order.status}
                </span>

            </div>

            {/* Tracking */}
            <div className="order-tracking">

                {statusSteps.map(
                    (step, index) => {
                        const Icon = step.icon;

                        const isCompleted =
                            index <=
                            currentStatusIndex;

                        const isLast =
                            index ===
                            statusSteps.length - 1;

                        return (
                            <div
                                key={step.key}
                                className="tracking-step-wrapper"
                            >

                                <div
                                    className={`tracking-step ${
                                        isCompleted
                                            ? "completed"
                                            : ""
                                    }`}
                                >
                                    <div className="tracking-icon">
                                        <Icon />
                                    </div>

                                    <span>
                                        {step.label}
                                    </span>
                                </div>

                                {!isLast && (
                                    <div
                                        className={`tracking-line ${
                                            index <
                                            currentStatusIndex
                                                ? "completed"
                                                : ""
                                        }`}
                                    />
                                )}

                            </div>
                        );
                    }
                )}

            </div>

            {/* Estimated Delivery */}
            <div className="estimated-delivery">
                <FaTruck />

                <div>
                    <span>
                        Estimated Delivery
                    </span>

                    <strong>
                        {order.estimatedDelivery}
                    </strong>
                </div>
            </div>

            {/* Product */}
            <div className="order-product">

                <div className="order-product-image">
                    <FaBox />
                </div>

                <div className="order-product-info">
                    <h3>
                        {order.product.name}
                    </h3>

                    <p>
                        Quantity:{" "}
                        {order.product.quantity}
                    </p>
                </div>

                <strong className="order-product-price">
                    {order.product.price}
                </strong>

            </div>

            {/* Order Details */}
            <div className="order-details-grid">

                <div className="order-detail">

                    <FaMapMarkerAlt />

                    <div>
                        <span>
                            Shipping Address
                        </span>

                        <strong>
                            123 Main Street,
                            Cairo, Egypt
                        </strong>
                    </div>

                </div>

                <div className="order-detail">

                    <FaCreditCard />

                    <div>
                        <span>
                            Payment Method
                        </span>

                        <strong>
                            Visa •••• 4242
                        </strong>
                    </div>

                </div>

            </div>

            {/* Footer */}
            <div className="order-card-footer">

                <span>
                    Need help with this order?
                </span>

                <Link to="/orders">
                    View Order Details
                    <FaChevronRight />
                </Link>

            </div>

        </article>
    );
}

export default function Orders() {
    return (
        <main className="orders-page">

            <div className="orders-container">

                {/* Page Header */}
                <div className="orders-header">

                    <div>
                        <span className="orders-label">
                            MY ACCOUNT
                        </span>

                        <h1>
                            Order History
                        </h1>

                        <p>
                            Track and manage all
                            your orders in one place.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="shop-more-btn"
                    >
                        Continue Shopping
                    </Link>

                </div>

                {/* Orders */}
                <div className="orders-list">

                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                        />
                    ))}

                </div>

            </div>

        </main>
    );
}
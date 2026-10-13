
import { Link, NavLink, Outlet } from "react-router-dom";

import {
    FaChartPie,
    FaBoxOpen,
    FaUsers,
    FaShoppingCart,
    FaStore,
} from "react-icons/fa";

export default function AdminLayout() {
    const navItems = [
        {
            title: "Dashboard",
            path: "/admin",
            icon: <FaChartPie />,
        },
        {
            title: "Product Management",
            path: "/admin/products",
            icon: <FaBoxOpen />,
        },
        {
            title: "User Management",
            path: "/admin/users",
            icon: <FaUsers />,
        },
        {
            title: "Cart Management",
            path: "/admin/carts",
            icon: <FaShoppingCart />,
        },
    ];

    return (
        <div
            className="d-flex min-vh-100"
            style={{ backgroundColor: "#f6f7fb" }}
        >
            {/* Sidebar */}
            <aside
                className="d-flex flex-column p-3"
                style={{
                    width: "255px",
                    minWidth: "255px",
                    backgroundColor: "#ffffff",
                    borderRight: "1px solid #e8eaf0",
                }}
            >
                {/* Logo */}
                <Link
                    to="/admin"
                    className="d-flex align-items-center gap-2 text-decoration-none mb-5"
                    style={{ color: "#5146e5" }}
                >
                    <FaStore size={24} />

                    <span className="fs-5 fw-bold">
                        ShopStream
                    </span>
                </Link>

                <p
                    className="text-secondary fw-semibold small mb-3"
                    style={{ letterSpacing: "1px" }}
                >
                    ADMIN MENU
                </p>

                {/* Navigation */}
                <nav>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin"}
                            className="d-flex align-items-center gap-3 text-decoration-none rounded-3 px-3 py-3 mb-2"
                            style={({ isActive }) => ({
                                color: isActive ? "#5146e5" : "#667085",
                                backgroundColor: isActive
                                    ? "#efedff"
                                    : "transparent",
                                fontWeight: isActive ? 600 : 500,
                            })}
                        >
                            {item.icon}

                            <span>{item.title}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Back to Store */}
                <div className="mt-auto pt-4 border-top">
                    <Link
                        to="/"
                        className="d-flex align-items-center gap-2 text-decoration-none"
                        style={{ color: "#667085" }}
                    >
                        <FaStore />
                        <span>Back to Store</span>
                    </Link>
                </div>
            </aside>

            {/* Admin Content */}
            <div className="flex-grow-1">
                <header
                    className="d-flex align-items-center justify-content-between px-4 py-3"
                    style={{
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #e8eaf0",
                    }}
                >
                    <div>
                        <h5 className="fw-bold mb-1">
                            Admin Panel
                        </h5>

                        <small className="text-secondary">
                            Manage your ShopStream store
                        </small>
                    </div>

                    <span
                        className="rounded-pill px-3 py-2 small fw-semibold"
                        style={{
                            backgroundColor: "#efedff",
                            color: "#5146e5",
                        }}
                    >
                        Admin Workspace
                    </span>
                </header>

                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

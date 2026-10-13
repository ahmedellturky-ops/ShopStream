import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaUser,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaShoppingBag,
  FaWallet,
  FaStar,
  FaBox,
} from "react-icons/fa";

import {
  logout,
} from "../store/authSlice";

import "../styles/Profile.scss";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const user = useSelector(
    (state) => state.auth.user
  );

  const userEmail =
    user?.emailOrUsername ||
    "name@example.com";

  const userName =
    user?.name ||
    "Julian Sterling";

  const recentOrders = [
    {
      id: "#OS-99231",
      title: "StreamPro Wireless Headphones",
      date: "Oct 12, 2023",
      price: "$299.00",
      status: "Delivered",
    },
    {
      id: "#OS-98442",
      title: "Quantum Watch Series 4",
      date: "Oct 15, 2023",
      price: "$449.00",
      status: "Shipped",
    },
    {
      id: "#OS-99771",
      title: "Mechanical Chroma Keyboard",
      date: "Oct 18, 2023",
      price: "$189.00",
      status: "Processing",
    },
  ];

  function handleSignOut() {
    setShowLogoutModal(true);
  }

  function confirmSignOut() {
    dispatch(logout());

    setShowLogoutModal(false);

    navigate("/login");
  }

  function cancelSignOut() {
    setShowLogoutModal(false);
  }

  return (
    <main className="profile-page">

      <div className="profile-layout">

        {/* Sidebar */}
        <aside className="profile-sidebar">

          <div className="sidebar-header">
            <h2>
              Account
            </h2>

            <p>
              Manage your settings
            </p>
          </div>

          <nav className="profile-nav">

            <Link
              to="/profile"
              className="profile-nav-item active"
            >
              <FaUser />

              <span>
                My Profile
              </span>
            </Link>

            <Link
              to="/orders"
              className="profile-nav-item"
            >
              <FaHistory />

              <span>
                Order History
              </span>
            </Link>

            <button
              type="button"
              className="profile-nav-item"
            >
              <FaCog />

              <span>
                Account Settings
              </span>
            </button>

          </nav>

          <button
            type="button"
            className="profile-signout"
            onClick={handleSignOut}
          >
            <FaSignOutAlt />

            <span>
              Sign Out
            </span>
          </button>

        </aside>

        {/* Main Content */}
        <section className="profile-content">

          {/* Profile Header */}
          <div className="profile-header-card">

            <div className="profile-user">

              <div className="profile-avatar">
                <FaUser />
              </div>

              <div className="profile-user-info">

                <h1>
                  {userName}
                </h1>

                <p>
                  {userEmail}
                </p>

                <div className="profile-badges">

                  <span className="premium-badge">
                    Premium Member
                  </span>

                  <span className="member-badge">
                    Member since 2022
                  </span>

                </div>

              </div>

            </div>

            <div className="profile-header-actions">

              <button
                type="button"
                className="edit-profile-btn"
              >
                <FaEdit />
                Edit Profile
              </button>

              <button
                type="button"
                className="analytics-btn"
              >
                View Analytics
              </button>

            </div>

          </div>

          {/* Statistics */}
          <div className="profile-stats">

            <div className="profile-stat-card">

              <div className="stat-icon purple">
                <FaShoppingBag />
              </div>

              <div className="stat-info">
                <span>
                  Total Orders
                </span>

                <strong>
                  24
                </strong>

                <small>
                  +2 this month
                </small>
              </div>

            </div>

            <div className="profile-stat-card">

              <div className="stat-icon green">
                <FaWallet />
              </div>

              <div className="stat-info">
                <span>
                  Wallet Balance
                </span>

                <strong>
                  $1,248.50
                </strong>
              </div>

            </div>

            <div className="profile-stat-card">

              <div className="stat-icon blue">
                <FaStar />
              </div>

              <div className="stat-info">
                <span>
                  Loyalty Points
                </span>

                <strong>
                  4,800
                </strong>
              </div>

            </div>

          </div>

          {/* Recent Orders */}
          <div className="recent-orders-card">

            <div className="recent-orders-header">

              <div>
                <h2>
                  Recent Orders
                </h2>
              </div>

              <Link to="/orders">
                View All
              </Link>

            </div>

            <div className="recent-orders-list">

              {recentOrders.map(
                (order) => (
                  <div
                    key={order.id}
                    className="recent-order"
                  >

                    <div className="order-product-icon">
                      <FaBox />
                    </div>

                    <div className="recent-order-info">

                      <h3>
                        {
                          order.title
                        }
                      </h3>

                      <p>
                        Order{" "}
                        {
                          order.id
                        }{" "}
                        • Placed{" "}
                        {
                          order.date
                        }
                      </p>

                    </div>

                    <div className="recent-order-price">
                      {
                        order.price
                      }
                    </div>

                    <div className="recent-order-status">

                      <span
                        className={`status-badge ${order.status.toLowerCase()}`}
                      >
                        {
                          order.status
                        }
                      </span>

                      <Link to="/orders">
                        Track Package
                      </Link>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </section>

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">

          <div
            className="logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <div className="logout-modal-icon">
              <FaSignOutAlt />
            </div>

            <h2 id="logout-modal-title">
              Sign Out?
            </h2>

            <p>
              Are you sure you want
              to sign out of your
              account?
            </p>

            <div className="logout-modal-actions">

              <button
                type="button"
                className="logout-cancel-btn"
                onClick={
                  cancelSignOut
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="logout-confirm-btn"
                onClick={
                  confirmSignOut
                }
              >
                Sign Out
              </button>

            </div>
          </div>

        </div>
      )}

    </main>
  );
}
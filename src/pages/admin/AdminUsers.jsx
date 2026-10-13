
import { useEffect, useMemo, useState } from "react";

import {
    FaUsers,
    FaUserShield,
    FaBuilding,
    FaSearch,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaRedo,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import "../../styles/AdminUsers.scss";

const USERS_KEY = "shopstreamAdminUsers";
const EDITS_KEY = "shopstreamAdminUserEdits";
const DELETED_KEY = "shopstreamAdminDeletedUsers";
const PAGE_SIZE = 8;

const emptyForm = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    role: "user",
};

function readArray(key) {
    try {
        const result = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(result) ? result : [];
    } catch {
        return [];
    }
}

function readEdits() {
    try {
        const result = JSON.parse(localStorage.getItem(EDITS_KEY) || "{}");

        return result &&
            typeof result === "object" &&
            !Array.isArray(result)
            ? result
            : {};
    } catch {
        return {};
    }
}

function getCompanyName(user) {
    if (typeof user.company === "string") {
        return user.company;
    }

    return user.company?.name || "—";
}

function getRoleLabel(role) {
    if (role === "admin") return "Admin";
    if (role === "moderator") return "Moderator";
    return "Customer";
}

function getRoleClass(role) {
    if (role === "admin") return "is-admin";
    if (role === "moderator") return "is-moderator";
    return "";
}

function applyUserChanges(users) {
    const edits = readEdits();
    const deletedIds = new Set(
        readArray(DELETED_KEY).map(String)
    );

    return users
        .filter((user) => !deletedIds.has(String(user.id)))
        .map((user) => ({
            ...user,
            ...(edits[String(user.id)] || {}),
        }));
}

function getInitials(user) {
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""
        }`.toUpperCase() || "?";
}

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    const [formData, setFormData] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchUsers() {
            const savedUsers = readArray(USERS_KEY);
            setUsers(applyUserChanges(savedUsers));

            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "https://dummyjson.com/users?limit=0",
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Failed to load users.");
                }

                const data = await response.json();

                setUsers(
                    applyUserChanges([
                        ...savedUsers,
                        ...(data.users || []),
                    ])
                );
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(
                        "Couldn't load online users. Locally saved users remain available."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchUsers();

        return () => controller.abort();
    }, [retry]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter((user) => {
            const fullName =
                `${user.firstName || ""} ${user.lastName || ""}`;

            return [
                fullName,
                user.username,
                user.email,
                user.phone,
                getCompanyName(user),
                getRoleLabel(user.role),
            ].some((value) =>
                String(value || "").toLowerCase().includes(query)
            );
        });
    }, [users, search]);

    const pageCount = Math.max(
        1,
        Math.ceil(filteredUsers.length / PAGE_SIZE)
    );

    const safePage = Math.min(currentPage, pageCount);

    const visibleUsers = filteredUsers.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    const adminCount = users.filter(
        (user) => user.role === "admin"
    ).length;

    const companyCount = new Set(
        users
            .map(getCompanyName)
            .filter((name) => name !== "—")
    ).size;

    function openAddForm() {
        setEditingUser(null);
        setFormData(emptyForm);
        setFormError("");
        setSuccessMessage("");
        setShowForm(true);
    }

    function openEditForm(user) {
        setEditingUser(user);

        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "user",
        });

        setFormError("");
        setSuccessMessage("");
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingUser(null);
        setFormData(emptyForm);
        setFormError("");
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormError("");
    }

    function handleSaveUser(event) {
        event.preventDefault();

        const firstName = formData.firstName.trim();
        const lastName = formData.lastName.trim();
        const username = formData.username.trim();
        const email = formData.email.trim();
        const phone = formData.phone.trim();

        if (!firstName || !lastName || !username || !email) {
            setFormError("Please fill in all required fields.");
            return;
        }

        const duplicate = users.some(
            (user) =>
                String(user.id) !== String(editingUser?.id) &&
                (
                    user.username?.toLowerCase() === username.toLowerCase() ||
                    user.email?.toLowerCase() === email.toLowerCase()
                )
        );

        if (duplicate) {
            setFormError(
                "This username or email is already in the list."
            );
            return;
        }

        const updatedFields = {
            firstName,
            lastName,
            username,
            email,
            phone,
            role: formData.role,
        };

        try {
            if (editingUser) {
                const edits = readEdits();

                localStorage.setItem(
                    EDITS_KEY,
                    JSON.stringify({
                        ...edits,
                        [String(editingUser.id)]: updatedFields,
                    })
                );

                setUsers((previous) =>
                    previous.map((user) =>
                        String(user.id) === String(editingUser.id)
                            ? { ...user, ...updatedFields }
                            : user
                    )
                );

                setSuccessMessage("User updated successfully.");
            } else {
                const newUser = {
                    id: `local-user-${Date.now()}`,
                    ...updatedFields,
                    image: "",
                    isLocalUser: true,
                };

                localStorage.setItem(
                    USERS_KEY,
                    JSON.stringify([
                        newUser,
                        ...readArray(USERS_KEY),
                    ])
                );

                setUsers((previous) => [
                    newUser,
                    ...previous,
                ]);

                setSuccessMessage(
                    "User added to the local directory."
                );
            }

            setCurrentPage(1);
            closeForm();
        } catch {
            setFormError(
                "Couldn't save the changes in browser storage."
            );
        }
    }

    function handleDeleteUser() {
        if (!deletingUser) return;

        try {
            const id = String(deletingUser.id);

            if (
                deletingUser.isLocalUser ||
                id.startsWith("local-user-")
            ) {
                localStorage.setItem(
                    USERS_KEY,
                    JSON.stringify(
                        readArray(USERS_KEY).filter(
                            (user) => String(user.id) !== id
                        )
                    )
                );
            }

            const deletedIds = readArray(DELETED_KEY).map(String);

            if (!deletedIds.includes(id)) {
                localStorage.setItem(
                    DELETED_KEY,
                    JSON.stringify([...deletedIds, id])
                );
            }

            const edits = readEdits();
            delete edits[id];

            localStorage.setItem(
                EDITS_KEY,
                JSON.stringify(edits)
            );

            setUsers((previous) =>
                previous.filter(
                    (user) => String(user.id) !== id
                )
            );

            setDeletingUser(null);
            setSuccessMessage(
                "User removed from the local directory."
            );
        } catch {
            setError(
                "Couldn't save the deletion in browser storage."
            );

            setDeletingUser(null);
        }
    }

    return (
        <section className="admin-users-page">
            {/* Page Header */}
            <div className="users-page-header">
                <div>
                    <div className="users-breadcrumb">
                        ShopStream / Customers
                    </div>

                    <h2 className="users-page-title">
                        User Directory
                    </h2>

                    <p className="users-page-subtitle">
                        Review and manage customer information.
                    </p>
                </div>

                <button
                    type="button"
                    className="users-add-button"
                    onClick={openAddForm}
                >
                    <FaPlus />
                    Add New User
                </button>
            </div>

            {successMessage && (
                <div
                    className="alert alert-success small"
                    role="status"
                >
                    {successMessage}
                </div>
            )}

            {/* Summary Cards */}
            <div className="users-stats-grid">
                <article className="users-stat-card">
                    <div>
                        <div className="users-stat-label">
                            Total Users
                        </div>

                        <h3 className="users-stat-value">
                            {loading
                                ? "—"
                                : users.length.toLocaleString("en-US")}
                        </h3>

                        <div className="users-stat-description">
                            Users in the current directory
                        </div>
                    </div>

                    <div className="users-stat-icon">
                        <FaUsers />
                    </div>
                </article>

                <article className="users-stat-card">
                    <div>
                        <div className="users-stat-label">
                            Admin Accounts
                        </div>

                        <h3 className="users-stat-value">
                            {loading ? "—" : adminCount}
                        </h3>

                        <div className="users-stat-description">
                            Accounts marked as administrators
                        </div>
                    </div>

                    <div className="users-stat-icon is-green">
                        <FaUserShield />
                    </div>
                </article>

                <article className="users-stat-card">
                    <div>
                        <div className="users-stat-label">
                            Companies Represented
                        </div>

                        <h3 className="users-stat-value">
                            {loading ? "—" : companyCount}
                        </h3>

                        <div className="users-stat-description">
                            Unique companies in the directory
                        </div>
                    </div>

                    <div className="users-stat-icon is-blue">
                        <FaBuilding />
                    </div>
                </article>
            </div>

            {/* User Directory */}
            <div className="users-directory-card">
                <div className="users-toolbar">
                    <div className="users-search">
                        <FaSearch />

                        <input
                            type="search"
                            placeholder="Search by name, email, username, or company..."
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setCurrentPage(1);
                            }}
                            aria-label="Search users"
                        />
                    </div>

                    <span className="users-table-summary">
                        {filteredUsers.length} users found
                    </span>
                </div>

                {error && (
                    <div
                        className="alert alert-warning m-3 d-flex justify-content-between align-items-center gap-3"
                        role="alert"
                    >
                        <span>{error}</span>

                        <button
                            type="button"
                            className="users-action-button is-edit"
                            onClick={() => setRetry((value) => value + 1)}
                            title="Retry loading users"
                        >
                            <FaRedo />
                        </button>
                    </div>
                )}

                {/* Users Table */}
                <div className="users-table-wrap">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Contact</th>
                                <th>Company</th>
                                <th>Role</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-5"
                                    >
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Loading users...
                                    </td>
                                </tr>
                            ) : visibleUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center text-secondary py-5"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                visibleUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="users-person">
                                                <div className="users-avatar">
                                                    {user.image ? (
                                                        <img
                                                            src={user.image}
                                                            alt={`${user.firstName} ${user.lastName}`}
                                                            onError={(event) => {
                                                                event.currentTarget.style.display =
                                                                    "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        getInitials(user)
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="users-person-name">
                                                        {user.firstName} {user.lastName}
                                                    </div>

                                                    <div className="users-person-username">
                                                        @{user.username || "unknown"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="users-contact-email">
                                                {user.email || "—"}
                                            </div>

                                            <div className="users-contact-phone">
                                                {user.phone || "No phone provided"}
                                            </div>
                                        </td>

                                        <td>{getCompanyName(user)}</td>

                                        <td>
                                            <span
                                                className={`users-role-badge ${getRoleClass(
                                                    user.role
                                                )}`}
                                            >
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="users-actions">
                                                <button
                                                    type="button"
                                                    className="users-action-button is-edit"
                                                    title="Edit user"
                                                    aria-label={`Edit ${user.firstName} ${user.lastName}`}
                                                    onClick={() => openEditForm(user)}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="users-action-button is-delete"
                                                    title="Delete user"
                                                    aria-label={`Delete ${user.firstName} ${user.lastName}`}
                                                    onClick={() => setDeletingUser(user)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filteredUsers.length > 0 && (
                    <div className="users-table-footer">
                        <span className="users-table-summary">
                            Showing {(safePage - 1) * PAGE_SIZE + 1}–
                            {Math.min(
                                safePage * PAGE_SIZE,
                                filteredUsers.length
                            )}{" "}
                            of {filteredUsers.length} users
                        </span>

                        <div className="users-pagination">
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={safePage === 1}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.max(1, page - 1)
                                    )
                                }
                            >
                                <FaChevronLeft />
                            </button>

                            <button
                                type="button"
                                className="is-active"
                                aria-current="page"
                            >
                                {safePage}
                            </button>

                            <span className="users-page-indicator">
                                of {pageCount}
                            </span>

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
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add / Edit User Modal */}
            {showForm && (
                <div
                    className="admin-user-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeForm();
                        }
                    }}
                >
                    <section
                        className="admin-user-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="admin-user-modal-title"
                    >
                        <div className="admin-user-modal-header">
                            <h3 id="admin-user-modal-title">
                                {editingUser ? "Edit User" : "Add New User"}
                            </h3>

                            <button
                                type="button"
                                aria-label="Close user form"
                                onClick={closeForm}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser}>
                            <div className="admin-user-modal-body">
                                <div className="admin-user-form-grid">
                                    <div className="admin-user-form-field">
                                        <label htmlFor="user-first-name">
                                            First Name *
                                        </label>

                                        <input
                                            id="user-first-name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="admin-user-form-field">
                                        <label htmlFor="user-last-name">
                                            Last Name *
                                        </label>

                                        <input
                                            id="user-last-name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="admin-user-form-field">
                                        <label htmlFor="user-username">
                                            Username *
                                        </label>

                                        <input
                                            id="user-username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="admin-user-form-field">
                                        <label htmlFor="user-email">
                                            Email *
                                        </label>

                                        <input
                                            id="user-email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="admin-user-form-field">
                                        <label htmlFor="user-phone">
                                            Phone
                                        </label>

                                        <input
                                            id="user-phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="admin-user-form-field">
                                        <label htmlFor="user-role">
                                            Role
                                        </label>

                                        <select
                                            id="user-role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                        >
                                            <option value="user">Customer</option>
                                            <option value="moderator">Moderator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="admin-user-modal-note">
                                    Demo mode: changes are stored in this browser only.
                                    These changes do not create real DummyJSON accounts
                                    or alter the two fixed demo login accounts.
                                </div>

                                {formError && (
                                    <div
                                        className="admin-user-modal-error"
                                        role="alert"
                                    >
                                        {formError}
                                    </div>
                                )}
                            </div>

                            <div className="admin-user-modal-footer">
                                <button
                                    type="button"
                                    className="admin-user-cancel"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-user-submit"
                                >
                                    {editingUser ? "Save Changes" : "Create User"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* Delete User Confirmation */}
            {deletingUser && (
                <div
                    className="admin-user-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setDeletingUser(null);
                        }
                    }}
                >
                    <section
                        className="admin-user-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-user-title"
                    >
                        <div className="admin-user-modal-header">
                            <h3 id="delete-user-title">
                                Delete User Account?
                            </h3>

                            <button
                                type="button"
                                aria-label="Close delete confirmation"
                                onClick={() => setDeletingUser(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="admin-user-modal-body">
                            <p className="text-secondary small mb-3">
                                Are you sure you want to remove this user from
                                the local directory?
                            </p>

                            <div className="users-person">
                                <div className="users-avatar">
                                    {deletingUser.image ? (
                                        <img
                                            src={deletingUser.image}
                                            alt=""
                                        />
                                    ) : (
                                        getInitials(deletingUser)
                                    )}
                                </div>

                                <div>
                                    <div className="users-person-name">
                                        {deletingUser.firstName}{" "}
                                        {deletingUser.lastName}
                                    </div>

                                    <div className="users-contact-email">
                                        {deletingUser.email}
                                    </div>
                                </div>
                            </div>

                            <div className="admin-user-modal-note">
                                This only removes the user from this local demo.
                                It does not delete an account from DummyJSON.
                            </div>
                        </div>

                        <div className="admin-user-modal-footer">
                            <button
                                type="button"
                                className="admin-user-cancel"
                                onClick={() => setDeletingUser(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-user-submit is-danger"
                                onClick={handleDeleteUser}
                            >
                                <FaTrash />
                                Confirm Delete
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}

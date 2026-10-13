
import { useEffect, useState } from "react";

import {
    FaBoxOpen,
    FaSearch,
    FaRedo,
    FaPlus,
    FaTimes,
    FaEdit,
    FaFilter,
    FaFileExport,
    FaChartLine,
    FaShoppingCart,
    FaClipboardCheck,
    FaTrash,
    FaCloudUploadAlt,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import "../../styles/AdminProducts.scss";

const STORAGE_KEY = "shopstreamAdminProducts";
const EDITS_KEY = "shopstreamAdminProductEdits";
const DELETED_KEY = "shopstreamAdminDeletedProducts";
const PAGE_SIZE = 4;

const emptyForm = {
    title: "",
    sku: "",
    category: "smartphones",
    price: "",
    stock: "",
    description: "",
    thumbnail: "",
};

function getStoredArray(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function getSavedEdits() {
    try {
        const data = JSON.parse(localStorage.getItem(EDITS_KEY) || "{}");

        return data &&
            typeof data === "object" &&
            !Array.isArray(data)
            ? data
            : {};
    } catch {
        return {};
    }
}

function getVisibleProducts(products) {
    const edits = getSavedEdits();
    const deletedIds = new Set(
        getStoredArray(DELETED_KEY).map(String)
    );

    return products
        .filter((product) => !deletedIds.has(String(product.id)))
        .map((product) => ({
            ...product,
            ...(edits[String(product.id)] || {}),
        }));
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(value) || 0);
}

function formatCategory(category = "") {
    return category.replace(/-/g, " ");
}

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");

    const [showFilters, setShowFilters] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);

    const [formData, setFormData] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchProducts() {
            setProducts(getVisibleProducts(getStoredArray(STORAGE_KEY)));

            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "https://dummyjson.com/products?limit=0",
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Failed to load products.");
                }

                const data = await response.json();

                const allProducts = [
                    ...getStoredArray(STORAGE_KEY),
                    ...(data.products || []),
                ];

                setProducts(getVisibleProducts(allProducts));
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(
                        "Couldn't load online products. Locally saved products remain available."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchProducts();

        return () => controller.abort();
    }, [retry]);

    const categories = [
        ...new Set(
            products.map((product) => product.category).filter(Boolean)
        ),
    ].sort();

    const filteredProducts = products.filter((product) => {
        const query = search.trim().toLowerCase();

        const matchesSearch = [
            product.title,
            product.sku,
            product.category,
        ].some((value) =>
            String(value || "").toLowerCase().includes(query)
        );

        const matchesCategory =
            categoryFilter === "all" ||
            product.category === categoryFilter;

        const stock = Number(product.stock ?? 0);

        const matchesStock =
            stockFilter === "all" ||
            (stockFilter === "in-stock" && stock > 10) ||
            (stockFilter === "low-stock" && stock > 0 && stock <= 10) ||
            (stockFilter === "out-of-stock" && stock === 0);

        return matchesSearch && matchesCategory && matchesStock;
    });

    const pageCount = Math.max(
        1,
        Math.ceil(filteredProducts.length / PAGE_SIZE)
    );

    const safePage = Math.min(currentPage, pageCount);

    const visibleProducts = filteredProducts.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    const lowStockCount = products.filter((product) => {
        const stock = Number(product.stock ?? 0);
        return stock > 0 && stock <= 10;
    }).length;

    function changeFormField(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormError("");
    }

    function openAddForm() {
        setEditingProduct(null);
        setFormData(emptyForm);
        setFormError("");
        setSuccessMessage("");
        setShowForm(true);
    }

    function openEditForm(product) {
        setEditingProduct(product);

        setFormData({
            title: product.title || "",
            sku: product.sku || `SKU-${product.id}`,
            category: product.category || "smartphones",
            price: String(product.price ?? ""),
            stock: String(product.stock ?? 0),
            description: product.description || "",
            thumbnail: product.thumbnail || "",
        });

        setFormError("");
        setSuccessMessage("");
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingProduct(null);
        setFormData(emptyForm);
        setFormError("");
    }

    function handleImageUpload(event) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setFormError("Please select a valid image file.");
            return;
        }

        if (file.size > 1024 * 1024) {
            setFormError("Please select an image smaller than 1 MB.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setFormData((previous) => ({
                ...previous,
                thumbnail: String(reader.result),
            }));

            setFormError("");
        };

        reader.onerror = () => {
            setFormError("Couldn't read the selected image.");
        };

        reader.readAsDataURL(file);
    }

    function handleSaveProduct(event) {
        event.preventDefault();
        setFormError("");
        setSuccessMessage("");

        const title = formData.title.trim();
        const sku = formData.sku.trim();
        const category = formData.category.trim();
        const price = Number(formData.price);
        const stock = Number(formData.stock);

        if (!title || !sku || !category) {
            setFormError("Please complete the required fields.");
            return;
        }

        if (
            formData.price === "" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            setFormError("Please enter a valid price.");
            return;
        }

        if (
            formData.stock === "" ||
            !Number.isInteger(stock) ||
            stock < 0
        ) {
            setFormError("Stock must be a non-negative whole number.");
            return;
        }

        const updatedFields = {
            title,
            sku,
            category: category.toLowerCase(),
            price,
            stock,
            description: formData.description.trim(),
            thumbnail:
                formData.thumbnail ||
                "https://placehold.co/100x100?text=Product",
        };

        try {
            if (editingProduct) {
                const edits = getSavedEdits();

                localStorage.setItem(
                    EDITS_KEY,
                    JSON.stringify({
                        ...edits,
                        [String(editingProduct.id)]: updatedFields,
                    })
                );

                setProducts((previous) =>
                    previous.map((product) =>
                        product.id === editingProduct.id
                            ? { ...product, ...updatedFields }
                            : product
                    )
                );

                setSuccessMessage("Product updated successfully.");
            } else {
                const newProduct = {
                    id: `local-${Date.now()}`,
                    ...updatedFields,
                    rating: 0,
                    discountPercentage: 0,
                    isLocalProduct: true,
                };

                const savedProducts = getStoredArray(STORAGE_KEY);

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify([newProduct, ...savedProducts])
                );

                setProducts((previous) => [newProduct, ...previous]);

                setSuccessMessage("Product added successfully.");
            }

            setCurrentPage(1);
            closeForm();
        } catch {
            setFormError(
                "Couldn't save the changes. Browser storage may be full."
            );
        }
    }

    function handleDeleteProduct() {
        if (!deletingProduct) return;

        try {
            const product = deletingProduct;

            if (product.isLocalProduct || String(product.id).startsWith("local-")) {
                const savedProducts = getStoredArray(STORAGE_KEY).filter(
                    (item) => String(item.id) !== String(product.id)
                );

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(savedProducts)
                );
            } else {
                const deletedIds = getStoredArray(DELETED_KEY);

                if (!deletedIds.map(String).includes(String(product.id))) {
                    localStorage.setItem(
                        DELETED_KEY,
                        JSON.stringify([...deletedIds, product.id])
                    );
                }
            }

            setProducts((previous) =>
                previous.filter(
                    (item) => String(item.id) !== String(product.id)
                )
            );

            const edits = getSavedEdits();
            delete edits[String(product.id)];

            localStorage.setItem(EDITS_KEY, JSON.stringify(edits));

            setDeletingProduct(null);
            setSuccessMessage("Product deleted from the local inventory.");
        } catch {
            setError("Couldn't delete the product from browser storage.");
            setDeletingProduct(null);
        }
    }

    function handleExportCSV() {
        const headers = ["ID", "Product", "SKU", "Category", "Price", "Stock"];

        const escapeCSV = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const rows = filteredProducts.map((product) => [
            product.id,
            product.title,
            product.sku || "",
            product.category,
            product.price,
            product.stock,
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map(escapeCSV).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "shopstream-products.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function clearFilters() {
        setSearch("");
        setCategoryFilter("all");
        setStockFilter("all");
        setCurrentPage(1);
    }

    return (
        <section className="admin-products-page">
            {/* Heading */}
            <div className="admin-products-heading">
                <div>
                    <div className="admin-breadcrumb">
                        ShopStream / Product Dashboard
                    </div>

                    <h2 className="admin-products-title">
                        Product Inventory
                    </h2>

                    <p className="admin-products-subtitle">
                        Manage your catalog, stock levels, and pricing.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={openAddForm}
                >
                    <FaPlus />
                    Add New Product
                </button>
            </div>

            {successMessage && (
                <div className="alert alert-success small" role="status">
                    {successMessage}
                </div>
            )}

            {/* Inventory */}
            <div className="admin-inventory-card">
                <div className="admin-product-toolbar">
                    <div className="admin-product-search">
                        <FaSearch />

                        <input
                            type="search"
                            placeholder="Search products by name, SKU, or category..."
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setCurrentPage(1);
                            }}
                            aria-label="Search inventory"
                        />
                    </div>

                    <div className="admin-toolbar-actions">
                        <button
                            type="button"
                            className="admin-outline-btn"
                            onClick={() => setShowFilters((value) => !value)}
                        >
                            <FaFilter />
                            Filters
                        </button>

                        <button
                            type="button"
                            className="admin-outline-btn"
                            onClick={handleExportCSV}
                            disabled={filteredProducts.length === 0}
                        >
                            <FaFileExport />
                            Export CSV
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="admin-filter-panel">
                        <div>
                            <label htmlFor="admin-category-filter">
                                Category
                            </label>

                            <select
                                id="admin-category-filter"
                                value={categoryFilter}
                                onChange={(event) => {
                                    setCategoryFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Categories</option>

                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {formatCategory(category)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="admin-stock-filter">
                                Stock Status
                            </label>

                            <select
                                id="admin-stock-filter"
                                value={stockFilter}
                                onChange={(event) => {
                                    setStockFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Stock Levels</option>
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                                <option value="out-of-stock">Out of Stock</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            className="admin-outline-btn"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {error && (
                    <div
                        className="alert alert-warning m-3 d-flex flex-wrap justify-content-between align-items-center gap-3"
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

                <div className="admin-products-table-wrap">
                    <table className="admin-products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock Status</th>
                                <th className="text-end">Actions</th>
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
                                        Loading products...
                                    </td>
                                </tr>
                            ) : visibleProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-5 text-secondary"
                                    >
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                visibleProducts.map((product) => {
                                    const stock = Number(product.stock ?? 0);

                                    const stockClass =
                                        stock === 0
                                            ? "is-out-of-stock"
                                            : stock <= 10
                                                ? "is-low-stock"
                                                : "is-in-stock";

                                    const stockText =
                                        stock === 0
                                            ? "Out of Stock"
                                            : stock <= 10
                                                ? `Only ${stock} Left`
                                                : `${stock} In Stock`;

                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="admin-product-cell">
                                                    <div className="admin-product-thumb">
                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.title}
                                                            loading="lazy"
                                                            onError={(event) => {
                                                                event.currentTarget.src =
                                                                    "https://placehold.co/100x100?text=Product";
                                                            }}
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="admin-product-name">
                                                            {product.title}
                                                        </div>

                                                        <div className="admin-product-sku">
                                                            SKU: {product.sku || `SKU-${product.id}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="admin-category-pill">
                                                    {formatCategory(product.category)}
                                                </span>
                                            </td>

                                            <td className="fw-semibold">
                                                {formatCurrency(product.price)}
                                            </td>

                                            <td>
                                                <span
                                                    className={`admin-stock-status ${stockClass}`}
                                                >
                                                    {stockText}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-product-actions">
                                                    <button
                                                        type="button"
                                                        className="admin-icon-btn is-edit"
                                                        title="Edit product"
                                                        aria-label={`Edit ${product.title}`}
                                                        onClick={() => openEditForm(product)}
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-icon-btn is-delete"
                                                        title="Delete product"
                                                        aria-label={`Delete ${product.title}`}
                                                        onClick={() => setDeletingProduct(product)}
                                                    >
                                                        <FaTrash />
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

                {!loading && filteredProducts.length > 0 && (
                    <div className="admin-table-footer">
                        <span className="admin-table-count">
                            Showing {(safePage - 1) * PAGE_SIZE + 1} to{" "}
                            {Math.min(safePage * PAGE_SIZE, filteredProducts.length)} of{" "}
                            {filteredProducts.length} products
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
                                <FaChevronLeft />
                            </button>

                            {Array.from({ length: pageCount }, (_, index) => index + 1)
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === pageCount ||
                                        Math.abs(page - safePage) <= 1
                                )
                                .map((page, index, pages) => (
                                    <span key={page} className="admin-page-number">
                                        {index > 0 && page - pages[index - 1] > 1
                                            ? "…"
                                            : null}

                                        <button
                                            type="button"
                                            className={page === safePage ? "is-active" : ""}
                                            onClick={() => setCurrentPage(page)}
                                            aria-current={page === safePage ? "page" : undefined}
                                        >
                                            {page}
                                        </button>
                                    </span>
                                ))}

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

            {/* Bottom summary cards */}
            <div className="admin-bottom-stats">
                <article className="admin-mini-stat">
                    <div className="admin-mini-stat-top">
                        <span className="admin-mini-stat-icon">
                            <FaChartLine />
                        </span>

                        <span className="admin-mini-stat-change">
                            Demo metric
                        </span>
                    </div>

                    <div className="admin-mini-stat-label">
                        Total Sales
                    </div>

                    <h3 className="admin-mini-stat-value">
                        $48,290.00
                    </h3>
                </article>

                <article className="admin-mini-stat">
                    <div className="admin-mini-stat-top">
                        <span className="admin-mini-stat-icon">
                            <FaShoppingCart />
                        </span>

                        <span className="admin-mini-stat-change">
                            Sample data
                        </span>
                    </div>

                    <div className="admin-mini-stat-label">
                        Active Carts
                    </div>

                    <h3 className="admin-mini-stat-value">
                        1,240
                    </h3>
                </article>

                <article className="admin-mini-stat">
                    <div className="admin-mini-stat-top">
                        <span
                            className="admin-mini-stat-icon"
                            style={{
                                background: "#e1fff2",
                                color: "#16a779",
                            }}
                        >
                            <FaClipboardCheck />
                        </span>

                        <span className="admin-mini-stat-change">
                            Current inventory
                        </span>
                    </div>

                    <div className="admin-mini-stat-label">
                        Low Stock Alerts
                    </div>

                    <h3 className="admin-mini-stat-value">
                        {lowStockCount}
                    </h3>
                </article>
            </div>

            {/* Add / Edit Product Modal */}
            {showForm && (
                <div
                    className="admin-product-modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeForm();
                        }
                    }}
                >
                    <section
                        className="admin-product-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="admin-product-modal-title"
                    >
                        <div className="admin-product-modal-header">
                            <h3 id="admin-product-modal-title">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </h3>

                            <button
                                type="button"
                                aria-label="Close modal"
                                onClick={closeForm}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct}>
                            <div className="admin-product-modal-body">
                                <div className="admin-product-form-grid">
                                    <div className="admin-product-form-field">
                                        <label htmlFor="modal-product-name">
                                            Product Name
                                        </label>

                                        <input
                                            id="modal-product-name"
                                            name="title"
                                            value={formData.title}
                                            onChange={changeFormField}
                                            placeholder="e.g. SonicWave Pro 2"
                                            required
                                        />
                                    </div>

                                    <div className="admin-product-form-field">
                                        <label htmlFor="modal-product-sku">
                                            SKU
                                        </label>

                                        <input
                                            id="modal-product-sku"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={changeFormField}
                                            placeholder="SKU-0000-XX"
                                            required
                                        />
                                    </div>

                                    <div className="admin-product-form-field">
                                        <label htmlFor="modal-product-category">
                                            Category
                                        </label>

                                        <select
                                            id="modal-product-category"
                                            name="category"
                                            value={formData.category}
                                            onChange={changeFormField}
                                            required
                                        >
                                            {[...new Set([
                                                "smartphones",
                                                ...categories,
                                                formData.category,
                                            ].filter(Boolean))].map((category) => (
                                                <option key={category} value={category}>
                                                    {formatCategory(category)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="admin-product-form-field">
                                        <label htmlFor="modal-product-price">
                                            Price ($)
                                        </label>

                                        <input
                                            id="modal-product-price"
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={changeFormField}
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    <div className="admin-product-form-field is-full-width">
                                        <label htmlFor="modal-product-stock">
                                            Stock Quantity
                                        </label>

                                        <input
                                            id="modal-product-stock"
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={changeFormField}
                                            min="0"
                                            step="1"
                                            placeholder="0"
                                            required
                                        />
                                    </div>

                                    <div className="admin-product-form-field is-full-width">
                                        <label htmlFor="modal-product-description">
                                            Description
                                        </label>

                                        <textarea
                                            id="modal-product-description"
                                            name="description"
                                            value={formData.description}
                                            onChange={changeFormField}
                                            placeholder="Enter product details..."
                                        />
                                    </div>

                                    <div className="admin-product-form-field is-full-width">
                                        <label>Product Images</label>

                                        <label className="admin-product-upload">
                                            <FaCloudUploadAlt />

                                            <span>
                                                Click to select an image (maximum 1 MB)
                                            </span>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </label>

                                        {formData.thumbnail && (
                                            <div className="admin-product-image-preview">
                                                <img
                                                    src={formData.thumbnail}
                                                    alt="Product preview"
                                                />

                                                <span>
                                                    Image selected for this product
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {formError && (
                                    <div
                                        className="admin-product-modal-error"
                                        role="alert"
                                    >
                                        {formError}
                                    </div>
                                )}
                            </div>

                            <div className="admin-product-modal-footer">
                                <button
                                    type="button"
                                    className="admin-modal-cancel"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-modal-submit"
                                >
                                    {editingProduct ? "Save Changes" : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* Delete confirmation modal will be styled in the next step */}
            {deletingProduct && (
                <div className="admin-product-modal-backdrop">
                    <section
                        className="admin-product-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-product-title"
                    >
                        <div className="admin-product-modal-header">
                            <h3 id="delete-product-title">
                                Delete Product?
                            </h3>

                            <button
                                type="button"
                                aria-label="Close delete confirmation"
                                onClick={() => setDeletingProduct(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="admin-product-modal-body">
                            Are you sure you want to delete{" "}
                            <strong>{deletingProduct.title}</strong> from the local
                            inventory? This action cannot be undone here.
                        </div>

                        <div className="admin-product-modal-footer">
                            <button
                                type="button"
                                className="admin-modal-cancel"
                                onClick={() => setDeletingProduct(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-modal-submit"
                                style={{
                                    background: "#dc3545",
                                    borderColor: "#dc3545",
                                }}
                                onClick={handleDeleteProduct}
                            >
                                <FaTrash className="me-2" />
                                Confirm Delete
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}

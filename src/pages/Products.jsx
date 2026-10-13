import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Toaster } from "react-hot-toast";

import {
    FaStar,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";

import {
    getProducts,
    getProductCategories,
    setCategory,
    setPriceRange,
    setRating,
    setBrand,
    setSort,
    clearFilters,
} from "../store/productSlice";

import "../styles/Product.scss";

export default function Products() {
    const dispatch = useDispatch();

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const {
        products,
        total,

        isLoading,
        error,

        categories,
        categoriesLoading,
        categoriesError,

        search,
        category,

        sortBy,
        order,

        minPrice,
        maxPrice,

        minRating,

        brand,
    } = useSelector(
        (state) => state.products
    );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const limit = 16;

    const urlSearch =
        searchParams.get("search") || "";

    const totalPages =
        Math.ceil(total / limit);

    const firstProduct =
        total === 0
            ? 0
            : (currentPage - 1) * limit + 1;

    const lastProduct =
        Math.min(
            currentPage * limit,
            total
        );

    // =========================================
    // Categories
    // =========================================

    useEffect(() => {
        dispatch(
            getProductCategories()
        );
    }, [dispatch]);

    // =========================================
    // Clear category when searching
    // =========================================

    useEffect(() => {
        if (urlSearch && category) {
            dispatch(setCategory(""));
        }
    }, [
        urlSearch,
        category,
        dispatch,
    ]);

    // =========================================
    // Get Products
    // =========================================

    useEffect(() => {
        const skip =
            (currentPage - 1) * limit;

        dispatch(
            getProducts({
                limit,
                skip,
                search: urlSearch,
                category,
                sortBy,
                order,
                minPrice,
                maxPrice,
                minRating,
                brand,
            })
        );
    }, [
        dispatch,
        currentPage,
        urlSearch,
        category,
        sortBy,
        order,
        minPrice,
        maxPrice,
        minRating,
        brand,
    ]);

    // =========================================
    // Pagination
    // =========================================

    function handlePageChange(page) {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function goToFirstPage() {
        handlePageChange(1);
    }

    function goToPreviousPage() {
        if (currentPage > 1) {
            handlePageChange(
                currentPage - 1
            );
        }
    }

    function goToNextPage() {
        if (currentPage < totalPages) {
            handlePageChange(
                currentPage + 1
            );
        }
    }

    function goToLastPage() {
        handlePageChange(totalPages);
    }

    // =========================================
    // Category
    // =========================================

    function handleCategoryChange(
        selectedCategory
    ) {
        if (
            category ===
            selectedCategory
        ) {
            dispatch(
                setCategory("")
            );
        } else {
            dispatch(
                setCategory(
                    selectedCategory
                )
            );
        }

        setCurrentPage(1);

        if (urlSearch) {
            setSearchParams({});
        }
    }

    // =========================================
    // Price Range
    // =========================================

    function handleMinPriceChange(
        event
    ) {
        const value =
            Number(event.target.value);

        const newMinPrice =
            Math.min(
                value,
                maxPrice - 1
            );

        dispatch(
            setPriceRange({
                minPrice: newMinPrice,
                maxPrice,
            })
        );

        setCurrentPage(1);
    }

    function handleMaxPriceChange(
        event
    ) {
        const value =
            Number(event.target.value);

        const newMaxPrice =
            Math.max(
                value,
                minPrice + 1
            );

        dispatch(
            setPriceRange({
                minPrice,
                maxPrice:
                    newMaxPrice,
            })
        );

        setCurrentPage(1);
    }

    // =========================================
    // Rating
    // =========================================

    function handleRatingChange(
        rating
    ) {
        dispatch(
            setRating(rating)
        );

        setCurrentPage(1);
    }

    // =========================================
    // Brand
    // =========================================

    function handleBrandChange(
        event
    ) {
        dispatch(
            setBrand(
                event.target.value
            )
        );

        setCurrentPage(1);
    }

    // =========================================
    // Sort
    // =========================================

    function handleSortChange(
        event
    ) {
        const value =
            event.target.value;

        if (value === "default") {
            dispatch(
                setSort({
                    sortBy: "",
                    order: "asc",
                })
            );
        }

        if (
            value ===
            "price-asc"
        ) {
            dispatch(
                setSort({
                    sortBy: "price",
                    order: "asc",
                })
            );
        }

        if (
            value ===
            "price-desc"
        ) {
            dispatch(
                setSort({
                    sortBy: "price",
                    order: "desc",
                })
            );
        }

        if (value === "rating") {
            dispatch(
                setSort({
                    sortBy: "rating",
                    order: "desc",
                })
            );
        }

        setCurrentPage(1);
    }

    function getCurrentSortValue() {
        if (!sortBy) {
            return "default";
        }

        if (
            sortBy === "price" &&
            order === "asc"
        ) {
            return "price-asc";
        }

        if (
            sortBy === "price" &&
            order === "desc"
        ) {
            return "price-desc";
        }

        if (
            sortBy === "rating"
        ) {
            return "rating";
        }

        return "default";
    }

    // =========================================
    // Clear Filters
    // =========================================

    function handleClearFilters() {
        dispatch(
            clearFilters()
        );

        setCurrentPage(1);

        setSearchParams({});
    }

    // =========================================
    // Loading
    // =========================================

    if (isLoading) {
        return (
            <div className="products-page">
                <h2>
                    Loading products...
                </h2>
            </div>
        );
    }

    // =========================================
    // Error
    // =========================================

    if (error) {
        return (
            <div className="products-page">
                <h2>
                    Error: {error}
                </h2>
            </div>
        );
    }

    return (
        <>
            {/* Toast container */}

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2500,
                }}
            />

            <main className="products-page">

                {/* =====================================
                    Header
                ===================================== */}

                <div className="products-header">

                    <div className="products-header-left">

                        <h1 className="products-header-title">

                            {urlSearch
                                ? `Search results for "${urlSearch}"`
                                : category
                                    ? category
                                        .replace(
                                            /-/g,
                                            " "
                                        )
                                        .replace(
                                            /\b\w/g,
                                            (letter) =>
                                                letter.toUpperCase()
                                        )
                                    : "All Products"}

                        </h1>

                        <p className="products-header-count">

                            Showing{" "}

                            {firstProduct}
                            -
                            {lastProduct}

                            {" "}of{" "}

                            {total}

                            {" "}results

                        </p>

                    </div>

                    {/* Sort */}

                    <div className="products-sort">

                        <label htmlFor="sort">
                            Sort by:
                        </label>

                        <select
                            id="sort"
                            value={
                                getCurrentSortValue()
                            }
                            onChange={
                                handleSortChange
                            }
                        >
                            <option value="default">
                                Default
                            </option>

                            <option value="price-asc">
                                Price: Low to High
                            </option>

                            <option value="price-desc">
                                Price: High to Low
                            </option>

                            <option value="rating">
                                Highest Rated
                            </option>
                        </select>

                    </div>

                </div>

                {/* =====================================
                    Main Layout
                ===================================== */}

                <div className="products-layout">

                    {/* =================================
                        Sidebar
                    ================================= */}

                    <aside className="products-sidebar">

                        {/* Category */}

                        <div className="filter-section">

                            <h3 className="filter-title">
                                Category
                            </h3>

                            <div className="filter-options">

                                {categoriesLoading && (
                                    <span>
                                        Loading categories...
                                    </span>
                                )}

                                {categoriesError && (
                                    <span>
                                        Failed to load categories.
                                    </span>
                                )}

                                {!categoriesLoading &&
                                    !categoriesError &&
                                    categories.map(
                                        (item) => (
                                            <label
                                                className="filter-option"
                                                key={item}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        category ===
                                                        item
                                                    }
                                                    onChange={() =>
                                                        handleCategoryChange(
                                                            item
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {item
                                                        .replace(
                                                            /-/g,
                                                            " "
                                                        )
                                                        .replace(
                                                            /\b\w/g,
                                                            (letter) =>
                                                                letter.toUpperCase()
                                                        )}
                                                </span>

                                            </label>
                                        )
                                    )}

                            </div>

                        </div>

                        {/* Price */}

                        <div className="filter-section">

                            <h3 className="filter-title">
                                Price Range
                            </h3>

                            <div className="price-range">

                                <input
                                    type="range"
                                    min="0"
                                    max="30000"
                                    value={
                                        minPrice
                                    }
                                    onChange={
                                        handleMinPriceChange
                                    }
                                    className="price-slider"
                                />

                                <input
                                    type="range"
                                    min="0"
                                    max="30000"
                                    value={
                                        maxPrice
                                    }
                                    onChange={
                                        handleMaxPriceChange
                                    }
                                    className="price-slider"
                                />

                                <div className="price-values">

                                    <span>
                                        ${minPrice}
                                    </span>

                                    <span>
                                        ${maxPrice}
                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* Rating */}

                        <div className="filter-section">

                            <h3 className="filter-title">
                                Rating
                            </h3>

                            <div className="rating-options">

                                <label className="rating-option">

                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={
                                            minRating === 4
                                        }
                                        onChange={() =>
                                            handleRatingChange(
                                                4
                                            )
                                        }
                                    />

                                    <span className="rating-stars">
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                    </span>

                                    <span>
                                        &amp; Up
                                    </span>

                                </label>

                                <label className="rating-option">

                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={
                                            minRating === 3
                                        }
                                        onChange={() =>
                                            handleRatingChange(
                                                3
                                            )
                                        }
                                    />

                                    <span className="rating-stars">
                                        <FaStar />
                                        <FaStar />
                                        <FaStar />
                                    </span>

                                    <span>
                                        &amp; Up
                                    </span>

                                </label>

                                <label className="rating-option">

                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={
                                            minRating === 2
                                        }
                                        onChange={() =>
                                            handleRatingChange(
                                                2
                                            )
                                        }
                                    />

                                    <span className="rating-stars">
                                        <FaStar />
                                        <FaStar />
                                    </span>

                                    <span>
                                        &amp; Up
                                    </span>

                                </label>

                                {minRating > 0 && (
                                    <button
                                        type="button"
                                        className="clear-rating-btn"
                                        onClick={() =>
                                            handleRatingChange(
                                                0
                                            )
                                        }
                                    >
                                        Clear rating
                                    </button>
                                )}

                            </div>

                        </div>

                        {/* Brand */}

                        <div className="filter-section">

                            <h3 className="filter-title">
                                Brand
                            </h3>

                            <select
                                className="brand-select"
                                value={brand}
                                onChange={
                                    handleBrandChange
                                }
                            >

                                <option value="">
                                    All Brands
                                </option>

                            </select>

                        </div>

                        {/* Clear Filters */}

                        <button
                            type="button"
                            className="clear-filters-btn"
                            onClick={
                                handleClearFilters
                            }
                        >
                            Clear Filters
                        </button>

                    </aside>

                    {/* =================================
                        Products
                    ================================= */}

                    <section className="products-content">

                        {products.length === 0 ? (

                            <div className="text-center py-5">

                                <h3>
                                    No products found
                                </h3>

                                <p>
                                    Try changing your filters.
                                </p>

                            </div>

                        ) : (

                            <div className="products-grid">

                                {products.map(
                                    (product) => (

                                        <div
                                            key={product.id}
                                        >

                                            <ProductCard
                                                product={
                                                    product
                                                }
                                            />

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                        {/* Pagination */}

                        {products.length > 0 && (

                            <div className="products-pagination">

                                {/* First */}

                                <button
                                    type="button"
                                    className="products-page-btn"
                                    onClick={
                                        goToFirstPage
                                    }
                                    disabled={
                                        currentPage === 1
                                    }
                                    aria-label="First page"
                                >
                                    <FaChevronLeft />
                                    <FaChevronLeft />
                                </button>

                                {/* Previous */}

                                <button
                                    type="button"
                                    className="products-page-btn"
                                    onClick={
                                        goToPreviousPage
                                    }
                                    disabled={
                                        currentPage === 1
                                    }
                                    aria-label="Previous page"
                                >
                                    <FaChevronLeft />
                                </button>

                                {/* Page 1 */}

                                <button
                                    type="button"
                                    className={`products-page-btn ${currentPage === 1
                                            ? "active"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        handlePageChange(
                                            1
                                        )
                                    }
                                >
                                    1
                                </button>

                                {/* Left dots */}

                                {currentPage > 3 && (
                                    <span className="products-pagination-dots">
                                        ...
                                    </span>
                                )}

                                {/* Middle pages */}

                                {Array.from(
                                    {
                                        length:
                                            totalPages,
                                    },
                                    (_, index) =>
                                        index + 1
                                )
                                    .filter(
                                        (page) =>
                                            page !== 1 &&
                                            page !==
                                            totalPages &&
                                            Math.abs(
                                                page -
                                                currentPage
                                            ) <= 1
                                    )
                                    .map(
                                        (page) => (

                                            <button
                                                type="button"
                                                key={page}
                                                className={`products-page-btn ${currentPage ===
                                                        page
                                                        ? "active"
                                                        : ""
                                                    }`}
                                                onClick={() =>
                                                    handlePageChange(
                                                        page
                                                    )
                                                }
                                            >
                                                {page}
                                            </button>

                                        )
                                    )}

                                {/* Right dots */}

                                {currentPage <
                                    totalPages - 2 && (
                                        <span className="products-pagination-dots">
                                            ...
                                        </span>
                                    )}

                                {/* Last page */}

                                {totalPages > 1 && (

                                    <button
                                        type="button"
                                        className={`products-page-btn ${currentPage ===
                                                totalPages
                                                ? "active"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            handlePageChange(
                                                totalPages
                                            )
                                        }
                                    >
                                        {totalPages}
                                    </button>

                                )}

                                {/* Next */}

                                <button
                                    type="button"
                                    className="products-page-btn"
                                    onClick={
                                        goToNextPage
                                    }
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    aria-label="Next page"
                                >
                                    <FaChevronRight />
                                </button>

                                {/* Last */}

                                <button
                                    type="button"
                                    className="products-page-btn"
                                    onClick={
                                        goToLastPage
                                    }
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    aria-label="Last page"
                                >
                                    <FaChevronRight />
                                    <FaChevronRight />
                                </button>

                            </div>

                        )}

                    </section>

                </div>

            </main>
        </>
    );
}
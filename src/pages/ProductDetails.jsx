import { useEffect, useState } from "react";

import {
    FaChevronRight,
    FaHeart,
    FaMinus,
    FaPlus,
    FaStar,
    FaTruck,
    FaUndo,
    FaShieldAlt,
    FaCheckCircle,
} from "react-icons/fa";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { useDispatch } from "react-redux";

import toast, {
    Toaster,
} from "react-hot-toast";

import { fetchProductById } from "../services/productServices";

import { addToCart } from "../store/cartSlice";

import "../styles/ProductDetails.scss";

export default function ProductDetails() {
    const { id } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);

    const [activeImage, setActiveImage] =
        useState("");

    const [quantity, setQuantity] =
        useState(1);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    // =========================================
    // Get Product
    // =========================================

    useEffect(() => {
        async function getProduct() {
            try {
                setIsLoading(true);
                setError(null);

                const data =
                    await fetchProductById(id);

                setProduct(data);

                if (data.images?.length) {
                    setActiveImage(
                        data.images[0]
                    );
                } else {
                    setActiveImage(
                        data.thumbnail
                    );
                }

                setQuantity(1);
            } catch (error) {
                setError(
                    "Failed to load product."
                );
            } finally {
                setIsLoading(false);
            }
        }

        getProduct();
    }, [id]);

    // =========================================
    // Quantity
    // =========================================

    function increaseQuantity() {
        setQuantity(
            (current) => current + 1
        );
    }

    function decreaseQuantity() {
        setQuantity(
            (current) =>
                current > 1
                    ? current - 1
                    : 1
        );
    }

    // =========================================
    // Add To Cart
    // =========================================

    function handleAddToCart() {
        dispatch(
            addToCart({
                ...product,
                quantity,
            })
        );

        toast.success(
            `${product.title} added to cart!`,
            {
                duration: 2500,
                position: "top-right",
            }
        );
    }

    // =========================================
    // Buy Now
    // =========================================

    function handleBuyNow() {
        dispatch(
            addToCart({
                ...product,
                quantity,
            })
        );

        toast.success(
            "Product added! Opening your cart...",
            {
                duration: 1200,
                position: "top-right",
            }
        );

        setTimeout(() => {
            navigate("/cart");
        }, 500);
    }

    // =========================================
    // Loading
    // =========================================

    if (isLoading) {
        return (
            <>
                <Toaster />

                <div className="container py-5">
                    <h2>
                        Loading product...
                    </h2>
                </div>
            </>
        );
    }

    // =========================================
    // Error
    // =========================================

    if (error) {
        return (
            <>
                <Toaster />

                <div className="container py-5">
                    <h2>{error}</h2>
                </div>
            </>
        );
    }

    // =========================================
    // No Product
    // =========================================

    if (!product) {
        return null;
    }

    const productImages =
        product.images?.length
            ? product.images
            : [product.thumbnail];

    const discountedPrice = (
        product.price *
        (1 -
            product.discountPercentage / 100)
    ).toFixed(2);

    return (
        <>
            <Toaster
                toastOptions={{
                    style: {
                        borderRadius: "10px",
                        background: "#ffffff",
                        color: "#252940",
                        fontSize: "14px",
                        fontWeight: "500",
                        boxShadow:
                            "0 10px 30px rgba(0, 0, 0, 0.12)",
                    },

                    success: {
                        iconTheme: {
                            primary: "#20a36a",
                            secondary: "#ffffff",
                        },
                    },
                }}
            />

            <main className="product-details-page">

                {/* Breadcrumb */}

                <div className="product-breadcrumb">

                    <Link to="/">
                        Home
                    </Link>

                    <FaChevronRight />

                    <Link to="/products">
                        Products
                    </Link>

                    <FaChevronRight />

                    <span>
                        {product.title}
                    </span>

                </div>

                {/* Main Product Section */}

                <section className="product-details">

                    {/* Product Gallery */}

                    <div className="product-gallery">

                        <div className="product-thumbnails">

                            {productImages.map(
                                (image, index) => (
                                    <button
                                        type="button"
                                        key={image}
                                        className={`thumbnail-button ${
                                            activeImage ===
                                            image
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setActiveImage(
                                                image
                                            )
                                        }
                                        aria-label={`View product image ${
                                            index +
                                            1
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title} ${
                                                index +
                                                1
                                            }`}
                                        />
                                    </button>
                                )
                            )}

                        </div>

                        <div className="product-main-image">

                            <img
                                src={
                                    activeImage ||
                                    product.thumbnail
                                }
                                alt={
                                    product.title
                                }
                            />

                            <button
                                type="button"
                                className="details-wishlist"
                                aria-label="Add to wishlist"
                            >
                                <FaHeart />
                            </button>

                        </div>

                    </div>

                    {/* Product Information */}

                    <div className="product-info">

                        <span className="product-badge">
                            NEW ARRIVAL
                        </span>

                        <span className="product-category">
                            {product.category}
                        </span>

                        <h1>
                            {product.title}
                        </h1>

                        {/* Rating */}

                        <div className="product-rating">

                            <div className="stars">

                                {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                        <FaStar
                                            key={star}
                                            className={
                                                star <=
                                                Math.round(
                                                    product.rating
                                                )
                                                    ? "filled"
                                                    : ""
                                            }
                                        />
                                    )
                                )}

                            </div>

                            <span>
                                {product.rating}
                            </span>

                            <span className="review-count">
                                (
                                {product.reviews
                                    ?.length ||
                                    0}{" "}
                                reviews)
                            </span>

                        </div>

                        {/* Price */}

                        <div className="product-price-box">

                            <span className="product-price">
                                $
                                {
                                    discountedPrice
                                }
                            </span>

                            {product.discountPercentage >
                                0 && (
                                <span className="old-price">
                                    $
                                    {
                                        product.price
                                    }
                                </span>
                            )}

                            {product.discountPercentage >
                                0 && (
                                <span className="discount">
                                    {Math.round(
                                        product.discountPercentage
                                    )}
                                    % OFF
                                </span>
                            )}

                        </div>

                        {/* Description */}

                        <p className="product-description">
                            {
                                product.description
                            }
                        </p>

                        {/* Availability */}

                        <div className="product-meta">

                            <span>
                                Availability:
                            </span>

                            <strong>
                                {product.stock >
                                0
                                    ? "In Stock"
                                    : "Out of Stock"}
                            </strong>

                        </div>

                        {/* Quantity */}

                        <div className="quantity-section">

                            <span>
                                Quantity
                            </span>

                            <div className="quantity-control">

                                <button
                                    type="button"
                                    onClick={
                                        decreaseQuantity
                                    }
                                    aria-label="Decrease quantity"
                                >
                                    <FaMinus />
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        increaseQuantity
                                    }
                                    aria-label="Increase quantity"
                                >
                                    <FaPlus />
                                </button>

                            </div>

                        </div>

                        {/* Actions */}

                        <div className="product-actions">

                            <button
                                type="button"
                                className="add-to-cart-btn"
                                onClick={
                                    handleAddToCart
                                }
                                disabled={
                                    product.stock <=
                                    0
                                }
                            >
                                Add to Cart
                            </button>

                            <button
                                type="button"
                                className="buy-now-btn"
                                onClick={
                                    handleBuyNow
                                }
                                disabled={
                                    product.stock <=
                                    0
                                }
                            >
                                Buy Now
                            </button>

                        </div>

                        {/* Benefits */}

                        <div className="product-benefits">

                            <div className="benefit">

                                <FaShieldAlt />

                                <div>
                                    <strong>
                                        Warranty
                                    </strong>

                                    <span>
                                        {
                                            product.warrantyInformation
                                        }
                                    </span>
                                </div>

                            </div>

                            <div className="benefit">

                                <FaTruck />

                                <div>
                                    <strong>
                                        Delivery
                                    </strong>

                                    <span>
                                        {
                                            product.shippingInformation
                                        }
                                    </span>
                                </div>

                            </div>

                            <div className="benefit">

                                <FaUndo />

                                <div>
                                    <strong>
                                        Returns
                                    </strong>

                                    <span>
                                        {
                                            product.returnPolicy
                                        }
                                    </span>
                                </div>

                            </div>

                            <div className="benefit">

                                <FaCheckCircle />

                                <div>
                                    <strong>
                                        Availability
                                    </strong>

                                    <span>
                                        {
                                            product.availabilityStatus
                                        }
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>
        </>
    );
}
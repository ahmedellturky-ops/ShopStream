import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
    FaHeart,
    FaShoppingCart,
    FaStar,
} from "react-icons/fa";

import { addToCart } from "../store/cartSlice";
import { toggleWishlist } from "../store/wishlistSlice";

import "../styles/ProductCard.scss";

function ProductCard({ product }) {
    const dispatch = useDispatch();

    // Get products saved in the wishlist
    const wishlistItems = useSelector(
        (state) => state.wishlist.items
    );

    // Check whether this product is already saved
    const isInWishlist = wishlistItems.some(
        (item) => item.id === product.id
    );

    function handleAddToCart() {
        dispatch(
            addToCart({
                ...product,
                quantity: 1,
            })
        );

        toast.success(
            `${product.title} added to cart!`
        );
    }

    function handleToggleWishlist() {
        dispatch(toggleWishlist(product));

        if (isInWishlist) {
            toast.success(
                `${product.title} removed from wishlist`
            );
        } else {
            toast.success(
                `${product.title} added to wishlist`
            );
        }
    }

    return (
        <div className="product-card">

            <div className="product-image-wrapper">

                <button
                    type="button"
                    className={`wishlist-btn ${isInWishlist ? "active" : ""
                        }`}
                    aria-label={
                        isInWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    aria-pressed={isInWishlist}
                    onClick={handleToggleWishlist}
                >
                    <FaHeart />
                </button>

                <Link to={`/products/${product.id}`}>
                    <img
                        className="product-image"
                        src={product.thumbnail}
                        alt={product.title}
                    />
                </Link>

            </div>

            <div className="product-content">

                <span className="product-category">
                    {product.category}
                </span>

                <Link
                    to={`/products/${product.id}`}
                    className="product-title"
                >
                    {product.title}
                </Link>

                <div className="product-rating">
                    <FaStar />
                    <span>{product.rating}</span>
                </div>

                <div className="product-bottom">

                    <span className="product-price">
                        ${product.price}
                    </span>

                    <button
                        type="button"
                        className="cart-btn"
                        aria-label="Add to cart"
                        onClick={handleAddToCart}
                    >
                        <FaShoppingCart />

                        <span className="Add-btn">
                            Add
                        </span>
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ProductCard;
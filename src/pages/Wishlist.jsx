import { Link } from "react-router-dom";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaHeart,
  FaArrowRight,
  FaTrash,
} from "react-icons/fa";

import ProductCard from "../components/ProductCard";

import {
  removeFromWishlist,
} from "../store/wishlistSlice";

import "../styles/Wishlist.scss";

export default function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  function handleRemove(productId) {
    dispatch(removeFromWishlist(productId));
  }

  return (
    <main className="wishlist-page">

      <div className="wishlist-header">
        <div>
          <h1>My Wishlist</h1>
          <p>
            Your favorite products,
            all in one place.
          </p>
        </div>

        <span className="wishlist-count">
          {wishlistItems.length}{" "}
          {wishlistItems.length === 1
            ? "item"
            : "items"}
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <section className="wishlist-empty">

          <div className="wishlist-empty-icon">
            <FaHeart />
          </div>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Explore our collection and
            save your favorite products
            here.
          </p>

          <Link
            to="/products"
            className="wishlist-shop-btn"
          >
            Explore Products
            <FaArrowRight />
          </Link>

        </section>
      ) : (
        <div className="wishlist-grid">

          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="wishlist-product"
            >
              <ProductCard
                product={product}
              />

              <button
                type="button"
                className="wishlist-remove-btn"
                onClick={() =>
                  handleRemove(product.id)
                }
              >
                <FaTrash />
                Remove from Wishlist
              </button>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}
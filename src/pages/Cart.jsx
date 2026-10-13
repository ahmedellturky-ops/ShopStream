import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaShoppingCart,
  FaShieldAlt,
} from "react-icons/fa";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../store/cartSlice";

import "../styles/Cart.scss";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(
    (state) => state.cart.items
  );

  const isAuthenticated =
    useSelector(
      (state) =>
        state.auth.isAuthenticated
    );

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const estimatedTax =
    subtotal * 0.08;

  const totalPrice =
    subtotal + estimatedTax;

  function handleCheckout() {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
      });
    }
  }

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">
              <FaShoppingCart />
            </div>

            <h2>
              Your cart is feeling light
            </h2>

            <p>
              It looks like you haven't
              added anything to your
              cart yet.
              <br />
              Let's find something
              special for you.
            </p>

            <div className="empty-cart-actions">
              <Link
                to="/products"
                className="
                                    empty-cart-btn
                                    empty-cart-btn-primary
                                "
              >
                Start Shopping
              </Link>

              <Link
                to="/wishlist"
                className="
                                    empty-cart-btn
                                    empty-cart-btn-secondary
                                "
              >
                View Saved Items
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-header">
        <div>
          <h1>
            Your Shopping Cart
          </h1>

          <p>
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => (
            <article
              key={item.id}
              className="cart-item"
            >
              <div className="cart-item-left">
                <Link
                  to={`/products/${item.id}`}
                  className="cart-item-image"
                >
                  <img
                    src={
                      item.thumbnail
                    }
                    alt={
                      item.title
                    }
                  />
                </Link>

                <div className="cart-quantity">
                  <button
                    type="button"
                    className="cart-quantity-btn"
                    onClick={() =>
                      dispatch(
                        decreaseQuantity(
                          item.id
                        )
                      )
                    }
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>

                  <span className="cart-quantity-value">
                    {
                      item.quantity
                    }
                  </span>

                  <button
                    type="button"
                    className="cart-quantity-btn"
                    onClick={() =>
                      dispatch(
                        increaseQuantity(
                          item.id
                        )
                      )
                    }
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className="cart-item-info">
                <span className="cart-item-category">
                  {item.category}
                </span>

                <Link
                  to={`/products/${item.id}`}
                  className="cart-item-title"
                >
                  {item.title}
                </Link>
              </div>

              <div className="cart-item-actions">
                <div className="cart-item-total">
                  $
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(2)}
                </div>

                <button
                  type="button"
                  className="cart-remove-btn"
                  onClick={() =>
                    dispatch(
                      removeFromCart(
                        item.id
                      )
                    )
                  }
                  aria-label={`Remove ${item.title}`}
                >
                  <FaTrash />
                  Remove
                </button>
              </div>
            </article>
          ))}

          <Link
            to="/products"
            className="continue-shopping"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>
        </section>

        <aside className="order-summary">
          <h2>
            Order Summary
          </h2>

          <div className="summary-row">
            <span>
              Subtotal
            </span>

            <strong>
              $
              {subtotal.toFixed(
                2
              )}
            </strong>
          </div>

          <div className="summary-row">
            <span>
              Shipping
            </span>

            <span className="summary-free">
              Free
            </span>
          </div>

          <div className="summary-row">
            <span>
              Estimated Tax
            </span>

            <strong>
              $
              {estimatedTax.toFixed(
                2
              )}
            </strong>
          </div>

          <hr className="summary-divider" />

          <div className="summary-total">
            <span>
              Total
            </span>

            <strong>
              $
              {totalPrice.toFixed(
                2
              )}
            </strong>
          </div>

          <button
            type="button"
            className="checkout-btn"
            onClick={
              handleCheckout
            }
          >
            Proceed to Checkout
          </button>

          <p className="summary-note">
            By proceeding to
            checkout, you agree
            to ShopStream's terms
            and conditions.
          </p>

          <div className="delivery-box">
            <strong>
              <FaShieldAlt />{" "}
              Free Express Delivery
            </strong>

            <br />

            Arrives in 1–2 business
            days.
          </div>
        </aside>
      </div>
    </main>
  );
}
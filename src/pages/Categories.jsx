import { useEffect } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  FaTags,
  FaArrowRight,
  FaShoppingBag,
} from "react-icons/fa";

import {
  getProductCategories,
  setCategory,
} from "../store/productSlice";

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    categories,
    categoriesLoading,
    categoriesError,
  } = useSelector(
    (state) => state.products
  );

  // Fetch categories from the API
  useEffect(() => {
    dispatch(getProductCategories());
  }, [dispatch]);

  // Open the selected category
  function handleCategoryClick(category) {
    dispatch(setCategory(category));

    navigate("/products");
  }

  // Format category names for display
  function formatCategory(category) {
    return category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  return (
    <main
      className="container py-5"
      style={{ minHeight: "70vh" }}
    >
      {/* Header */}
      <div className="mb-4">
        <span
          className="text-uppercase fw-bold"
          style={{
            color: "#5146e5",
            fontSize: "11px",
            letterSpacing: "1px",
          }}
        >
          Explore ShopStream
        </span>

        <h1 className="fw-bold mt-2 mb-2">
          Shop by Category
        </h1>

        <p className="text-secondary mb-0">
          Explore our categories and find
          the products you love.
        </p>
      </div>

      {/* Loading */}
      {categoriesLoading && (
        <p className="text-secondary">
          Loading categories...
        </p>
      )}

      {/* Error */}
      {categoriesError && (
        <div className="alert alert-danger">
          Failed to load categories:{" "}
          {categoriesError}
        </div>
      )}

      {/* Categories */}
      {!categoriesLoading &&
        !categoriesError &&
        categories.length > 0 && (
          <div className="row g-3">

            {/* All Products */}
            <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <button
                type="button"
                className="btn w-100 h-100 text-start p-4 border rounded-4 bg-white"
                onClick={() =>
                  handleCategoryClick("")
                }
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "#f0eeff",
                    color: "#5146e5",
                  }}
                >
                  <FaShoppingBag size={20} />
                </div>

                <h5 className="fw-bold">
                  All Products
                </h5>

                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-secondary small">
                    Browse everything
                  </span>

                  <FaArrowRight
                    color="#5146e5"
                  />
                </div>
              </button>
            </div>

            {categories.map((category) => (
              <div
                key={category}
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
              >
                <button
                  type="button"
                  className="btn w-100 h-100 text-start p-4 border rounded-4 bg-white"
                  onClick={() =>
                    handleCategoryClick(
                      category
                    )
                  }
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "#f0eeff",
                      color: "#5146e5",
                    }}
                  >
                    <FaTags size={20} />
                  </div>

                  <h5 className="fw-bold">
                    {formatCategory(
                      category
                    )}
                  </h5>

                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-secondary small">
                      Explore products
                    </span>

                    <FaArrowRight
                      color="#5146e5"
                    />
                  </div>
                </button>
              </div>
            ))}

          </div>
        )}

      {/* Empty State */}
      {!categoriesLoading &&
        !categoriesError &&
        categories.length === 0 && (
          <div className="text-center py-5">
            <FaTags
              size={32}
              color="#5146e5"
            />

            <h4 className="mt-3">
              No categories found
            </h4>

            <p className="text-secondary">
              Please try again later.
            </p>
          </div>
        )}
    </main>
  );
}
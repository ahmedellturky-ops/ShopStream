import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchProducts,
    fetchProductsByCategory,
    fetchSortedProducts,
    searchProducts,
    fetchProductCategories,
} from "../services/productServices";


// =====================================================
// GET PRODUCTS
// =====================================================

export const getProducts = createAsyncThunk(
    "products/getProducts",

    async (
        {
            limit = 16,
            skip = 0,
            search = "",
            category = "",
            sortBy = "",
            order = "asc",
            minPrice = 0,
            maxPrice = 30000,
            minRating = 0,
            brand = "",
        },
        { rejectWithValue }
    ) => {
        try {
            let data;

            // -----------------------------------------
            // Search
            // -----------------------------------------

            if (search.trim()) {
                data = await searchProducts(
                    search,
                    0,
                    0
                );
            }

            // -----------------------------------------
            // Category
            // -----------------------------------------

            else if (category) {
                data = await fetchProductsByCategory(
                    category,
                    0,
                    0
                );
            }

            // -----------------------------------------
            // Sort
            // -----------------------------------------

            else if (sortBy) {
                data = await fetchSortedProducts(
                    sortBy,
                    order,
                    0,
                    0
                );
            }

            // -----------------------------------------
            // Normal products
            // -----------------------------------------

            else {
                data = await fetchProducts(
                    0,
                    0
                );
            }

            // -----------------------------------------
            // Start with API products
            // -----------------------------------------

            let filteredProducts =
                data.products || [];


            // -----------------------------------------
            // Price Filter
            // -----------------------------------------

            filteredProducts =
                filteredProducts.filter(
                    (product) =>
                        product.price >= minPrice &&
                        product.price <= maxPrice
                );


            // -----------------------------------------
            // Rating Filter
            // -----------------------------------------

            if (minRating > 0) {
                filteredProducts =
                    filteredProducts.filter(
                        (product) =>
                            product.rating >= minRating
                    );
            }


            // -----------------------------------------
            // Brand Filter
            // -----------------------------------------

            if (brand) {
                filteredProducts =
                    filteredProducts.filter(
                        (product) =>
                            product.brand === brand
                    );
            }


            // -----------------------------------------
            // Price Sort
            // -----------------------------------------

            if (sortBy === "price") {
                filteredProducts.sort(
                    (a, b) =>
                        order === "asc"
                            ? a.price - b.price
                            : b.price - a.price
                );
            }


            // -----------------------------------------
            // Rating Sort
            // -----------------------------------------

            if (sortBy === "rating") {
                filteredProducts.sort(
                    (a, b) =>
                        order === "desc"
                            ? b.rating - a.rating
                            : a.rating - b.rating
                );
            }


            // -----------------------------------------
            // Pagination
            // -----------------------------------------

            const paginatedProducts =
                filteredProducts.slice(
                    skip,
                    skip + limit
                );


            // -----------------------------------------
            // Return final result
            // -----------------------------------------

            return {
                products: paginatedProducts,
                total: filteredProducts.length,
                limit,
                skip,
            };

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Something went wrong"
            );
        }
    }
);


// =====================================================
// GET PRODUCT CATEGORIES
// =====================================================

export const getProductCategories =
    createAsyncThunk(
        "products/getProductCategories",

        async (_, { rejectWithValue }) => {
            try {
                return await fetchProductCategories();
            } catch (error) {
                return rejectWithValue(
                    error.response?.data?.message ||
                        "Failed to load categories"
                );
            }
        }
    );


// =====================================================
// GET PRODUCT BRANDS
// =====================================================

export const getProductBrands =
    createAsyncThunk(
        "products/getProductBrands",

        async (_, { rejectWithValue }) => {
            try {
                const data =
                    await fetchProducts(0, 0);

                const brands = [
                    ...new Set(
                        (data.products || [])
                            .map(
                                (product) =>
                                    product.brand
                            )
                            .filter(Boolean)
                    ),
                ].sort();

                return brands;

            } catch (error) {
                return rejectWithValue(
                    error.response?.data?.message ||
                        "Failed to load brands"
                );
            }
        }
    );


// =====================================================
// PRODUCT SLICE
// =====================================================

const productSlice = createSlice({
    name: "products",
    initialState: {
        // -----------------------------------------
        // Products
        // -----------------------------------------
        products: [],
        total: 0,
        limit: 16,
        skip: 0,
        // -----------------------------------------
        // Categories / Brands
        // -----------------------------------------
        categories: [],
        brands: [],
        // -----------------------------------------
        // Filters
        // -----------------------------------------
        search: "",
        category: "",
        sortBy: "",
        order: "asc",
        minPrice: 0,
        maxPrice: 30000,
        minRating: 0,
        brand: "",
        // -----------------------------------------
        // Products Loading / Error
        // -----------------------------------------
        isLoading: false,
        error: null,
        // -----------------------------------------
        // Categories Loading / Error
        // -----------------------------------------
        categoriesLoading: false,
        categoriesError: null,
        // -----------------------------------------
        // Brands Loading / Error
        // -----------------------------------------
        brandsLoading: false,
        brandsError: null,
    },


    // =================================================
    // REDUCERS
    // =================================================

    reducers: {

        // -----------------------------------------
        // Search
        // -----------------------------------------

        setSearch: (state, action) => {
            state.search = action.payload;
        },


        // -----------------------------------------
        // Category
        // -----------------------------------------

        setCategory: (state, action) => {
            state.category = action.payload;
        },


        // -----------------------------------------
        // Sort
        // -----------------------------------------

        setSort: (state, action) => {
            state.sortBy =
                action.payload.sortBy;

            state.order =
                action.payload.order;
        },


        // -----------------------------------------
        // Price Range
        // -----------------------------------------

        setPriceRange: (state, action) => {
            state.minPrice =
                action.payload.minPrice;

            state.maxPrice =
                action.payload.maxPrice;
        },


        // -----------------------------------------
        // Rating
        // -----------------------------------------

        setRating: (state, action) => {
            state.minRating =
                action.payload;
        },


        // -----------------------------------------
        // Brand
        // -----------------------------------------

        setBrand: (state, action) => {
            state.brand =
                action.payload;
        },


        // -----------------------------------------
        // Clear Filters
        // -----------------------------------------

        clearFilters: (state) => {
            state.search = "";
            state.category = "";
            state.sortBy = "";
            state.order = "asc";
            state.minPrice = 0;
            state.maxPrice = 30000;
            state.minRating = 0;
            state.brand = "";
        },
    },


    // =================================================
    // EXTRA REDUCERS
    // =================================================

    extraReducers: (builder) => {

        // =============================================
        // PRODUCTS
        // =============================================

        builder

            .addCase(
                getProducts.pending,
                (state) => {
                    state.isLoading = true;

                    state.error = null;
                }
            )

            .addCase(
                getProducts.fulfilled,
                (state, action) => {

                    state.isLoading = false;

                    state.products =
                        action.payload.products;

                    state.total =
                        action.payload.total;

                    state.limit =
                        action.payload.limit;

                    state.skip =
                        action.payload.skip;
                }
            )

            .addCase(
                getProducts.rejected,
                (state, action) => {

                    state.isLoading = false;

                    state.error =
                        action.payload;
                }
            );


        // =============================================
        // CATEGORIES
        // =============================================

        builder

            .addCase(
                getProductCategories.pending,
                (state) => {

                    state.categoriesLoading =
                        true;

                    state.categoriesError =
                        null;
                }
            )

            .addCase(
                getProductCategories.fulfilled,
                (state, action) => {

                    state.categoriesLoading =
                        false;

                    state.categories =
                        action.payload;
                }
            )

            .addCase(
                getProductCategories.rejected,
                (state, action) => {

                    state.categoriesLoading =
                        false;

                    state.categoriesError =
                        action.payload;
                }
            );


        // =============================================
        // BRANDS
        // =============================================

        builder

            .addCase(
                getProductBrands.pending,
                (state) => {

                    state.brandsLoading =
                        true;

                    state.brandsError =
                        null;
                }
            )

            .addCase(
                getProductBrands.fulfilled,
                (state, action) => {

                    state.brandsLoading =
                        false;

                    state.brands =
                        action.payload;
                }
            )

            .addCase(
                getProductBrands.rejected,
                (state, action) => {

                    state.brandsLoading =
                        false;

                    state.brandsError =
                        action.payload;
                }
            );
    },
});


// =====================================================
// ACTIONS
// =====================================================

export const {
    setSearch,
    setCategory,
    setSort,
    setPriceRange,
    setRating,
    setBrand,
    clearFilters,
} = productSlice.actions;


// =====================================================
// REDUCER
// =====================================================

export default productSlice.reducer;
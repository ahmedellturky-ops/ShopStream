import { createSlice } from "@reduxjs/toolkit";

// Load wishlist from localStorage
function loadWishlist() {
    try {
        const savedWishlist =
            localStorage.getItem("wishlist");

        if (!savedWishlist) {
            return [];
        }

        const parsedWishlist =
            JSON.parse(savedWishlist);

        return Array.isArray(parsedWishlist)
            ? parsedWishlist
            : [];

    } catch (error) {
        console.error(
            "Failed to load wishlist:",
            error
        );

        return [];
    }
}

// Save wishlist to localStorage
function saveWishlist(items) {
    try {
        localStorage.setItem(
            "wishlist",
            JSON.stringify(items)
        );
    } catch (error) {
        console.error(
            "Failed to save wishlist:",
            error
        );
    }
}

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState: {
        items: loadWishlist(),
    },

    reducers: {
        // Add a product or remove it if already saved
        toggleWishlist: (state, action) => {
            const product = action.payload;

            const existingProduct =
                state.items.find(
                    (item) => item.id === product.id
                );

            if (existingProduct) {
                state.items =
                    state.items.filter(
                        (item) =>
                            item.id !== product.id
                    );
            } else {
                state.items.push(product);
            }

            saveWishlist(state.items);
        },

        // Remove a product directly
        removeFromWishlist: (state, action) => {
            state.items =
                state.items.filter(
                    (item) => item.id !== action.payload
                );

            saveWishlist(state.items);
        },

        // Clear the entire wishlist
        clearWishlist: (state) => {
            state.items = [];

            saveWishlist(state.items);
        },
    },
});

export const {
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
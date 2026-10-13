import { createSlice } from "@reduxjs/toolkit";


// =========================================
// Load Cart from localStorage
// =========================================

function loadCart() {
    try {
        const savedCart =
            localStorage.getItem("cart");

        if (!savedCart) {
            return [];
        }

        return JSON.parse(savedCart);

    } catch (error) {
        console.error(
            "Failed to load cart:",
            error
        );

        return [];
    }
}


// =========================================
// Save Cart to localStorage
// =========================================

function saveCart(items) {
    try {
        localStorage.setItem(
            "cart",
            JSON.stringify(items)
        );

    } catch (error) {
        console.error(
            "Failed to save cart:",
            error
        );
    }
}


// =========================================
// Initial State
// =========================================

const initialState = {
    items: loadCart(),
};


// =========================================
// Cart Slice
// =========================================

const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {

        // =====================================
        // Add To Cart
        // =====================================

        addToCart: (state, action) => {

            const product =
                action.payload;

            const existingItem =
                state.items.find(
                    (item) =>
                        item.id ===
                        product.id
                );


            if (existingItem) {

                existingItem.quantity +=
                    product.quantity || 1;

            } else {

                state.items.push({
                    ...product,
                    quantity:
                        product.quantity || 1,
                });

            }


            saveCart(state.items);
        },


        // =====================================
        // Increase Quantity
        // =====================================

        increaseQuantity: (
            state,
            action
        ) => {

            const item =
                state.items.find(
                    (product) =>
                        product.id ===
                        action.payload
                );


            if (item) {

                item.quantity += 1;

            }


            saveCart(state.items);
        },


        // =====================================
        // Decrease Quantity
        // =====================================

        decreaseQuantity: (
            state,
            action
        ) => {

            const item =
                state.items.find(
                    (product) =>
                        product.id ===
                        action.payload
                );


            if (
                item &&
                item.quantity > 1
            ) {

                item.quantity -= 1;

            }


            saveCart(state.items);
        },


        // =====================================
        // Remove From Cart
        // =====================================

        removeFromCart: (
            state,
            action
        ) => {

            state.items =
                state.items.filter(
                    (product) =>
                        product.id !==
                        action.payload
                );


            saveCart(state.items);
        },


        // =====================================
        // Clear Cart
        // =====================================

        clearCart: (state) => {

            state.items = [];

            saveCart(state.items);
        },

    },
});


// =========================================
// Export Actions
// =========================================

export const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
} = cartSlice.actions;


// =========================================
// Export Reducer
// =========================================

export default cartSlice.reducer;
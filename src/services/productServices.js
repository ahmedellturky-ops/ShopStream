import { api } from "./axios";


// Get products with pagination
export async function fetchProducts(limit = 15, skip = 0) {
    const response = await api.get(
        `/products?limit=${limit}&skip=${skip}`
    );

    return response.data;
}


// Get one product by ID
export async function fetchProductById(id) {
    const response = await api.get(`/products/${id}`);

    return response.data;
}


// Search products
export async function searchProducts(
    search,
    limit = 15,
    skip = 0
) {
    const response = await api.get(
        `/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
    );

    return response.data;
}


// Get products by category
export async function fetchProductsByCategory(
    category,
    limit = 15,
    skip = 0
) {
    const response = await api.get(
        `/products/category/${category}?limit=${limit}&skip=${skip}`
    );

    return response.data;
}


// Sort products
export async function fetchSortedProducts(
    sortBy,
    order = "asc",
    limit = 15,
    skip = 0
) {
    const response = await api.get(
        `/products?sortBy=${sortBy}&order=${order}&limit=${limit}&skip=${skip}`
    );

    return response.data;
}


// Get all product categories
export async function fetchProductCategories() {
    const response = await api.get("/products/category-list");

    return response.data;
}
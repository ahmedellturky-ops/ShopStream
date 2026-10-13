
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import ProductCard from "./ProductCard";
import products from "../data/Products";

import "swiper/css";
import "swiper/css/navigation";
import "../styles/FeaturedProducts.scss";

export default function FeaturedProducts() {
    const featuredProducts = products.slice(0, 8);

    return (
        <section className="featured-products">
            <div className="section-heading">
                <div className="section-title">
                    <h2>Featured Products</h2>

                    <p>
                        Discover our handpicked selection of products.
                    </p>
                </div>

                <div className="view-all">
                    <Link to="/products">
                        View All
                    </Link>
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={12}
                slidesPerGroup={1}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 12,
                    },
                    480: {
                        slidesPerView: 1.5,
                        spaceBetween: 14,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 16,
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                    },
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                    },
                }}
            >
                {featuredProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}

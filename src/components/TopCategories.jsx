import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import categories from "../data/categories";

import "../styles/TopCategories.scss";

export default function TopCategories() {
    return (
        <section className="top-categories">
            <div className="section-heading">
                <div className="section-title">
                    <h2>Top Categories</h2>

                    <p>
                        Curated gear for every lifestyle.
                    </p>
                </div>

                <div className="view-all">
                    <Link to="/categories">
                        See All
                        <span>→</span>
                    </Link>
                </div>
            </div>

            <div className="categories-layout">

                {/* Large left card */}
                <div className="category-large">
                    <CategoryCard
                        image={categories[0].image}
                        name="Computing"
                    />
                </div>

                {/* Top middle card */}
                <div className="category-small">
                    <CategoryCard
                        image={categories[1].image}
                        name="Wearables"
                    />
                </div>

                {/* Top right card */}
                <div className="category-small">
                    <CategoryCard
                        image={categories[2].image}
                        name="Audio"
                    />
                </div>

                {/* Bottom wide card */}
                <div className="category-wide">
                    <CategoryCard
                        image={categories[3].image}
                        name="Home Theater"
                    />
                </div>

            </div>
        </section>
    );
}
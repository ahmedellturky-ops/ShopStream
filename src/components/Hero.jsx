
import { useNavigate } from "react-router-dom";
import "../styles/Hero.scss";
import heroImg from "../assets/Image/heroImg.png";

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="hero-content">
                <span className="highlight-1">
                    NEW COLLECTION
                </span>

                <h1>
                    Experience the Future
                    <br />
                    of <span className="highlight-2">Innovation.</span>
                </h1>

                <p>
                    Explore our curated selection of premium
                    electronics designed to elevate your
                    everyday experience.
                </p>

                <div className="hero-actions">
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                    >
                        Shop Electronics
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/categories")}
                    >
                        View Collection
                    </button>
                </div>
            </div>

            <div className="hero-image">
                <img src={heroImg} alt="Hero Image" />
            </div>
        </section>
    );
}


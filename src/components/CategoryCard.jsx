import "../styles/CategoryCard.scss";

export default function CategoryCard({ image, name }) {
    return (
        <div className="category-card">
            <img src={image} alt={name} />

            <div className="category-name">
                {name}
            </div>
        </div>
    );
}
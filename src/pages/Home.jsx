import CTA from '../components/CTA';
import FeaturedProducts from '../components/FeaturedProducts';
import Hero from '../components/Hero';
import TopCategories from '../components/TopCategories';

export default function Home() {
  return (
    <>
      <Hero />
      <TopCategories />
      <FeaturedProducts/>
      <CTA/>
    </>
  );
}
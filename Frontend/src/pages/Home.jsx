import HeroSection from "../components/Hero";
import Footer from "../components/Footer";
import ComingCourses from "../components/ComingCourses";
import Banner from "../components/Banner";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <>
      <HeroSection />
      <ComingCourses />
      <Banner />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;

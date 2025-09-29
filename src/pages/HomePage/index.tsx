import HelmetHeader from "../../components/HelmentHeader";
import {
  Choose,
  Cta,
  Hero,
  Numbers,
  Offer,
  Partners,
  PopularSubjects,
  Testimonial,
  Works,
} from "../../components/Home";

export default function HomePage() {
  return (
    <>
      <HelmetHeader title={"Home"} description={"The Future of Education"} />
      <section>
        <Hero />
        <Numbers />
        <Offer />
        <Works />
        <Choose />
        <Partners />
        <PopularSubjects />
        <Testimonial />
        <Cta />
      </section>
    </>
  );
}

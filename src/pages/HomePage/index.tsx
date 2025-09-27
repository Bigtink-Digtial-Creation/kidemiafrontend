import HelmetHeader from "../../components/HelmentHeader";
import { Choose, Cta, Hero, Offer, Works } from "../../components/Home";

export default function HomePage() {
  return (
    <>
      <HelmetHeader title={"Home"} description={"The Future of Education"} />
      <section>
        <Hero />
        <Offer />
        <Works />
        <Choose />
        <Cta />
      </section>
    </>
  );
}

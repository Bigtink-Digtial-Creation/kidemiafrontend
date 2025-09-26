import HelmetHeader from "../../components/HelmentHeader";
import { Choose, Hero, Offer } from "../../components/Home";

export default function HomePage() {
  return (
    <>
      <HelmetHeader title={"Home"} description={"The Future of Education"} />
      <section>
        <Hero />
        <Offer />
        <Choose />
      </section>
    </>
  );
}

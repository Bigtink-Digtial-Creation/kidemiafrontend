import HelmetHeader from "../../components/HelmentHeader";
import Hero from "../../components/Home/Hero";

export default function HomePage() {
  return (
    <>
      <HelmetHeader title={"Home"} description={"The Future of Education"} />
      <section>
        <Hero />
      </section>
    </>
  );
}

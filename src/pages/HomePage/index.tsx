import HelmetHeader from "../../components/HelmentHeader";

export default function HomePage() {
  return (
    <>
      <HelmetHeader title={"Home"} description={"The Future of Education"} />

      <section className="flex justify-center items-center text-4xl text-kidemia-primary">
        Kidemia HomePage
      </section>
    </>
  );
}

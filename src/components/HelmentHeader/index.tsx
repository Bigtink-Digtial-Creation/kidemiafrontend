type HelmetT = {
  title: string;
  description: string;
};

export default function HelmetHeader({ title, description }: HelmetT) {
  return (
    <>
      <title>{title} || Kidemia</title>
      <meta name="description" content={description}></meta>
    </>

  );
}

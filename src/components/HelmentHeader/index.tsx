import { Helmet } from "react-helmet-async";

type HelmetT = {
  title: string;
  description: string;
};

export default function HelmetHeader({ title, description }: HelmetT) {
  return (
    <Helmet>
      <title>{title} || Kidemia</title>
      <meta name="description" content={description}></meta>
    </Helmet>
  );
}

import { useForm } from "react-hook-form";
import { FiMapPin } from "react-icons/fi";
import { PiPhoneCall } from "react-icons/pi";
import { ContactUsSchema } from "../../schema/contact.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Textarea } from "@heroui/react";
import { FaRegUser } from "react-icons/fa";
import { MdMessage, MdOutlineEmail } from "react-icons/md";
import { LiaUserTagSolid } from "react-icons/lia";

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactUsSchema>({
    resolver: zodResolver(ContactUsSchema),
  });

  const onSubmit = (data: ContactUsSchema) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen  mx-auto py-24 px-4 md:px-16">
      <div className="bg-kidemia-biege/25 py-8 px-4 rounded-3xl flex flex-col justify-center items-center space-y-3">
        <div className="bg-kidemia-white shadow-2xl text-kidemia-black border-kidemia-success border-[1px] inline-block px-4 py-1 rounded-full text-sm font-semibold">
          Write To Us
        </div>

        <h3 className="text-2xl md:text-4xl font-bold text-center text-kidemia-grey/60  max-w-2xl">
          Have questions, feedback, or need assistance? We'd love to hear from
          you. Reach out to our team and we'll get back to you as soon as
          possible.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-items-center py-12 w-full">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <PiPhoneCall className="text-2xl text-kidemia-primary" />
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-kidemia-black">
                Call Us
              </h4>
              <p className="text-sm text-kidemia-grey">
                Speak with our team{" "}
                <a
                  href="tel:+4733378901"
                  className="text-kidemia-primary hover:underline"
                >
                  +4733378901
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FiMapPin className="text-2xl text-kidemia-primary" />
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-kidemia-black">
                Visit Us
              </h4>
              <p className="text-sm text-kidemia-grey">
                123 Kidemia Complext, Lagos Nigeria
              </p>
            </div>
          </div>
        </div>
        <div className="bg-kidemia-white shadow w-full p-4">
          <Form
            className="py-6 space-y-2 md:px-12"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="pb-2 w-full">
              <Input
                variant="flat"
                size="lg"
                radius="sm"
                startContent={
                  <FaRegUser className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                }
                placeholder="Your Fullname"
                type="text"
                {...register("fullName")}
                isInvalid={!!errors?.fullName?.message}
                errorMessage={errors?.fullName?.message}
              />
            </div>

            <div className="pb-2 w-full">
              <Input
                variant="flat"
                size="lg"
                radius="sm"
                startContent={
                  <MdOutlineEmail className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                }
                placeholder="Your email"
                type="email"
                {...register("email")}
                isInvalid={!!errors?.email?.message}
                errorMessage={errors?.email?.message}
              />
            </div>

            <div className="pb-2 w-full">
              <Input
                variant="flat"
                size="lg"
                radius="sm"
                startContent={
                  <LiaUserTagSolid className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                }
                placeholder="Your Subject"
                type="text"
                {...register("subject")}
                isInvalid={!!errors?.subject?.message}
                errorMessage={errors?.subject?.message}
              />
            </div>

            <div className="pb-2 w-full">
              <Textarea
                variant="flat"
                size="lg"
                radius="sm"
                placeholder="Your Message"
                startContent={
                  <MdMessage className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                }
                {...register("message")}
                isInvalid={!!errors?.message?.message}
                errorMessage={errors?.message?.message}
              />
            </div>

            <div className="py-4 w-full">
              <Button
                type="submit"
                variant="solid"
                size="lg"
                className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                radius="sm"
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

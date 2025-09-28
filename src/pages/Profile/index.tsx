import React, { useState } from "react";
import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard, MdOutlineEmail } from "react-icons/md";
import { FaCamera, FaUser } from "react-icons/fa";
import { IoSchoolSharp } from "react-icons/io5";
import { PiExamFill } from "react-icons/pi";

const exams = [
  { label: "Common Entrance", key: "CE" },
  { label: "Junior WAEC", key: "JW" },
  { label: "Senior WAEC", key: "SW" },
];

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  );

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilepicture", file);

    // create a preview from uploaded file
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  };
  return (
    <>
      <div className="space-y-6">
        <div>
          <Breadcrumbs variant="light" color="foreground">
            <BreadcrumbItem
              href={SidebarRoutes.dashboard}
              startContent={<MdOutlineDashboard />}
            >
              Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem
              href={SidebarRoutes.profile}
              startContent={<FaUser />}
            >
              Profile
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <div className="h-full w-full shadow-none md:shadow-sm bg-kidemia-biege2 rounded-2xl overflow-y-auto">
          <div className="flex flex-col justify-center items-center gap-3 py-4 px-6 md:px-12 lg:px-20">
            <div className="group flex justify-center items-center relative">
              <Avatar
                src={avatarUrl}
                className="w-40 h-40 text-large self-center cursor-pointer"
                isBordered
              />

              <div className="hidden group-hover:block z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200">
                <div className="relative flex justify-center items-center">
                  <FaCamera size={30} className="text-kidemia-primary" />
                  <label
                    htmlFor="profile"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 z-50 w-full h-full"
                  ></label>
                </div>
                <Input
                  id="profile"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleUpload(e)}
                />
              </div>
            </div>

            <Form className="py-6 space-y-2 w-full max-w-lg">
              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <MdOutlineEmail className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="email"
                  label="Your Email"
                  labelPlacement="inside"
                />
              </div>

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <FaUser className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  label="Fullname"
                  labelPlacement="inside"
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
                  type="email"
                  label="Guardian Email"
                  labelPlacement="inside"
                />
              </div>

              <div className="pb-2 w-full">
                <Input
                  variant="flat"
                  size="lg"
                  radius="sm"
                  startContent={
                    <IoSchoolSharp className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                  type="text"
                  label="Your School"
                  labelPlacement="inside"
                />
              </div>

              <div className="pb-2 w-full">
                <Select
                  className="text-xs"
                  label="Exam Category"
                  variant="flat"
                  size="lg"
                  radius="sm"
                  labelPlacement="inside"
                  startContent={
                    <PiExamFill className="text-kidemia-secondary text-xl pointer-events-none shrink-0" />
                  }
                >
                  {exams.map((ex) => (
                    <SelectItem key={ex.key}>{ex.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="py-4 w-full">
                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="bg-kidemia-secondary text-kidemia-white font-semibold w-full"
                  radius="sm"
                >
                  Update Profile
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  useDisclosure,
} from "@heroui/react";
import { SidebarRoutes } from "../../routes";
import { MdOutlineDashboard } from "react-icons/md";
import { FiSettings, FiUser, FiLock } from "react-icons/fi";
import { Link } from "react-router";
import DeleteAccountModal from "../../components/Sidebar/DeleteAccountModal";
import ChangePasswordModal from "../Profile/components/ChangePasswordModal";
import SettingRow from "./components/SettingRow";

export default function SettingsPage() {
  const delAcct = useDisclosure();
  const passwordModal = useDisclosure();


  return (
    <>
      <div className="space-y-12">
        <Breadcrumbs variant="light" color="foreground">
          <BreadcrumbItem
            href={SidebarRoutes.dashboard}
            startContent={<MdOutlineDashboard />}
          >
            Dashboard
          </BreadcrumbItem>
          <BreadcrumbItem
            href={SidebarRoutes.settings}
            startContent={<FiSettings />}
          >
            Settings
          </BreadcrumbItem>
        </Breadcrumbs>

        {/* GENERAL */}
        <section className="space-y-6">
          <h2 className="text-lg font-medium text-kidemia-black">
            General
          </h2>

          <SettingRow
            icon={<FiUser />}
            title="Account settings"
            description="Update your profile and personal information"
            action={
              <Link to={SidebarRoutes.profile}>
                <Button variant="light" className="font-medium bg-kidemia-primary text-kidemia-white">
                  Update Account
                </Button>
              </Link>
            }
          />

          <SettingRow
            icon={<FiLock />}
            title="Password"
            description="Change or update your account password"
            action={
              <Button className="font-medium bg-kidemia-primary text-kidemia-white" onPress={passwordModal.onOpen}>
                Change account password
              </Button>
            }
          />
        </section>

        {/* DANGER */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-red-500">
            Danger zone
          </h2>

          <div className="flex items-start justify-between gap-6 border-t border-red-200 pt-4">
            <div className="space-y-1">
              <p className="text-sm text-kidemia-grey">
                Permanently remove your account and all associated data
              </p>
            </div>

            <Button
              color="danger"
              radius="sm"
              onPress={delAcct.onOpen}
            >
              Delete
            </Button>
          </div>
        </section>
      </div>

      <ChangePasswordModal
        isOpen={passwordModal.isOpen}
        onClose={passwordModal.onClose}
      />

      <DeleteAccountModal
        isOpen={delAcct.isOpen}
        onOpenChange={delAcct.onOpenChange}
        onClose={delAcct.onClose}
      />
    </>
  );
}



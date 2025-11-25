import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import { useNavigate } from "react-router";
import { HomeRoutes } from "../../routes";
import { CgDanger } from "react-icons/cg";
import { useMutation } from "@tanstack/react-query";
import { ApiSDK } from "../../sdk";
import { useAtom } from "jotai";
import { loggedinUserAtom, storedAuthTokenAtom, userRoleAtom } from "../../store/user.atom";

interface DeleteAccountI {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onOpenChange,
  onClose,
}: DeleteAccountI) {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useAtom(loggedinUserAtom);
  const [, setAuthToken] = useAtom(storedAuthTokenAtom);
  const [, setUserRole] = useAtom(userRoleAtom);

  const userId = loggedInUser?.user?.id;

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) =>
      ApiSDK.UsersService.deleteUserApiV1UsersUserIdDelete(userId),
    onSuccess: () => {
      setLoggedInUser(null);
      setAuthToken(null);
      setUserRole(null);
      ApiSDK.OpenAPI.TOKEN = undefined;
      onClose();
      addToast({
        title: "Account deleted successfully",
        color: "success",
      });
      navigate(HomeRoutes.home, { replace: true });
    },
    onError: () => {
      addToast({
        title: "Failed to delete account",
        color: "danger",
      });
    }
  });

  const handleDeleteAccount = () => {
    if (userId) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <ModalContent>
        <ModalBody className="py-6">
          <div className="flex flex-col justify-center items-center space-y-4">
            <div className="p-6 bg-kidemia-biege rounded-full">
              <CgDanger className="w-8 h-8 text-kidemia-secondary" />
            </div>
            <div className="px-6 space-y-3">
              <h3 className="text-kidemia-secondary text-xl font-semibold text-center">
                Are you sure you want to Delete your Account?
              </h3>
              <p className="text-sm text-kidemia-grey text-center">
                Deleting your account will end your current session, and you'll
                need to sign up again to access our services.
              </p>
            </div>
          </div>

          <div className="py-4 w-full flex flex-col md:flex-row gap-6 items-center">
            <Button
              variant="faded"
              size="md"
              radius="sm"
              className="bg-kidemia-biege border border-enita-black2 font-medium text-kidemia-primary w-full"
              onPress={onClose}
              isDisabled={deleteUserMutation.isPending}
            >
              No, keep me logged in
            </Button>
            <Button
              color="primary"
              size="md"
              radius="sm"
              className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
              onPress={handleDeleteAccount}
              isLoading={deleteUserMutation.isPending}
              isDisabled={deleteUserMutation.isPending || !userId}
            >
              Yes, Delete
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
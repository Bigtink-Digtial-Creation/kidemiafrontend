import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import { useNavigate } from "react-router";
import { SidebarRoutes } from "../../../routes";

type ResultWaitingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function ResultWaiting({
  isOpen,
  onClose,
}: ResultWaitingModalProps) {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      placement="center"
      classNames={{
        base: "bg-kidemia-white rounded-xl shadow-xl p-6",
      }}
    >
      <ModalContent>
        <ModalBody className="flex flex-col items-center justify-center space-y-6 text-center py-8">
          <Spinner size="lg" color="warning" />

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-kidemia-black">
              Thank you for completing the test 🎉
            </h2>
            <p className="text-lg text-kidemia-grey font-medium">
              Your results will be out in a few minutes. Please wait here or
              return to your dashboard.
            </p>
          </div>
        </ModalBody>

        <ModalFooter className="flex flex-col md:flex-row gap-4">
          <Button
            className="bg-kidemia-secondary text-kidemia-white font-medium w-full"
            size="md"
            radius="sm"
            type="button"
            onPress={() => navigate(SidebarRoutes.dashboard)}
          >
            Go to Dashboard
          </Button>

          <Button
            className="bg-kidemia-biege border border-enita-black2 text-kidemia-primary font-medium w-full"
            variant="faded"
            size="md"
            radius="sm"
            type="button"
            onPress={onClose}
          >
            Wait Here
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

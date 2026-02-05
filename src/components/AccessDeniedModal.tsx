import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { useNavigate } from "react-router";
import { PaymentRoutes } from "../routes";

interface AccessDeniedModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "subscription" | "token" | "general";
    message?: string;
    title?: string;
}

export const AccessDeniedModal = ({
    isOpen,
    onClose,
    type,
    message,
    title,
}: AccessDeniedModalProps) => {
    const navigate = useNavigate();

    const config = {
        subscription: {
            title: title || "Upgrade Required",
            buttonText: "View Subscription Plans",
            route: PaymentRoutes.subscriptionUpgrade,
            color: "primary" as const,
        },
        token: {
            title: title || "Insufficient Tokens",
            buttonText: "Buy Tokens",
            route: PaymentRoutes.buytoken,
            color: "warning" as const,
        },
        general: {
            title: title || "Access Denied",
            buttonText: "Go Back",
            route: -1,
            color: "danger" as const,
        },
    }[type];

    const handleAction = () => {
        onClose();
        if (config.route === -1) {
            navigate(-1);
        } else {
            navigate(config.route as string);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{config.title}</ModalHeader>
                <ModalBody>
                    <p className="text-gray-600">
                        {message || "You don't have enough access to perform this action. Please upgrade or top up your wallet to continue."}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button color={config.color} onPress={handleAction}
                        className="bg-kidemia-secondary text-white">
                        {config.buttonText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
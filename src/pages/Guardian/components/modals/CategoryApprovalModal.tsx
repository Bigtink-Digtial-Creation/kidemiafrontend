import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
} from "@heroui/react";
import { useState } from "react";

interface CategoryApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    isApproving: boolean;
    onConfirm: (adminNotes: string) => void;
    isLoading: boolean;
}

export default function CategoryApprovalModal({
    isOpen,
    onClose,
    isApproving,
    onConfirm,
    isLoading,
}: CategoryApprovalModalProps) {
    const [adminNotes, setAdminNotes] = useState("");

    const handleConfirm = () => {
        onConfirm(adminNotes);
        setAdminNotes("");
    };

    const handleClose = () => {
        setAdminNotes("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalContent>
                <ModalHeader>
                    {isApproving ? "Approve Request" : "Reject Request"}
                </ModalHeader>
                <ModalBody>
                    <p className="mb-4 text-gray-700">
                        Are you sure you want to{" "}
                        <strong className={isApproving ? "text-green-600" : "text-red-600"}>
                            {isApproving ? "approve" : "reject"}
                        </strong>{" "}
                        this category change request?
                    </p>

                    <Textarea
                        label="Notes (Optional)"
                        placeholder="Add any notes about this decision..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        variant="bordered"
                        minRows={3}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="default"
                        variant="flat"
                        onPress={handleClose}
                        isDisabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        color={isApproving ? "success" : "danger"}
                        className="text-white bg-kidemia-secondary"
                        onPress={handleConfirm}
                        isLoading={isLoading}
                    >
                        {isApproving ? "Confirm Approval" : "Confirm Rejection"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
import {
    Modal,
    ModalContent,
    Button,
    Avatar,
} from "@heroui/react";
import { useState } from "react";

export default function ProfileAvatarModal({
    isOpen,
    onClose,
    onSave,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (file: File) => Promise<void>;
}) {
    const [file, setFile] = useState<File | null>(null);
    const preview = file ? URL.createObjectURL(file) : null;

    return (
        <div className="flex justifiy-center item-center">
            <Modal isOpen={isOpen} onClose={onClose} placement="center" size="2xl">
                <ModalContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-center">
                        Update Profile Picture
                    </h3>

                    <div className="flex justify-center">
                        <Avatar
                            src={preview ?? undefined}
                            className="w-32 h-32 bg-kidemia-secondary text-kidemia-white"
                            isBordered
                        />
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        className="w-full text-sm"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="flat" onPress={onClose}
                            className="bg-kidemia-secondary text-white">
                            Cancel
                        </Button>
                        <Button
                            className="bg-kidemia-primary text-white"
                            isDisabled={!file}
                            onPress={() => file && onSave(file)}
                        >
                            Save
                        </Button>
                    </div>
                </ModalContent>
            </Modal>
        </div>

    );
}

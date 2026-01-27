import {
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
} from "@heroui/react";

interface Category {
    id: string;
    display_name: string;
}

interface CategoryChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentCategory: string;
    categories: Category[];
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

export default function CategoryChangeModal({
    isOpen,
    onClose,
    currentCategory,
    categories,
    selectedCategory,
    onCategoryChange,
    onSubmit,
    isLoading = false,
}: CategoryChangeModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            classNames={{
                base: "bg-kidemia-beige",
                backdrop: "bg-black/50",
            }}
        >
            <ModalContent className="bg-kidemia-biege py-8 px-6">

                <ModalBody className="p-0">
                    <p className="text-center text-gray-600 text-sm mb-6">
                        Current: <strong>{currentCategory || "Not Set"}</strong>
                    </p>

                    <Select
                        label="New Category"
                        placeholder="Select new category"
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        variant="bordered"
                        classNames={{
                            base: "mb-4",
                            trigger: "bg-white border-gray-300 hover:bg-white/80",
                            label: "text-gray-700",
                        }}
                    >
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} textValue={cat.display_name}>
                                {cat.display_name}
                            </SelectItem>
                        ))}
                    </Select>

                    <p className="text-xs text-kidemia-grey text-center mb-6">
                        A category change will be effected immediately.
                    </p>
                </ModalBody>

                <ModalFooter className="p-0  flex-row justify-center">
                    <Button
                        onPress={onSubmit}
                        isLoading={isLoading}
                        className="min-w-[120px] bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg"
                    >
                        Change
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
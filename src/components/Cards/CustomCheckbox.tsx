import { Checkbox, Chip, cn } from "@heroui/react";

interface CustomCheckboxProps {
  value: string;
  name: string;
  difficulty_level: string;
}

export default function CustomCheckbox({
  value,
  name,
  difficulty_level,
}: CustomCheckboxProps) {
  const getChipColor = () => {
    switch (difficulty_level?.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "danger";
      case "expert":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Checkbox
      aria-label={value}
      color="warning"
      classNames={{
        base: cn(
          "inline-flex w-full max-w-md bg-[#fdf7ef] m-0",
          "hover:bg-kidemia-biege/50 transition-all duration-300",
          "items-center justify-start cursor-pointer rounded-2xl gap-1 px-3 py-4",
          "border border-transparent shadow-sm hover:shadow-md",
          "data-[selected=true]:border-kidemia-secondary data-[selected=true]:bg-white",
        ),
        label: "w-full",
      }}
      value={value}
    >
      <div className="w-full flex justify-between items-start gap-3">
        <div className="space-y-1.5">
          <p className="text-kidemia-black3 text-md font-semibold capitalize whitespace-nowrap">
            {name}
          </p>

        </div>

        <div className="flex flex-col items-end space-y-2">
          <Chip
            size="sm"
            variant="flat"
            color={getChipColor()}
            className="capitalize font-semibold"
          >
            {difficulty_level}
          </Chip>
        </div>
      </div>
    </Checkbox>
  );
}

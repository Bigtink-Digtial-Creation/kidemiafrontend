import { Checkbox, cn } from "@heroui/react";

interface CustomCheckboxProps {
  value: string;
}

export default function CustomCheckbox({ value }: CustomCheckboxProps) {
  return (
    <Checkbox
      aria-label={value}
      color="warning"
      classNames={{
        base: cn(
          "inline-flex max-w-md w-full bg-[#f1d9b4] m-0",
          "hover:bg-kidemia-biege items-center justify-start",
          "cursor-pointer rounded-xl gap-2 px-4 border-2 border-transparent",
          "data-[selected=true]:border-kidemia-secondary",
        ),
        label: "w-full",
      }}
      value={value}
    >
      <p className="text-kidemia-black3 text-xs md:text-lg font-medium capitalize whitespace-nowrap">
        {value}
      </p>
    </Checkbox>
  );
}

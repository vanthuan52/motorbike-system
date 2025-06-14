import { Control, FieldPath } from "react-hook-form";
import { FormControl, FormField, FormLabel, FormMessage } from "./form";
import { Input } from "./input";

interface CustomInput {
  control: Control<any>;
  name: FieldPath<any>;
  type: string;
  label: string;
  placeholder: string;
  className?: string;
}

const CustomInput = ({
  control,
  type = "text",
  name,
  label,
  placeholder,
}: CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                {...field}
                type={type}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;

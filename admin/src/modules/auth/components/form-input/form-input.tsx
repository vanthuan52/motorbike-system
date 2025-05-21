import React from "react";
import { UseFormRegister, FieldError, Path } from "react-hook-form";
import styles from "./form-input.module.scss";

type FieldValues = Record<string, any>;

interface FormInputProps<TFormValues extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<TFormValues>;
  label: string;
  register: UseFormRegister<TFormValues>;
  error?: FieldError;
  containerClassName?: string;
}

export const FormInput = <TFormValues extends FieldValues>({
  name,
  label,
  register,
  error,
  type = "text",
  containerClassName,
  className,
  ...props
}: FormInputProps<TFormValues>) => {
  return (
    <div className={`${styles.formGroup} ${containerClassName}`}>
      <label htmlFor={name} className="text-md font-semibold">
        {label}
      </label>
      <input
        id={name}
        type={type}
        className={`${styles.input} ${
          error ? styles.inputError : ""
        } ${className}`}
        aria-invalid={error ? "true" : "false"}
        {...register(name)}
        {...props}
      />
      {error && (
        <span role="alert" className={styles.errorMessage}>
          {error.message}
        </span>
      )}
    </div>
  );
};

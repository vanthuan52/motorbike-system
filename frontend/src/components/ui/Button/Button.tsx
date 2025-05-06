import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline";
  loading?: boolean;
}

/**
 * A Button component that supports different variants and states.
 *
 * @param {string} label - The text to display on the button.
 * @param {React.ReactNode} [icon] - Optional icon to display alongside the label.
 * @param {string} [type="button"] - The type attribute for the button element.
 * @param {"primary" | "secondary" | "danger" | "outline"} [variant="primary"] - The visual style variant of the button.
 * @param {boolean} [loading=false] - Whether to show a loading spinner and disable the button.
 * @param {boolean} [disabled] - Whether the button is disabled.
 * @param {string} [className=""] - Additional class names for custom styling.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [rest] - Additional attributes for the button element.
 *
 * @returns {JSX.Element} A styled button component with optional icon and loading state.
 */

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  type = "button",
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...rest
}) => {
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = "bg-green-600 text-white hover:bg-green-700";
      break;
    case "secondary":
      variantClasses = "bg-gray-200 text-gray-800 hover:bg-gray-300";
      break;
    case "danger":
      variantClasses = "bg-red-600 text-white hover:bg-red-700";
      break;
    case "outline":
      variantClasses =
        "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
      break;
    default:
      variantClasses = "bg-green-600 text-white hover:bg-green-700";
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition duration-200 ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${variantClasses} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin cursor-wait"></span>
      )}
      {!loading && icon}
      {label}
    </button>
  );
};

export default Button;

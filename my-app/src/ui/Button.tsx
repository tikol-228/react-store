import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-2xl",
        
        // sizes
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-5 py-2.5 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },

        // variants
        {
          "bg-pink-500 text-white hover:bg-pink-600 active:scale-95":
            variant === "primary",

          "bg-gray-100 text-gray-900 hover:bg-gray-200":
            variant === "secondary",

          "border border-pink-500 text-pink-500 hover:bg-pink-50":
            variant === "outline",

          "bg-transparent text-gray-700 hover:bg-gray-100":
            variant === "ghost",
        },

        // states
        "disabled:opacity-50 disabled:cursor-not-allowed",
        loading && "cursor-wait opacity-70",

        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-pulse">Loading...</span>
      ) : (
        children
      )}
    </button>
  );
};
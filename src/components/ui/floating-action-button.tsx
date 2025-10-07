import React from "react";
import { cn } from "../../lib/utils";
import { spawn } from "child_process";
import { LayoutDashboard } from "lucide-react";

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  className,
  disabled = false,
  children,
  size = "md",
  variant = "primary",
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = "http://10.100.1.43/unix/#/aplicacoes";
    }
  };

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-14 w-14",
    lg: "h-16 w-16",
  };

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg hover:shadow-xl",
  };

  return (
    <>
      <div className="fixed bottom-3 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
        Apps
      </div>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
        "fixed bottom-6 right-6 rounded-full flex items-center justify-center",
        "transition-all duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "z-40",
        sizeClasses[size],
        variantClasses[variant],
        className
        )}
      >
        {children || (
        <>
          <LayoutDashboard/>
        </>
        )}
      </button>
    </>
  );
};

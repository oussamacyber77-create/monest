import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2] disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-[#0D0D0D] text-[#F2F2F2] hover:bg-[#333333] dark:bg-[#F2F2F2] dark:text-[#0D0D0D] dark:hover:bg-[#CCCCCC]":
              variant === "primary",
            "bg-[#E8E8E8] text-[#0D0D0D] hover:bg-[#D4D4D4] dark:bg-[#333333] dark:text-[#F2F2F2] dark:hover:bg-[#4D4D4D]":
              variant === "secondary",
            "bg-[#DC2626] text-[#F2F2F2] hover:bg-[#B91C1C]":
              variant === "danger",
            "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#333333]":
              variant === "ghost",
          },
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-5 text-base": size === "md",
            "h-13 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

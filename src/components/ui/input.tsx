import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#0D0D0D] dark:text-[#F2F2F2]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-12 px-4 bg-transparent border text-sm text-[#0D0D0D] dark:text-[#F2F2F2] placeholder-[#999999] dark:placeholder-[#666666] transition-colors focus:outline-none",
            error
              ? "border-[#DC2626] focus-visible:ring-1 focus-visible:ring-[#DC2626]"
              : "border-[#D4D4D4] dark:border-[#333333] focus-visible:ring-1 focus-visible:ring-[#0D0D0D] dark:focus-visible:ring-[#F2F2F2]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[#DC2626] mt-1">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#D4D4D4] dark:border-[#333333]",
        className
      )}
    >
      {children}
    </div>
  )
}

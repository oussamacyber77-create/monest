import type { ReactNode } from "react"
import { PackageOpen } from "lucide-react"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 text-[#D4D4D4] dark:text-[#333333]">
        {icon || <PackageOpen size={48} />}
      </div>
      <h3 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#666666] dark:text-[#999999] max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  )
}

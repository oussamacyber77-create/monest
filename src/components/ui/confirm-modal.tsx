"use client"

import { Modal } from "@/components/ui/modal"
import { AlertTriangle } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "info"
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  const confirmColor =
    variant === "danger"
      ? "bg-[#DC2626] hover:bg-[#B91C1C]"
      : variant === "warning"
        ? "bg-amber-600 hover:bg-amber-700"
        : "bg-[#0D0D0D] dark:bg-[#F2F2F2]"

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle size={24} className="text-[#DC2626]" />
        </div>
        <h3 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{title}</h3>
        <p className="text-sm text-[#666666] dark:text-[#999999]">{description}</p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-11 border border-[#D4D4D4] dark:border-[#333333] text-sm font-medium text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={"flex-1 h-11 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 " + confirmColor}
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

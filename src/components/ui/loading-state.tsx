interface LoadingStateProps {
  text?: string
}

export function LoadingState({ text }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-3">
      <div className="w-8 h-8 border-2 border-[#D4D4D4] dark:border-[#333333] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
      {text && <p className="text-sm text-[#666666] dark:text-[#999999]">{text}</p>}
    </div>
  )
}

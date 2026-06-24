export default function MeetingsLoading() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#D4D4D4] dark:border-[#333333] border-t-[#0D0D0D] dark:border-t-[#F2F2F2] animate-spin" />
        <p className="text-sm text-[#666666] dark:text-[#999999]">Loading meetings...</p>
      </div>
    </div>
  )
}

import Link from "next/link"
import { MonestLogo } from "@/components/ui/monest-logo"

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[#F2F2F2] dark:bg-[#0D0D0D]">
      <div className="w-full max-w-md text-center space-y-6">
        <MonestLogo width={64} height={64} className="mx-auto text-[#0D0D0D] dark:text-[#F2F2F2] fill-current" />
        <h1 className="text-6xl font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">404</h1>
        <p className="text-lg text-[#666666] dark:text-[#999999]">
          الصفحة التي تبحث عنها غير موجودة
        </p>
        <p className="text-sm text-[#999999] dark:text-[#666666]">
          قد تكون تمت إزالتها أو تغيير رابطها
        </p>
        <Link
          href="/"
          className="inline-flex items-center h-12 px-8 bg-[#0D0D0D] dark:bg-[#F2F2F2] text-[#F2F2F2] dark:text-[#0D0D0D] text-sm font-bold hover:opacity-90 transition-opacity"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  )
}

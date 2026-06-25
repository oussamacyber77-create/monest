"use client"

import { Plus } from "lucide-react"
import { getColorFromName } from "@/components/community/utils"
import type { Server } from "@/components/community/types"

interface WorkspaceBarProps {
  servers: Server[]
  selectedServer: string
  onSelectServer: (id: string) => void
  onMobileToggle: () => void
}

export default function WorkspaceBar({ servers, selectedServer, onSelectServer, onMobileToggle }: WorkspaceBarProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-col w-[72px] shrink-0 bg-[#1A1A1A] dark:bg-black border-e border-[#2A2A2A] items-center py-4 gap-2 overflow-y-auto">
        {servers.map((s) => {
          const color = getColorFromName(s.name)
          const active = selectedServer === s.id
          return (
            <button
              key={s.id}
              onClick={() => onSelectServer(s.id)}
              className="relative group"
            >
              <div
                className={`w-[50px] h-[50px] flex items-center justify-center text-white font-bold text-lg transition-all duration-200 ${
                  active ? "rounded-[14px]" : "rounded-2xl hover:rounded-[14px]"
                }`}
                style={{ backgroundColor: color }}
              >
                {s.icon}
              </div>
              {active && (
                <div className="absolute -end-[6px] top-1/2 -translate-y-1/2 w-[3px] h-9 bg-white rounded-s-full" />
              )}
              <div className="absolute end-full me-3 top-1/2 -translate-y-1/2 bg-[#0D0D0D] dark:bg-white text-white dark:text-[#0D0D0D] text-xs px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl rounded">
                {s.name}
              </div>
            </button>
          )
        })}
        <div className="w-8 h-px bg-[#333333] my-1" />
        <button className="w-[50px] h-[50px] rounded-2xl border-2 border-dashed border-[#444] text-[#888] hover:text-white hover:border-white hover:bg-white/[0.06] flex items-center justify-center transition-all">
          <Plus size={22} />
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={onMobileToggle}
        className="md:hidden fixed top-4 end-4 z-[60] w-10 h-10 bg-[#0D0D0D] dark:bg-white text-white dark:text-[#0D0D0D] rounded-xl flex items-center justify-center shadow-lg"
      >
        {servers.find((s) => s.id === selectedServer)?.icon || servers[0]?.icon || "+"}
      </button>
    </>
  )
}

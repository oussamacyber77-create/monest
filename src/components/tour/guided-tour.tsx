"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useSettingsStore } from "@/stores/settings-store"

export interface TourStep {
  targetId: string
  title: { ar: string; en: string }
  content: { ar: string; en: string }
  position?: "top" | "bottom" | "left" | "right"
}

interface GuidedTourProps {
  steps: TourStep[]
  onComplete?: () => void
  onSkip?: () => void
}

export function GuidedTour({ steps, onComplete, onSkip }: GuidedTourProps) {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [currentStep, setCurrentStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 })
  const [visible, setVisible] = useState(false)
  const [viewportH, setViewportH] = useState(0)
  const [viewportW, setViewportW] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const step = steps[currentStep]

  const measure = useCallback(() => {
    const el = document.getElementById(step.targetId)
    if (!el) return false
    const r = el.getBoundingClientRect()
    setRect(r)
    setViewportH(window.innerHeight)
    setViewportW(window.innerWidth)

    const gap = 14
    const pos = step.position || "bottom"
    let top = 0, left = 0

    if (pos === "bottom") {
      top = r.bottom + gap
      left = r.left + r.width / 2
    } else if (pos === "top") {
      top = r.top - gap
      left = r.left + r.width / 2
    } else if (pos === "left") {
      top = r.top + r.height / 2
      left = r.left - gap
    } else {
      top = r.top + r.height / 2
      left = r.right + gap
    }

    setCardPos({ top, left })
    setVisible(true)

    requestAnimationFrame(() => {
      if (cardRef.current) {
        const c = cardRef.current.getBoundingClientRect()
        let ct = top, cl = left

        if (pos === "bottom" || pos === "top") {
          cl = Math.max(gap, Math.min(left - c.width / 2, window.innerWidth - c.width - gap))
          ct = Math.max(gap, Math.min(top, window.innerHeight - c.height - gap))
          if (pos === "top" && ct < gap) ct = r.bottom + gap
          if (pos === "bottom" && ct + c.height > window.innerHeight - gap) ct = r.top - c.height - gap
        } else {
          cl = cl - c.width / 2
          ct = Math.max(gap, Math.min(top - c.height / 2, window.innerHeight - c.height - gap))
          if (pos === "left" && cl < gap) cl = r.right + gap
          if (pos === "right" && cl + c.width > window.innerWidth - gap) cl = r.left - c.width - gap
        }

        setCardPos({ top: ct, left: cl })
      }
    })
    return true
  }, [step])

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 40

    const tryMeasure = () => {
      const found = measure()
      if (found) {
        window.addEventListener("resize", measure)
        window.addEventListener("scroll", measure)
        document.body.style.overflow = "hidden"
      } else if (attempts < maxAttempts) {
        attempts++
        rafRef.current = requestAnimationFrame(tryMeasure)
      } else {
        onSkip?.()
      }
    }

    tryMeasure()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", measure)
      document.body.style.overflow = ""
    }
  }, [measure])

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1)
    else onComplete?.()
  }

  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1)
  }

  if (!step || !rect) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="absolute border-2 border-[#F2F2F2] dark:border-[#0D0D0D] shadow-[0_0_24px_rgba(242,242,242,0.35)] dark:shadow-[0_0_24px_rgba(13,13,13,0.35)] pointer-events-none"
        style={{
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
        }}
      />

      <div
        ref={cardRef}
        className={`absolute min-w-[280px] max-w-[360px] bg-[#0D0D0D] dark:bg-[#F2F2F2] p-5 shadow-lg transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ top: cardPos.top, left: cardPos.left }}
        dir={direction}
      >
        <div className="text-[#F2F2F2] dark:text-[#0D0D0D]">
          <h3 className="text-sm font-bold mb-2">{step.title[lang]}</h3>
          <p className="text-xs leading-relaxed opacity-80">{step.content[lang]}</p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#333333] dark:border-[#D4D4D4]">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 ${i === currentStep ? "bg-[#F2F2F2] dark:bg-[#0D0D0D]" : "bg-[#666666] dark:bg-[#999999]"}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#999999] dark:text-[#666666]">
            {currentStep + 1} / {steps.length}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={onSkip}
            className="text-xs text-[#999999] dark:text-[#666666] hover:text-[#F2F2F2] dark:hover:text-[#0D0D0D] transition-colors"
          >
            {lang === "ar" ? "تخطي الجولة" : "Skip tour"}
          </button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={goPrev}
                className="px-3 py-1.5 text-xs font-medium bg-[#333333] dark:bg-[#D4D4D4] text-[#F2F2F2] dark:text-[#0D0D0D] hover:bg-[#666666] dark:hover:bg-[#999999] transition-colors"
              >
                {lang === "ar" ? "السابق" : "Back"}
              </button>
            )}
            <button
              onClick={goNext}
              className="px-3 py-1.5 text-xs font-medium bg-[#F2F2F2] dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F2F2F2] hover:bg-[#E8E8E8] dark:hover:bg-[#1A1A1A] transition-colors"
            >
              {currentStep < steps.length - 1
                ? (lang === "ar" ? "التالي" : "Next")
                : (lang === "ar" ? "إنهاء" : "Finish")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

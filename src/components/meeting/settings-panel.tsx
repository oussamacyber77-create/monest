"use client"

import { useEffect, useState, useCallback } from "react"
import { Room } from "livekit-client"
import { X, Copy, Check, Monitor, Mic, Video, Link, Volume2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSettingsStore } from "@/stores/settings-store"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  room: Room | null
  roomCode: string
}

export function SettingsPanel({ isOpen, onClose, room, roomCode }: SettingsPanelProps) {
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState("")
  const [selectedMic, setSelectedMic] = useState("")
  const [copied, setCopied] = useState(false)
  const [testMicLevel, setTestMicLevel] = useState(0)
  const [testStream, setTestStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    if (!isOpen) return
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setCameras(devices.filter((d) => d.kind === "videoinput"))
      setMicrophones(devices.filter((d) => d.kind === "audioinput"))
      const currentCam = devices.find((d) => d.kind === "videoinput")
      const currentMic = devices.find((d) => d.kind === "audioinput")
      if (currentCam) setSelectedCamera(currentCam.deviceId)
      if (currentMic) setSelectedMic(currentMic.deviceId)
    })
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !selectedMic) return
    let active = true
    navigator.mediaDevices.getUserMedia({
      audio: { deviceId: selectedMic ? { exact: selectedMic } : undefined },
    }).then((stream) => {
      if (!active) { stream.getTracks().forEach((t) => t.stop()); return }
      setTestStream(stream)
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        if (!active) return
        analyser.getByteFrequencyData(dataArray)
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        setTestMicLevel(avg)
        requestAnimationFrame(tick)
      }
      tick()
    }).catch(() => {})
    return () => {
      active = false
      testStream?.getTracks().forEach((t) => t.stop())
    }
  }, [isOpen, selectedMic])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  const changeCamera = async (deviceId: string) => {
    setSelectedCamera(deviceId)
    if (!room) return
    try {
      await room.localParticipant.setCameraEnabled(false)
      await room.switchActiveDevice("videoinput", deviceId)
      await room.localParticipant.setCameraEnabled(true)
    } catch {}
  }

  const changeMic = async (deviceId: string) => {
    setSelectedMic(deviceId)
    if (!room) return
    try {
      await room.localParticipant.setMicrophoneEnabled(false)
      await room.switchActiveDevice("audioinput", deviceId)
      await room.localParticipant.setMicrophoneEnabled(true)
    } catch {}
  }

  const copyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-[#F2F2F2] dark:bg-[#0D0D0D] border border-[#D4D4D4] dark:border-[#333333] p-6 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={lang === "ar" ? "الإعدادات" : "Settings"}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">
                {lang === "ar" ? "الإعدادات" : "Settings"}
              </h2>
              <button onClick={onClose} className="p-1 text-[#666666] hover:text-[#0D0D0D] dark:text-[#999999] dark:hover:text-[#F2F2F2] transition-colors" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Camera */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                  <Video size={16} /> {lang === "ar" ? "الكاميرا" : "Camera"}
                </label>
                <select
                  value={selectedCamera}
                  onChange={(e) => changeCamera(e.target.value)}
                  className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] focus:outline-none focus:ring-1 focus:ring-[#0D0D0D] dark:focus:ring-[#F2F2F2]"
                >
                  {cameras.length === 0 && (
                    <option value="">{lang === "ar" ? "لا توجد كاميرات" : "No cameras found"}</option>
                  )}
                  {cameras.map((cam) => (
                    <option key={cam.deviceId} value={cam.deviceId}>
                      {cam.label || (lang === "ar" ? "كاميرا" : "Camera") + " " + (cameras.indexOf(cam) + 1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Microphone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                  <Mic size={16} /> {lang === "ar" ? "الميكروفون" : "Microphone"}
                </label>
                <select
                  value={selectedMic}
                  onChange={(e) => changeMic(e.target.value)}
                  className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] focus:outline-none focus:ring-1 focus:ring-[#0D0D0D] dark:focus:ring-[#F2F2F2]"
                >
                  {microphones.length === 0 && (
                    <option value="">{lang === "ar" ? "لا توجد ميكروفونات" : "No microphones found"}</option>
                  )}
                  {microphones.map((mic) => (
                    <option key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || (lang === "ar" ? "ميكروفون" : "Microphone") + " " + (microphones.indexOf(mic) + 1)}
                    </option>
                  ))}
                </select>
                {/* Mic level indicator */}
                <div className="mt-2 h-2 bg-[#E8E8E8] dark:bg-[#1A1A1A] relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 start-0 bg-[#0D0D0D] dark:bg-[#F2F2F2] transition-all duration-75"
                    style={{ width: Math.min((testMicLevel / 128) * 100, 100) + "%" }}
                  />
                </div>
              </div>

              {/* Speaker */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                  <Volume2 size={16} /> {lang === "ar" ? "مكبر الصوت" : "Speaker"}
                </label>
                <select
                  className="w-full h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#0D0D0D] dark:text-[#F2F2F2] focus:outline-none focus:ring-1 focus:ring-[#0D0D0D] dark:focus:ring-[#F2F2F2]"
                >
                  <option value="default">{lang === "ar" ? "افتراضي" : "Default"}</option>
                </select>
              </div>

              {/* Meeting Link */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#0D0D0D] dark:text-[#F2F2F2] mb-2">
                  <Link size={16} /> {lang === "ar" ? "رابط الاجتماع" : "Meeting Link"}
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={typeof window !== "undefined" ? window.location.href : ""}
                    className="flex-1 h-10 px-3 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-sm text-[#666666] dark:text-[#999999] font-mono focus:outline-none"
                  />
                  <button
                    onClick={copyLink}
                    className="w-10 h-10 flex items-center justify-center border border-[#D4D4D4] dark:border-[#333333] text-[#666666] hover:text-[#0D0D0D] dark:hover:text-[#F2F2F2] transition-colors"
                    aria-label={lang === "ar" ? "نسخ الرابط" : "Copy link"}
                  >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Room Code */}
              <div className="p-3 bg-[#E8E8E8] dark:bg-[#1A1A1A]">
                <p className="text-xs text-[#666666] dark:text-[#999999]">
                  {lang === "ar" ? "رمز الغرفة" : "Room Code"}: <span className="font-mono font-bold text-[#0D0D0D] dark:text-[#F2F2F2]">{roomCode}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

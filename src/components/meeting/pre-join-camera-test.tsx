"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"

interface PreJoinCameraTestProps {
  onReady: (stream: MediaStream | null) => void
}

export function PreJoinCameraTest({ onReady }: PreJoinCameraTestProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [audioLevel, setAudioLevel] = useState(0)
  const [error, setError] = useState("")
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"

  useEffect(() => {
    startStream()
    return () => stopStream()
  }, [])

  const startStream = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(s)
      if (videoRef.current) videoRef.current.srcObject = s
      onReady(s)

      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(s)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const tick = () => {
        analyser.getByteFrequencyData(dataArray)
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        setAudioLevel(avg)
        requestAnimationFrame(tick)
      }
      tick()
    } catch {
      setError(lang === "ar" ? "تعذر الوصول إلى الكاميرا والميكروفون" : "Could not access camera & microphone")
    }
  }

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
  }

  const toggleCamera = () => {
    if (!stream) return
    stream.getVideoTracks().forEach((t) => (t.enabled = !cameraOn))
    setCameraOn(!cameraOn)
  }

  const toggleMic = () => {
    if (!stream) return
    stream.getAudioTracks().forEach((t) => (t.enabled = !micOn))
    setMicOn(!micOn)
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-[#E8E8E8] dark:bg-[#1A1A1A] aspect-video flex items-center justify-center overflow-hidden">
        {error ? (
          <p className="text-sm text-[#DC2626] px-4 text-center">{error}</p>
        ) : stream && cameraOn ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : (
          <div className="w-16 h-16 bg-[#D4D4D4] dark:bg-[#333333] flex items-center justify-center">
            <VideoOff size={24} className="text-[#666666] dark:text-[#999999]" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleCamera}
          className={"p-3 transition-colors " + (cameraOn
            ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
            : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#333333]")}
          title={cameraOn ? (lang === "ar" ? "إيقاف الكاميرا" : "Turn camera off") : (lang === "ar" ? "تشغيل الكاميرا" : "Turn camera on")}
        >
          {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button
          onClick={toggleMic}
          className={"p-3 transition-colors " + (micOn
            ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]"
            : "text-[#666666] hover:text-[#0D0D0D] hover:bg-[#E8E8E8] dark:text-[#999999] dark:hover:text-[#F2F2F2] dark:hover:bg-[#333333]")}
          title={micOn ? (lang === "ar" ? "كتم الميكروفون" : "Mute mic") : (lang === "ar" ? "تشغيل الميكروفون" : "Unmute mic")}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
      </div>

      {micOn && (
        <div className="h-2 bg-[#E8E8E8] dark:bg-[#333333] relative overflow-hidden">
          <div
            className="absolute inset-y-0 start-0 bg-[#0D0D0D] dark:bg-[#F2F2F2] transition-all duration-75"
            style={{ width: Math.min((audioLevel / 128) * 100, 100) + "%" }}
          />
        </div>
      )}
    </div>
  )
}

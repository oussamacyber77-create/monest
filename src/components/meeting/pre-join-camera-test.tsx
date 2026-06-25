"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Mic, MicOff, Video, VideoOff, Volume2, RotateCw, Camera } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"

interface PreJoinCameraTestProps {
  onReady: (stream: MediaStream | null) => void
}

export function PreJoinCameraTest({ onReady }: PreJoinCameraTestProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [audioLevel, setAudioLevel] = useState(0)
  const [error, setError] = useState("")
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [devices, setDevices] = useState<{ video: MediaDeviceInfo[]; audio: MediaDeviceInfo[]; speaker: MediaDeviceInfo[] }>({ video: [], audio: [], speaker: [] })
  const [selectedCamera, setSelectedCamera] = useState("")
  const [selectedMic, setSelectedMic] = useState("")
  const [selectedSpeaker, setSelectedSpeaker] = useState("")
  const [isSpeakerTesting, setIsSpeakerTesting] = useState(false)
  const [noDevices, setNoDevices] = useState(false)
  const { direction } = useSettingsStore()
  const lang = direction === "rtl" ? "ar" : "en"
  const levelRaf = useRef<number>(0)

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
    if (levelRaf.current) cancelAnimationFrame(levelRaf.current)
  }, [stream])

  const enumerateDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices()
      const video = all.filter((d) => d.kind === "videoinput")
      const audio = all.filter((d) => d.kind === "audioinput")
      const speaker = all.filter((d) => d.kind === "audiooutput")
      setDevices({ video, audio, speaker })
      setNoDevices(video.length === 0 && audio.length === 0)
      if (video.length > 0 && !selectedCamera) setSelectedCamera(video[0].deviceId)
      if (audio.length > 0 && !selectedMic) setSelectedMic(audio[0].deviceId)
      if (speaker.length > 0 && !selectedSpeaker) setSelectedSpeaker(speaker[0].deviceId)
    } catch {
      // enumerate may fail in some browsers
    }
  }, [selectedCamera, selectedMic, selectedSpeaker])

  const startStream = useCallback(async () => {
    stopStream()
    setError("")
    setPermissionDenied(false)
    try {
      const constraints: MediaStreamConstraints = { video: cameraOn, audio: micOn }
      if (selectedCamera && cameraOn) {
        constraints.video = { deviceId: { exact: selectedCamera } }
      }
      if (selectedMic && micOn) {
        constraints.audio = { deviceId: { exact: selectedMic } }
      }
      const s = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
      }
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
        levelRaf.current = requestAnimationFrame(tick)
      }
      tick()
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setPermissionDenied(true)
        setError(lang === "ar" ? "السماح بالوصول للكاميرا والمايك من إعدادات المتصفح" : "Allow camera & mic access in browser settings")
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        setNoDevices(true)
        setError(lang === "ar" ? "لم يتم العثور على كاميرا أو مايك" : "No camera or mic found")
      } else {
        setError(lang === "ar" ? "تعذر الوصول إلى الكاميرا والميكروفون" : "Could not access camera & microphone")
      }
      onReady(null)
    }
  }, [cameraOn, micOn, selectedCamera, selectedMic, stopStream, onReady, lang])

  useEffect(() => {
    enumerateDevices()
  }, [enumerateDevices])

  useEffect(() => {
    startStream()
    return () => {
      stopStream()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [startStream, stopStream])

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = !cameraOn))
    }
    setCameraOn(!cameraOn)
  }

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = !micOn))
    }
    setMicOn(!micOn)
  }

  const changeCamera = (deviceId: string) => {
    setSelectedCamera(deviceId)
  }

  const changeMic = (deviceId: string) => {
    setSelectedMic(deviceId)
  }

  const changeSpeaker = (deviceId: string) => {
    setSelectedSpeaker(deviceId)
  }

  const testSpeaker = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    // Generate a simple test tone using AudioContext
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      gain.gain.value = 0.3
      osc.type = "sine"
      osc.frequency.value = 440
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      setIsSpeakerTesting(true)
      setTimeout(() => {
        osc.stop()
        ctx.close()
        setIsSpeakerTesting(false)
      }, 1500)
    } catch {
      // fallback: just toggle state
      setIsSpeakerTesting(true)
      setTimeout(() => setIsSpeakerTesting(false), 1500)
    }
  }

  const initials = "?" // falls back when no name yet

  return (
    <div className="space-y-4">
      {/* Video preview */}
      <div className="relative bg-[#E8E8E8] dark:bg-[#1A1A1A] aspect-video flex items-center justify-center overflow-hidden rounded-sm">
        {/* Loading state */}
        {!error && !stream && (
          <div className="flex flex-col items-center gap-2">
            <Camera size={32} className="text-[#999999] animate-pulse" />
            <span className="text-xs text-[#999999]">{lang === "ar" ? "جاري تشغيل الكاميرا..." : "Starting camera..."}</span>
          </div>
        )}
        {/* Permission denied */}
        {permissionDenied && (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <VideoOff size={24} className="text-[#DC2626]" />
            </div>
            <p className="text-xs text-[#DC2626] font-medium">{error}</p>
          </div>
        )}
        {/* No devices */}
        {noDevices && !permissionDenied && (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Camera size={24} className="text-[#D97706]" />
            </div>
            <p className="text-xs text-[#D97706] font-medium">{error}</p>
          </div>
        )}
        {/* Self-view (mirrored) */}
        {stream && cameraOn && !permissionDenied && (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
        )}
        {/* Camera off placeholder */}
        {(!stream || !cameraOn) && !permissionDenied && !noDevices && (
          <div className="w-16 h-16 bg-[#D4D4D4] dark:bg-[#333333] flex items-center justify-center">
            <span className="text-xl font-bold text-[#666666] dark:text-[#999999]">{initials}</span>
          </div>
        )}
        {/* No camera badge */}
        {stream && !cameraOn && (
          <div className="absolute bottom-2 start-2 bg-[#DC2626] text-white text-[10px] px-2 py-0.5 font-medium flex items-center gap-1">
            <VideoOff size={10} /> {lang === "ar" ? "الكاميرا متوقفة" : "Camera off"}
          </div>
        )}
      </div>

      {/* Device selection rows */}
      {devices.video.length > 0 && (
        <div className="flex items-center gap-2">
          <Video size={14} className="shrink-0 text-[#666666] dark:text-[#999999]" />
          <select
            value={selectedCamera}
            onChange={(e) => changeCamera(e.target.value)}
            className="flex-1 h-9 px-2 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#0D0D0D] dark:text-[#F2F2F2] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2]"
            aria-label={lang === "ar" ? "اختيار الكاميرا" : "Select camera"}
          >
            {devices.video.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || (lang === "ar" ? "كاميرا" : "Camera") + " " + (devices.video.indexOf(d) + 1)}
              </option>
            ))}
          </select>
        </div>
      )}
      {devices.audio.length > 0 && (
        <div className="flex items-center gap-2">
          <Mic size={14} className="shrink-0 text-[#666666] dark:text-[#999999]" />
          <select
            value={selectedMic}
            onChange={(e) => changeMic(e.target.value)}
            className="flex-1 h-9 px-2 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#0D0D0D] dark:text-[#F2F2F2] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2]"
            aria-label={lang === "ar" ? "اختيار الميكروفون" : "Select microphone"}
          >
            {devices.audio.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || (lang === "ar" ? "ميكروفون" : "Microphone") + " " + (devices.audio.indexOf(d) + 1)}
              </option>
            ))}
          </select>
        </div>
      )}
      {devices.speaker.length > 0 && (
        <div className="flex items-center gap-2">
          <Volume2 size={14} className="shrink-0 text-[#666666] dark:text-[#999999]" />
          <select
            value={selectedSpeaker}
            onChange={(e) => changeSpeaker(e.target.value)}
            className="flex-1 h-9 px-2 bg-transparent border border-[#D4D4D4] dark:border-[#333333] text-xs text-[#0D0D0D] dark:text-[#F2F2F2] outline-none focus:border-[#0D0D0D] dark:focus:border-[#F2F2F2]"
            aria-label={lang === "ar" ? "اختيار السماعة" : "Select speaker"}
          >
            {devices.speaker.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || (lang === "ar" ? "سماعة" : "Speaker") + " " + (devices.speaker.indexOf(d) + 1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Controls row */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleCamera}
          className={"p-3 transition-colors " + (cameraOn ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]" : "bg-[#DC2626] text-white")}
          title={cameraOn ? (lang === "ar" ? "إيقاف الكاميرا" : "Turn camera off") : (lang === "ar" ? "تشغيل الكاميرا" : "Turn camera on")}
          aria-label={cameraOn ? (lang === "ar" ? "إيقاف الكاميرا" : "Turn camera off") : (lang === "ar" ? "تشغيل الكاميرا" : "Turn camera on")}
        >
          {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button
          onClick={toggleMic}
          className={"p-3 transition-colors " + (micOn ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]" : "bg-[#DC2626] text-white")}
          title={micOn ? (lang === "ar" ? "كتم الميكروفون" : "Mute mic") : (lang === "ar" ? "تشغيل الميكروفون" : "Unmute mic")}
          aria-label={micOn ? (lang === "ar" ? "كتم الميكروفون" : "Mute mic") : (lang === "ar" ? "تشغيل الميكروفون" : "Unmute mic")}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button
          onClick={testSpeaker}
          disabled={isSpeakerTesting}
          className={"p-3 transition-colors flex items-center gap-1 text-xs font-medium " + (isSpeakerTesting ? "bg-[#0D0D0D] text-[#F2F2F2] dark:bg-[#F2F2F2] dark:text-[#0D0D0D]" : "bg-[#E8E8E8] text-[#666666] hover:text-[#0D0D0D] dark:bg-[#333333] dark:text-[#999999] dark:hover:text-[#F2F2F2]")}
          title={lang === "ar" ? "اختبار السماعة" : "Test speaker"}
          aria-label={lang === "ar" ? "اختبار السماعة" : "Test speaker"}
        >
          {isSpeakerTesting ? <RotateCw size={16} className="animate-spin" /> : <Volume2 size={16} />}
          {lang === "ar" ? "اختبار" : "Test"}
        </button>
      </div>

      {/* Mic level meter */}
      {micOn && stream && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-[#666666] dark:text-[#999999] flex items-center gap-1">
              <Mic size={10} /> {lang === "ar" ? "اختبار المايك" : "Mic Test"}
            </span>
            <span className="text-[10px] text-[#999999]">{Math.round((audioLevel / 128) * 100)}%</span>
          </div>
          <div className="h-2 bg-[#E8E8E8] dark:bg-[#333333] relative overflow-hidden">
            <div
              className="absolute inset-y-0 start-0 bg-[#0D0D0D] dark:bg-[#F2F2F2] transition-all duration-75"
              style={{ width: Math.min((audioLevel / 128) * 100, 100) + "%" }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

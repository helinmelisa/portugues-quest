import { useEffect, useRef, useState } from 'react'

const TYPES = ['audio/webm', 'audio/mp4', 'audio/ogg']

export const recorderSupported =
  typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'

// Records from the microphone and hands back the audio when stopped (or after maxSeconds).
export function useRecorder(onRecorded: (audio: Blob) => void, maxSeconds = 20) {
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const callback = useRef(onRecorded)

  useEffect(() => {
    callback.current = onRecorded
  }, [onRecorded])

  useEffect(() => () => recorder.current?.stream.getTracks().forEach((t) => t.stop()), [])

  const start = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = TYPES.find((t) => MediaRecorder.isTypeSupported(t))
      const r = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      const chunks: Blob[] = []
      r.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data)
      }
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        window.clearTimeout(timer.current)
        setRecording(false)
        callback.current(new Blob(chunks, { type: r.mimeType }))
      }
      r.start()
      recorder.current = r
      setRecording(true)
      timer.current = window.setTimeout(() => r.state === 'recording' && r.stop(), maxSeconds * 1000)
    } catch {
      setError('Microphone access was blocked. Allow it in your browser settings to speak.')
    }
  }

  const stop = () => {
    if (recorder.current?.state === 'recording') recorder.current.stop()
  }

  return { recording, error, start, stop }
}

import { useEffect, useRef, useState } from 'react'
const TYPES = ['audio/webm', 'audio/mp4', 'audio/ogg']
export const recorderSupported = typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'

export function useRecorder(onRecorded: (audio: Blob) => void, maxSeconds = 20) {
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const generation = useRef(0)
  const callback = useRef(onRecorded)
  useEffect(() => { callback.current = onRecorded }, [onRecorded])
  const cancel = () => {
    generation.current++
    window.clearTimeout(timer.current)
    if (recorder.current) {
      recorder.current.onstop = null
      if (recorder.current.state === 'recording') recorder.current.stop()
      recorder.current.stream.getTracks().forEach((t) => t.stop())
    }
    setRecording(false)
  }
  const cancelRef = useRef(cancel)
  useEffect(() => { cancelRef.current = cancel })
  useEffect(() => {
    const hidden = () => { if (document.hidden) cancelRef.current() }
    document.addEventListener('visibilitychange', hidden)
    return () => { document.removeEventListener('visibilitychange', hidden); cancelRef.current() }
  }, [])
  const start = async () => {
    cancel()
    setError(null)
    const turn = generation.current
    let stream: MediaStream | undefined
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      if (turn !== generation.current) { stream.getTracks().forEach((t) => t.stop()); return }
      const mimeType = TYPES.find((t) => MediaRecorder.isTypeSupported(t))
      const r = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      const chunks: Blob[] = []
      r.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
      r.onstop = () => {
        stream?.getTracks().forEach((t) => t.stop())
        window.clearTimeout(timer.current)
        setRecording(false)
        if (turn === generation.current) callback.current(new Blob(chunks, { type: r.mimeType }))
      }
      r.onerror = () => { cancel(); setError('Recording was interrupted. Please try again.') }
      r.start()
      recorder.current = r
      setRecording(true)
      timer.current = window.setTimeout(() => { if (r.state === 'recording') r.stop() }, maxSeconds * 1000)
    } catch {
      stream?.getTracks().forEach((t) => t.stop())
      if (turn === generation.current) setError('Microphone access was blocked. Allow it in your browser settings to speak.')
    }
  }
  const stop = () => { if (recorder.current?.state === 'recording') recorder.current.stop() }
  return { recording, error, start, stop, cancel }
}

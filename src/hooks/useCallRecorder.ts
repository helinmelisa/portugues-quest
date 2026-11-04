import { useEffect, useRef, useState } from 'react'

// End a turn after a short silence. The normal recorder remains tap-to-stop.
export function useCallRecorder(onRecorded: (audio: Blob) => void, onError: (message: string) => void) {
  const active = useRef<(() => void) | null>(null)
  const generation = useRef(0)
  const callbacks = useRef({ onRecorded, onError })
  const [recording, setRecording] = useState(false)
  useEffect(() => { callbacks.current = { onRecorded, onError } }, [onRecorded, onError])

  const cancel = () => {
    generation.current++
    active.current?.()
    active.current = null
    setRecording(false)
  }

  useEffect(() => () => { generation.current++; active.current?.() }, [])

  const start = async () => {
    cancel()
    const turn = generation.current
    let stream: MediaStream | undefined
    let context: AudioContext | undefined
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      if (turn !== generation.current) { stream.getTracks().forEach((t) => t.stop()); return }
      context = new AudioContext()
      await context.resume()
      if (turn !== generation.current) { stream.getTracks().forEach((t) => t.stop()); void context.close(); return }
      const analyser = context.createAnalyser()
      analyser.fftSize = 2048
      context.createMediaStreamSource(stream).connect(analyser)
      const samples = new Float32Array(analyser.fftSize)
      const mimeType = ['audio/webm', 'audio/mp4', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported(t))
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      const chunks: Blob[] = []
      let heard = false
      let lastSound = Date.now()
      const began = Date.now()
      let timer: number | undefined
      const release = () => {
        window.clearInterval(timer)
        stream?.getTracks().forEach((t) => t.stop())
        if (context?.state !== 'closed') void context?.close()
      }
      active.current = () => {
        recorder.onstop = null
        if (recorder.state === 'recording') recorder.stop()
        release()
      }
      recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
      recorder.onerror = () => {
        cancel()
        callbacks.current.onError('The microphone stopped working. Check it and resume the call.')
      }
      recorder.onstop = () => {
        release()
        active.current = null
        setRecording(false)
        if (turn !== generation.current) return
        if (!heard) callbacks.current.onError('I didn’t hear speech. When you’re ready, resume and speak near the mic.')
        else callbacks.current.onRecorded(new Blob(chunks, { type: recorder.mimeType }))
      }
      recorder.start()
      setRecording(true)
      timer = window.setInterval(() => {
        analyser.getFloatTimeDomainData(samples)
        const rms = Math.sqrt(samples.reduce((sum, n) => sum + n * n, 0) / samples.length)
        const now = Date.now()
        if (rms > 0.02) { heard = true; lastSound = now }
        if ((heard && now - lastSound > 1600) || now - began > (heard ? 25000 : 10000)) {
          if (recorder.state === 'recording') recorder.stop()
        }
      }, 100)
    } catch {
      stream?.getTracks().forEach((t) => t.stop())
      if (context?.state !== 'closed') void context?.close()
      if (turn === generation.current) callbacks.current.onError('Couldn’t start the microphone. Allow access in your browser and resume, or use chat instead.')
    }
  }

  return { recording, start, cancel }
}

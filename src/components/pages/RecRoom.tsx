import { Download, Mic, MicOff, Pause, Play, Square, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { match, P } from 'ts-pattern';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────────

type AudioStatus = 'ENDED' | 'PLAYING' | 'PAUSED';
type RecQuality = 'LO' | 'MED' | 'HI';

interface NoteInfo {
  western: string;
  korean: string;
  frequency: number;
}

interface Recording {
  id: string;
  url: string;
  blob: Blob;
  duration: number;
  createdAt: Date;
  label: string;
  waveform: number[];
}

// ── Constants ──────────────────────────────────────────────────────────────────

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const KOREAN_NAMES = ['도', '도♯', '레', '레♯', '미', '파', '파♯', '솔', '솔♯', '라', '라♯', '시'];

const QUALITY_BPS: Record<RecQuality, number> = {
  LO: 64_000,
  MED: 128_000,
  HI: 256_000,
};

const SHORTCUTS = [
  { key: 'Space', desc: '재생 / 일시정지' },
  { key: 'R', desc: '녹음 시작 / 중지' },
  { key: 'Esc', desc: '정지' },
];

const VU_BARS = Array.from({ length: 20 }, (_, i) => ({
  id: `vu-bar-pos${String(i).padStart(2, '0')}`,
  threshold: (i / 20) * 100,
  isRed: i >= 17,
  isYellow: i >= 13 && i < 17,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const frequencyToNoteInfo = (frequency: number): NoteInfo | null => {
  if (frequency <= 0) return null;
  const midiNote = Math.round(12 * Math.log2(frequency / 440) + 69);
  if (midiNote < 0 || midiNote > 127) return null;
  const noteIndex = ((midiNote % 12) + 12) % 12;
  const octave = Math.floor(midiNote / 12) - 1;
  return {
    western: `${NOTE_NAMES[noteIndex]}${octave}`,
    korean: KOREAN_NAMES[noteIndex],
    frequency,
  };
};

const detectPitch = (analyser: AnalyserNode, sampleRate: number): number => {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  const minBin = Math.floor((80 * analyser.fftSize) / sampleRate);
  const maxBin = Math.ceil((2000 * analyser.fftSize) / sampleRate);

  let maxAmplitude = 0;
  let maxBinIndex = -1;

  for (let i = minBin; i <= Math.min(maxBin, bufferLength - 1); i++) {
    if (dataArray[i] > maxAmplitude) {
      maxAmplitude = dataArray[i];
      maxBinIndex = i;
    }
  }

  if (maxAmplitude < 30 || maxBinIndex === -1) return -1;

  let interpolatedBin = maxBinIndex;
  if (maxBinIndex > 0 && maxBinIndex < bufferLength - 1) {
    const alpha = dataArray[maxBinIndex - 1];
    const beta = dataArray[maxBinIndex];
    const gamma = dataArray[maxBinIndex + 1];
    const denom = 2 * (2 * beta - alpha - gamma);
    if (denom !== 0) interpolatedBin = maxBinIndex + (gamma - alpha) / denom;
  }

  return (interpolatedBin * sampleRate) / analyser.fftSize;
};

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const decodeWaveform = async (blob: Blob, sampleCount = 80): Promise<number[]> => {
  try {
    const ctx = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();
    const decoded = await ctx.decodeAudioData(arrayBuffer);
    const data = decoded.getChannelData(0);
    const blockSize = Math.floor(data.length / sampleCount);
    const result: number[] = [];
    for (let i = 0; i < sampleCount; i++) {
      let peak = 0;
      for (let j = 0; j < blockSize; j++) {
        const abs = Math.abs(data[i * blockSize + j] ?? 0);
        if (abs > peak) peak = abs;
      }
      result.push(peak);
    }
    await ctx.close();
    return result;
  } catch {
    return [];
  }
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const VUMeter = ({ level }: { level: number }) => (
  <div className="flex items-end gap-0.5 h-8">
    {VU_BARS.map(({ id, threshold, isRed, isYellow }) => {
      const active = level > threshold;
      return (
        <div
          key={id}
          className={cn('w-0.75 rounded-sm transition-all duration-75', {
            'bg-red-500': active && isRed,
            'bg-yellow-400': active && isYellow,
            'bg-green-400': active && !isRed && !isYellow,
            'bg-zinc-700': !active,
            'h-8': isRed,
            'h-6': isYellow,
            'h-4': !isRed && !isYellow,
          })}
        />
      );
    })}
  </div>
);

const WaveformPreview = ({ waveform }: { waveform: number[] }) => {
  if (!waveform.length) return null;
  const W = 72;
  const H = 20;
  const barW = W / waveform.length;
  const cx = H / 2;
  const d = waveform
    .map((amp, i) => {
      const x = (i * barW).toFixed(1);
      const h = Math.max(1, amp * H);
      return `M${x},${(cx - h / 2).toFixed(1)} L${x},${(cx + h / 2).toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="shrink-0 opacity-60"
      aria-hidden="true"
    >
      <path d={d} stroke="#22c55e" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </svg>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

export const RecRoom = () => {
  // ── State ────────────────────────────────────────────────────────────────────

  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('ENDED');
  const [noteInfo, setNoteInfo] = useState<NoteInfo | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [vuLevel, setVuLevel] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [visualizerMode, setVisualizerMode] = useState<'wave' | 'freq'>('wave');
  const [quality, setQuality] = useState<RecQuality>('MED');
  const [echoEnabled, setEchoEnabled] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  // ── Refs ─────────────────────────────────────────────────────────────────────

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pitchAnalyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioPlaySourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const echoDelayRef = useRef<DelayNode | null>(null);
  const echoGainRef = useRef<GainNode | null>(null);
  const noteHistoryRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingStartRef = useRef<number>(0);

  // Refs for stale-closure avoidance in draw loop and keyboard shortcuts
  const isRecordingRef = useRef(false);
  const visualizerModeRef = useRef<'wave' | 'freq'>('wave');
  const echoEnabledRef = useRef(false);

  // actionsRef: always holds latest handlers — updated every render
  const actionsRef = useRef({
    audioStatus: 'ENDED' as AudioStatus,
    isRecording: false,
    activeRecordingId: null as string | null,
    // handlers assigned below after function declarations
    handlePlay: () => {},
    handlePause: () => {},
    handleStop: () => {},
    startRecording: () => {},
    stopRecording: () => {},
  });

  // Sync state → refs
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);
  useEffect(() => { visualizerModeRef.current = visualizerMode; }, [visualizerMode]);
  useEffect(() => { echoEnabledRef.current = echoEnabled; }, [echoEnabled]);

  const activeRecording = recordings.find((r) => r.id === activeRecordingId) ?? null;
  const audioDuration = activeRecording?.duration ?? 0;
  const progressPercent = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  // ── Visualization ─────────────────────────────────────────────────────────────

  const stopVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvasRef.current.height / 2);
        ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
        ctx.stroke();
      }
    }
    noteHistoryRef.current = [];
    setNoteInfo(null);
    setVuLevel(0);
  }, []);

  // Uses refs to avoid stale closure — no deps needed
  const drawVisualization = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const width = canvas.width;
    const height = canvas.height;
    const sampleRate = audioContextRef.current?.sampleRate ?? 44100;
    let frameCount = 0;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      // Read live refs (not stale closures)
      const recording = isRecordingRef.current;
      const mode = visualizerModeRef.current;

      // VU level (RMS from time-domain data)
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] - 128) / 128;
        sum += v * v;
      }
      setVuLevel(Math.min(100, Math.sqrt(sum / bufferLength) * 400));

      // Pitch detection every 4 frames
      frameCount++;
      if (frameCount % 4 === 0 && pitchAnalyserRef.current) {
        const freq = detectPitch(pitchAnalyserRef.current, sampleRate);
        const detected = frequencyToNoteInfo(freq);
        if (detected) {
          noteHistoryRef.current.push(detected.western);
          if (noteHistoryRef.current.length > 8) noteHistoryRef.current.shift();
          const counts: Record<string, number> = {};
          for (const n of noteHistoryRef.current) counts[n] = (counts[n] ?? 0) + 1;
          const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
          if (dominant === detected.western) setNoteInfo(detected);
        } else {
          noteHistoryRef.current = [];
          setNoteInfo(null);
        }
      }

      // Canvas background
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);

      if (mode === 'wave') {
        analyser.getByteTimeDomainData(dataArray);
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        if (recording) {
          gradient.addColorStop(0, '#ef4444');
          gradient.addColorStop(0.5, '#f97316');
          gradient.addColorStop(1, '#ef4444');
        } else {
          gradient.addColorStop(0, '#22c55e');
          gradient.addColorStop(0.5, '#3b82f6');
          gradient.addColorStop(1, '#22c55e');
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = recording ? '#ef4444' : '#22c55e';
        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        analyser.getByteFrequencyData(dataArray);
        const barCount = 64;
        const barWidth = (width / barCount) * 0.8;
        const gap = (width / barCount) * 0.2;
        for (let i = 0; i < barCount; i++) {
          const value = dataArray[Math.floor((i / barCount) * bufferLength)];
          const barHeight = (value / 255) * height;
          const hue = recording ? (i / barCount) * 30 : 120 + (i / barCount) * 60;
          ctx.fillStyle = `hsl(${hue}, 90%, 55%)`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = `hsl(${hue}, 90%, 55%)`;
          ctx.fillRect(i * (barWidth + gap), height - barHeight, barWidth, barHeight);
        }
        ctx.shadowBlur = 0;
      }

      // Center guide line
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    };

    draw();
  }, []); // no deps — uses refs

  // Draw idle canvas on mount
  useEffect(() => {
    stopVisualization();
  }, [stopVisualization]);

  // ── Audio source management ────────────────────────────────────────────────

  const disconnectPlaySource = useCallback(() => {
    // IMPORTANT: Do NOT null out audioPlaySourceRef.current.
    // createMediaElementSource() can only be called once per <audio> element.
    // Setting it to null would cause an InvalidStateError on the next play attempt.
    // Just disconnect the node from the graph so it goes silent; reuse it on next play.
    if (audioPlaySourceRef.current) {
      try { audioPlaySourceRef.current.disconnect(); } catch { /* ok */ }
    }
    if (echoDelayRef.current) {
      try { echoDelayRef.current.disconnect(); } catch { /* ok */ }
      echoDelayRef.current = null;
    }
    if (echoGainRef.current) {
      try { echoGainRef.current.disconnect(); } catch { /* ok */ }
      echoGainRef.current = null;
    }
    // Also disconnect analyser from destination so it doesn't leak audio
    if (analyserRef.current) {
      try { analyserRef.current.disconnect(); } catch { /* ok */ }
    }
  }, []);

  // ── Recording ──────────────────────────────────────────────────────────────

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    const audioContext = audioContextRef.current;

    if (analyserRef.current) analyserRef.current.disconnect();

    audioSourceRef.current = audioContext.createMediaStreamSource(stream);
    analyserRef.current = audioContext.createAnalyser();
    analyserRef.current.fftSize = 2048;

    pitchAnalyserRef.current = audioContext.createAnalyser();
    pitchAnalyserRef.current.fftSize = 8192;

    audioSourceRef.current.connect(analyserRef.current);
    audioSourceRef.current.connect(pitchAnalyserRef.current);
    // Note: mic source is NOT connected to destination to avoid feedback

    drawVisualization();

    const mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: QUALITY_BPS[quality],
    });
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const duration = Math.round((Date.now() - recordingStartRef.current) / 1000);
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      const id = crypto.randomUUID();

      // Add recording immediately with empty waveform
      setRecordings((prev) => {
        const takeNumber = prev.length + 1;
        return [
          ...prev,
          {
            id,
            url,
            blob: audioBlob,
            duration,
            createdAt: new Date(),
            label: `Take ${takeNumber}`,
            waveform: [],
          },
        ];
      });

      // Select the new recording and load it into the audio element
      const audio = audioRef.current;
      if (audio) {
        audio.src = url;
        audio.load();
      }
      setActiveRecordingId(id);
      setIsRecording(false);
      isRecordingRef.current = false;

      stopVisualization();
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);

      for (const track of stream.getTracks()) track.stop();

      // Decode waveform asynchronously and update recording
      decodeWaveform(audioBlob).then((waveform) => {
        setRecordings((prev) =>
          prev.map((r) => (r.id === id ? { ...r, waveform } : r))
        );
      });
    };

    mediaRecorder.onstart = () => {
      setIsRecording(true);
      isRecordingRef.current = true;
      recordingStartRef.current = Date.now();
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  // ── Playback ───────────────────────────────────────────────────────────────

  // Select a recording: imperatively update audio element src to avoid React re-render timing issues
  const handleSelectRecording = useCallback((id: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Stop current playback and tear down audio graph
    audio.pause();
    stopVisualization();
    disconnectPlaySource();

    // Imperatively set the new src — no waiting for React re-render
    const rec = recordings.find((r) => r.id === id);
    if (rec) {
      audio.src = rec.url;
      audio.load();
    }

    setActiveRecordingId(id);
    setAudioStatus('ENDED');
    setCurrentTime(0);
  }, [recordings, stopVisualization, disconnectPlaySource]);

  const handlePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    const audioContext = audioContextRef.current;

    // Resume if browser suspended the context (requires user gesture, which we have here)
    if (audioContext.state === 'suspended') audioContext.resume();

    // Ensure analysers exist (may have been replaced during a subsequent recording)
    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 2048;
    }
    if (!pitchAnalyserRef.current) {
      pitchAnalyserRef.current = audioContext.createAnalyser();
      pitchAnalyserRef.current.fftSize = 8192;
    }

    // Create the play source only ONCE per audio element — never recreate.
    // createMediaElementSource() throws InvalidStateError on the second call for the same element.
    if (!audioPlaySourceRef.current) {
      audioPlaySourceRef.current = audioContext.createMediaElementSource(audio);
    }

    // Always rebuild connections from scratch.
    // The analyserRef may have been replaced (new one created during a subsequent recording),
    // so we cannot rely on previously wired connections still being valid.
    try { audioPlaySourceRef.current.disconnect(); } catch { /* ok if already disconnected */ }
    audioPlaySourceRef.current.connect(analyserRef.current);
    audioPlaySourceRef.current.connect(pitchAnalyserRef.current);

    try { analyserRef.current.disconnect(); } catch { /* ok */ }
    if (echoEnabledRef.current) {
      const delay = audioContext.createDelay(1.0);
      delay.delayTime.value = 0.25;
      const feedbackGain = audioContext.createGain();
      feedbackGain.gain.value = 0.3;
      echoDelayRef.current = delay;
      echoGainRef.current = feedbackGain;

      analyserRef.current.connect(audioContext.destination); // dry
      audioPlaySourceRef.current.connect(delay);
      delay.connect(feedbackGain);
      feedbackGain.connect(delay); // feedback loop
      feedbackGain.connect(audioContext.destination); // wet
    } else {
      analyserRef.current.connect(audioContext.destination);
    }

    audio.play();
    drawVisualization();
  }, [drawVisualization]);

  const handlePause = useCallback(() => {
    audioRef.current?.pause();
    stopVisualization();
  }, [stopVisualization]);

  const handleStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setAudioStatus('ENDED');
    setCurrentTime(0);
    stopVisualization();
    disconnectPlaySource();
  }, [stopVisualization, disconnectPlaySource]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleDownload = (recording: Recording) => {
    const a = document.createElement('a');
    a.href = recording.url;
    a.download = `${recording.label}.webm`;
    a.click();
  };

  const handleDelete = (id: string) => {
    if (activeRecordingId === id) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      disconnectPlaySource();
      stopVisualization();
      setActiveRecordingId(null);
      setAudioStatus('ENDED');
      setCurrentTime(0);
    }
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  // ── Inline label editing ───────────────────────────────────────────────────

  const commitLabelEdit = () => {
    if (!editingId) return;
    const trimmed = editingLabel.trim();
    if (trimmed) {
      setRecordings((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, label: trimmed } : r))
      );
    }
    setEditingId(null);
  };

  // ── Echo toggle ────────────────────────────────────────────────────────────

  const toggleEcho = () => {
    const next = !echoEnabled;
    setEchoEnabled(next);
    echoEnabledRef.current = next;

    // If currently playing, connect/disconnect the echo path
    if (audioPlaySourceRef.current && echoDelayRef.current) {
      if (!next) {
        try { audioPlaySourceRef.current.disconnect(echoDelayRef.current); } catch { /* ok */ }
      } else {
        try { audioPlaySourceRef.current.connect(echoDelayRef.current); } catch { /* ok */ }
      }
    }
  };

  // ── Audio element events ───────────────────────────────────────────────────

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.onplaying = () => setAudioStatus('PLAYING');
    audio.onended = () => {
      setAudioStatus('ENDED');
      setCurrentTime(0);
      stopVisualization();
    };
    audio.onpause = () => setAudioStatus((s) => s === 'PLAYING' ? 'PAUSED' : s);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
  }, [stopVisualization]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────

  // Update actionsRef every render — read inside the single stable listener
  actionsRef.current = {
    audioStatus,
    isRecording,
    activeRecordingId,
    handlePlay,
    handlePause,
    handleStop,
    startRecording,
    stopRecording,
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const { audioStatus: status, isRecording: rec, activeRecordingId: activeId } = actionsRef.current;

      match(e.code)
        .with('Space', () => {
          e.preventDefault();
          if (status === 'PLAYING') actionsRef.current.handlePause();
          else if (activeId) actionsRef.current.handlePlay();
        })
        .with('KeyR', () => {
          e.preventDefault();
          if (rec) actionsRef.current.stopRecording();
          else actionsRef.current.startRecording();
        })
        .with('Escape', () => {
          if (rec) actionsRef.current.stopRecording();
          else actionsRef.current.handleStop();
        })
        .otherwise(() => {});
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []); // register once — uses actionsRef for latest values

  // ── Cleanup ────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <article className="flex flex-col items-center w-full md:max-w-2xl mx-auto px-4 py-6 gap-4">

      {/* ── Keyboard shortcuts panel ── */}
      {showShortcuts && (
        <div className="w-full bg-zinc-800/90 rounded-xl border border-zinc-700 px-4 py-3">
          <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-2">Shortcuts</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5">
            {SHORTCUTS.map(({ key, desc }) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-200 text-[10px] font-mono shrink-0">
                  {key}
                </kbd>
                <span className="text-[10px] text-zinc-400 font-mono">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Studio panel ── */}
      <div className="w-full bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-zinc-800 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            {/* Shortcuts toggle */}
            <button
              type="button"
              onClick={() => setShowShortcuts((v) => !v)}
              className={cn(
                'w-4 h-4 rounded-full text-[9px] font-mono font-bold flex items-center justify-center transition-colors',
                showShortcuts ? 'bg-zinc-200 text-black' : 'bg-zinc-600 text-zinc-400 hover:bg-zinc-500',
              )}
              title="단축키 보기"
            >
              ?
            </button>
            <div className="w-3 h-3 rounded-full bg-zinc-600" />
            <div className="w-3 h-3 rounded-full bg-zinc-600" />
          </div>

          <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">Rec Room</span>

          {/* ON AIR indicator */}
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest transition-all duration-300',
            isRecording
              ? 'bg-red-600 text-white shadow-[0_0_12px_#ef4444]'
              : 'bg-zinc-700 text-zinc-500',
          )}>
            <span className={cn(
              'w-2 h-2 rounded-full',
              isRecording ? 'bg-white animate-pulse' : 'bg-zinc-500',
            )} />
            ON AIR
          </div>
        </div>

        {/* Visualizer */}
        <div className="relative w-full px-4 pt-4 pb-2">
          {/* Mode + Echo toggles */}
          <div className="absolute top-6 right-6 flex gap-1 z-10">
            <button
              type="button"
              onClick={() => {
                setVisualizerMode('wave');
                visualizerModeRef.current = 'wave';
              }}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors',
                visualizerMode === 'wave'
                  ? 'bg-green-500 text-black'
                  : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600',
              )}
            >
              WAVE
            </button>
            <button
              type="button"
              onClick={() => {
                setVisualizerMode('freq');
                visualizerModeRef.current = 'freq';
              }}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors',
                visualizerMode === 'freq'
                  ? 'bg-green-500 text-black'
                  : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600',
              )}
            >
              FREQ
            </button>
          </div>

          <canvas ref={canvasRef} className="w-full rounded-lg" width={600} height={120} />
        </div>

        {/* VU meter + Note display + Timer */}
        <div className="flex items-center justify-between px-5 py-3 gap-4">
          {/* VU meter */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className="text-[10px] font-mono text-zinc-500 tracking-widest">LEVEL</span>
            <VUMeter level={vuLevel} />
          </div>

          {/* Note detector */}
          <div className="flex items-center justify-center gap-3 flex-1 h-12 bg-zinc-800 rounded-xl border border-zinc-700 px-4">
            {noteInfo ? (
              <>
                <span
                  className="text-3xl font-bold text-green-400 leading-none"
                  style={{ textShadow: '0 0 12px #22c55e' }}
                >
                  {noteInfo.korean}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-blue-400">{noteInfo.western}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{noteInfo.frequency.toFixed(1)} Hz</span>
                </div>
              </>
            ) : (
              <span className="text-xs font-mono text-zinc-600">
                {isRecording || audioStatus === 'PLAYING' ? '─ detecting ─' : '─ no signal ─'}
              </span>
            )}
          </div>

          {/* Timer */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[10px] font-mono text-zinc-500 tracking-widest">
              {isRecording ? 'REC' : 'TIME'}
            </span>
            <span className={cn(
              'text-lg font-mono font-bold tabular-nums',
              isRecording ? 'text-red-400' : 'text-zinc-400',
            )}>
              {formatTime(isRecording ? recordingSeconds : Math.floor(currentTime))}
            </span>
          </div>
        </div>

        {/* Playback progress — time labels on separate row, no overlap */}
        {activeRecording && (
          <div className="px-5 pb-3 flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-[10px] font-mono text-zinc-500">
                {formatTime(Math.floor(currentTime))}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {formatTime(audioDuration)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={audioDuration}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #22c55e ${progressPercent}%, #3f3f46 ${progressPercent}%)`,
              }}
            />
          </div>
        )}

        {/* Quality selector + Echo toggle */}
        <div className="flex items-center gap-3 px-5 pb-3">
          <span className="text-[10px] font-mono text-zinc-500 tracking-widest">QUALITY</span>
          {(['LO', 'MED', 'HI'] as RecQuality[]).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              disabled={isRecording}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors disabled:opacity-40',
                quality === q
                  ? 'bg-zinc-300 text-black'
                  : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600',
              )}
            >
              {q}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 tracking-widest">ECHO</span>
            <button
              type="button"
              onClick={toggleEcho}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all',
                echoEnabled
                  ? 'bg-purple-600 text-white shadow-[0_0_8px_#a855f7]'
                  : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600',
              )}
              title="다음 재생부터 적용"
            >
              {echoEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-center gap-4 px-5 py-4 border-t border-zinc-800">
          {/* Record button */}
          <div className="relative">
            {isRecording && (
              <>
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20 [animation-delay:150ms]" />
              </>
            )}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                'relative z-10 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-lg',
                isRecording
                  ? 'bg-red-600 border-red-400 text-white shadow-[0_0_20px_#ef4444]'
                  : 'bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-red-500 hover:text-red-400 hover:shadow-[0_0_12px_#ef4444]',
              )}
              title={isRecording ? '녹음 중지 (R)' : '녹음 시작 (R)'}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStop}
              disabled={audioStatus === 'ENDED' && !activeRecording}
              className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-300 flex items-center justify-center hover:border-zinc-400 disabled:opacity-30 transition-colors"
              title="정지 (Esc)"
            >
              <Square size={16} />
            </button>

            {match(audioStatus)
              .with(P.union('ENDED', 'PAUSED'), () => (
                <button
                  type="button"
                  onClick={handlePlay}
                  disabled={!activeRecording}
                  className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-600 text-green-400 flex items-center justify-center hover:border-green-400 hover:shadow-[0_0_10px_#22c55e] disabled:opacity-30 transition-all"
                  title="재생 (Space)"
                >
                  <Play size={20} />
                </button>
              ))
              .with('PLAYING', () => (
                <button
                  type="button"
                  onClick={handlePause}
                  className="w-12 h-12 rounded-full bg-zinc-800 border border-yellow-500 text-yellow-400 flex items-center justify-center hover:shadow-[0_0_10px_#eab308] transition-all"
                  title="일시정지 (Space)"
                >
                  <Pause size={20} />
                </button>
              ))
              .exhaustive()}
          </div>
        </div>
      </div>

      {/* ── Recordings list ── */}
      {recordings.length > 0 && (
        <div className="w-full bg-zinc-900 rounded-2xl border border-zinc-700 shadow-xl overflow-hidden">
          <div className="px-5 py-3 bg-zinc-800 border-b border-zinc-700">
            <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">
              Recordings ({recordings.length})
            </span>
          </div>
          <ul className="divide-y divide-zinc-800">
            {recordings.map((rec) => (
              <li key={rec.id} className="group">
                <div className={cn(
                  'flex items-center gap-2 px-4 py-2.5 transition-colors',
                  activeRecordingId === rec.id ? 'bg-zinc-800' : 'hover:bg-zinc-800/50',
                )}>
                  {/* Select / indicator button */}
                  <button
                    type="button"
                    onClick={() => handleSelectRecording(rec.id)}
                    className="flex items-center gap-2 shrink-0"
                    title="선택"
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full shrink-0 transition-colors',
                      activeRecordingId === rec.id && audioStatus === 'PLAYING'
                        ? 'bg-green-400 shadow-[0_0_6px_#22c55e] animate-pulse'
                        : activeRecordingId === rec.id
                          ? 'bg-blue-400'
                          : 'bg-zinc-600',
                    )} />
                  </button>

                  {/* Waveform preview */}
                  {rec.waveform.length > 0 ? (
                    <WaveformPreview waveform={rec.waveform} />
                  ) : (
                    <div className="w-18 h-5 shrink-0 flex items-center justify-center">
                      <span className="text-[9px] font-mono text-zinc-700">···</span>
                    </div>
                  )}

                  {/* Label (editable) + meta */}
                  <div className="flex-1 min-w-0">
                    {editingId === rec.id ? (
                      <input
                        type="text"
                        value={editingLabel}
                        // biome-ignore lint/a11y/noAutofocus: intentional UX for inline edit
                        autoFocus
                        className="text-sm font-medium text-zinc-200 font-mono bg-transparent border-b border-zinc-500 outline-none w-full"
                        onChange={(e) => setEditingLabel(e.target.value)}
                        onBlur={commitLabelEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitLabelEdit();
                          if (e.key === 'Escape') setEditingId(null);
                          e.stopPropagation();
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <button
                        type="button"
                        className="text-sm font-medium text-zinc-200 font-mono cursor-text select-none block truncate text-left w-full"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingId(rec.id);
                          setEditingLabel(rec.label);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        title="더블클릭으로 이름 편집"
                      >
                        {rec.label}
                      </button>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {formatTime(rec.duration)}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {rec.createdAt.toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] text-zinc-700 font-mono">
                        {quality}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDownload(rec)}
                      className="w-8 h-8 rounded-lg bg-zinc-700 text-zinc-300 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                      title="다운로드"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(rec.id)}
                      className="w-8 h-8 rounded-lg bg-zinc-700 text-zinc-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                      title="삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Audio element — src managed imperatively */}
      <audio ref={audioRef} className="hidden">
        <track kind="captions" srcLang="ko" label="Korean captions" />
      </audio>

      <p className="text-xs text-zinc-600 text-center font-mono">
        녹음 데이터는 브라우저 세션에만 저장되며 서버로 전송되지 않습니다.
      </p>
    </article>
  );
};

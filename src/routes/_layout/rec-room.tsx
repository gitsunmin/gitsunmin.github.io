import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { Mic, Play, Pause } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export const Route = createFileRoute('/_layout/rec-room')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 오디오 재생 완료 감지
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm',
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <article className="flex flex-col items-center justify-center md:max-w-(--breakpoint-md) mx-auto">
      <p className="text-center text-gray-700">
        <strong className="text-lg font-semibold">음성 녹음</strong>
        <br />
        <span>녹음 기능은 저장되지 않습니다.</span>
      </p>
      <div className="relative mt-6">
        <div
          className={cn(
            'absolute inset-0 rounded-2xl border-2 transition-all duration-300 ease-in-out',
            {
              'border-red-500 scale-110 opacity-70': isRecording,
              'border-transparent scale-100 opacity-0': !isRecording,
            },
          )}
        />
        {/* 두 번째 테두리 (약간 시간차 효과) */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl border-2 transition-all duration-300 ease-in-out delay-150',
            {
              'border-red-400 scale-125 opacity-50': isRecording,
              'border-transparent scale-100 opacity-0': !isRecording,
            },
          )}
        />
        <Button
          variant="ghost"
          className={cn(
            'rounded-2xl relative z-10 transition-colors duration-300',
            {
              'hover:bg-red-500 hover:text-primary-foreground': isRecording,
              'hover:bg-primary hover:text-primary-foreground': !isRecording,
            },
            isRecording ? 'bg-red-100 text-red-500' : '',
          )}
          onClick={isRecording ? stopRecording : startRecording}
        >
          <Mic width={68} height={68} />
        </Button>
      </div>

      {audioURL && (
        <div className="mt-6 w-full flex flex-col items-center">
          {/* 오디오 요소는 화면에 표시하지 않음 */}
          <audio ref={audioRef} src={audioURL} className="hidden">
            <track kind="captions" srcLang="ko" label="Korean captions" />
          </audio>

          {/* 커스텀 재생 버튼 */}
          <Button
            variant="outline"
            className="rounded-full p-2 w-12 h-12 flex items-center justify-center"
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>

          <p className="text-sm text-gray-500 mt-2">
            {isPlaying ? '재생 중...' : '녹음된 오디오 재생'}
          </p>
        </div>
      )}
    </article>
  );
}

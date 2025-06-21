import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { Mic, Play, Pause, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { match, P } from 'ts-pattern';

type AudioStatus = 'ENDED' | 'PLAYING' | 'PAUSED';

export const RecRoom = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('ENDED'); // 녹음 중인지 여부
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    console.log('녹음 시작:', stream);

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      console.log('ondataavailable event:', event);
      console.log('audioChunksRef.current:', audioChunksRef.current);

      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      console.log('녹음 중지됨');
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm',
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setIsRecording(false);
    };

    mediaRecorder.onstart = () => {
      setIsRecording(true);
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplaying = () => {
        setAudioStatus('PLAYING');
      };

      audioRef.current.onended = () => {
        setAudioStatus('ENDED');
      };

      audioRef.current.onpause = () => {
        setAudioStatus('PAUSED');
      };
    }
  }, []);

  const handleAudioPlay = () => {
    match(audioRef.current)
      .with(P.nonNullable, (audio) => audio.play())
      .run();
  };

  const handleAudioPause = () => {
    match(audioRef.current)
      .with(P.nonNullable, (audio) => audio.pause())
      .run();
  };

  const handleAudioEnded = () => {
    match(audioRef.current)
      .with(P.nonNullable, (audio) => {
        audio.pause(); // 오디오 일시 정지
        setAudioStatus('ENDED'); // 상태 업데이트
        setAudioURL(''); // 오디오 URL 초기화
        audio.currentTime = 0; // 오디오를 처음으로 되돌림
      })
      .run();
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
            }
          )}
        />
        {/* 두 번째 테두리 (약간 시간차 효과) */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl border-2 transition-all duration-300 ease-in-out delay-150',
            {
              'border-red-400 scale-125 opacity-50': isRecording,
              'border-transparent scale-100 opacity-0': !isRecording,
            }
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
            isRecording ? 'bg-red-100 text-red-500' : ''
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
          <section className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              className="rounded-full p-2 w-12 h-12 flex items-center justify-center"
              onClick={handleAudioEnded}
            >
              <Square size={24} />
            </Button>
            <Button
              variant="outline"
              className="rounded-full p-2 w-12 h-12 flex items-center justify-center"
              onClick={handleAudioPause}
            >
              <Pause size={24} />
            </Button>
            <Button
              variant="outline"
              className="rounded-full p-2 w-12 h-12 flex items-center justify-center"
              onClick={handleAudioPlay}
              disabled={audioStatus === 'PLAYING' || !audioURL}
            >
              <Play size={24} />
            </Button>
          </section>

          <p className="text-sm text-gray-500 mt-2">
            {match(audioStatus)
              .with('ENDED', () => '오디오 재생이 끝났습니다.')
              .with('PLAYING', () => '오디오가 재생 중입니다.')
              .with('PAUSED', () => '오디오가 일시 정지되었습니다.')
              .otherwise(() => '')}
          </p>
        </div>
      )}
    </article>
  );
};

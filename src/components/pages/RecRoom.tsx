import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { Mic, Play, Pause, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { match, P } from 'ts-pattern';

type AudioStatus = 'ENDED' | 'PLAYING' | 'PAUSED';

export const RecRoom = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('ENDED');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 파형 시각화를 위한 추가 참조
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioPlaySourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('녹음 시작:', stream);

    // AudioContext 설정
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;

    // 기존 분석기 정리
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }

    // 스트림 소스 생성 및 분석기 연결
    audioSourceRef.current = audioContext.createMediaStreamSource(stream);
    analyserRef.current = audioContext.createAnalyser();
    analyserRef.current.fftSize = 2048;

    audioSourceRef.current.connect(analyserRef.current);

    // 파형 그리기 시작
    drawWaveform();

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
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

      // 녹음 중지 시 파형 그리기 중지
      stopWaveform();

      // 스트림 트랙 중지
      for (const track of stream.getTracks()) {
        track.stop();
      }
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
      .with(P.nonNullable, (audio) => {
        audio.play();

        // 재생 시 파형 시각화
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        const audioContext = audioContextRef.current;

        if (!analyserRef.current) {
          analyserRef.current = audioContext.createAnalyser();
          analyserRef.current.fftSize = 2048;
        }

        if (!audioPlaySourceRef.current && audio) {
          audioPlaySourceRef.current =
            audioContext.createMediaElementSource(audio);
          audioPlaySourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContext.destination);
        }

        drawWaveform();
      })
      .run();
  };

  const handleAudioPause = () => {
    match(audioRef.current)
      .with(P.nonNullable, (audio) => {
        audio.pause();
        stopWaveform();
      })
      .run();
  };

  const handleAudioEnded = () => {
    match(audioRef.current)
      .with(P.nonNullable, (audio) => {
        audio.pause();
        setAudioStatus('ENDED');
        setAudioURL('');
        audio.currentTime = 0;
        stopWaveform();

        // 오디오 소스 연결 해제
        if (audioPlaySourceRef.current) {
          audioPlaySourceRef.current.disconnect();
          audioPlaySourceRef.current = null;
        }
      })
      .run();
  };

  // 파형 그리기 함수
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      if (!canvasCtx) return;

      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(255, 255, 255)';
      canvasCtx.fillRect(0, 0, width, height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = isRecording
        ? 'rgb(255, 99, 71)'
        : 'rgb(0, 123, 255)';
      canvasCtx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  // 파형 시각화 중지
  const stopWaveform = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // 캔버스 초기화
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d');
      if (canvasCtx) {
        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    }
  };

  return (
    <article className="flex flex-col items-center justify-center md:max-w-(--breakpoint-md) mx-auto">
      <p className="text-center text-gray-700">
        <strong className="text-lg font-semibold">음성 녹음</strong>
        <br />
        <span>녹음 기능은 저장되지 않습니다.</span>
      </p>

      {/* 파형 시각화 캔버스 */}
      <div className="w-full mt-4 mb-2">
        <canvas
          ref={canvasRef}
          className="w-full h-24 border rounded-lg"
          width={600}
          height={100}
        />
      </div>

      <div className="relative mt-2">
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
          {match(audioStatus)
            .with(P.union('ENDED', 'PAUSED'), () => (
              <Button
                variant="outline"
                className="rounded-full p-2 w-12 h-12 flex items-center justify-center"
                onClick={handleAudioPlay}
                disabled={audioStatus === 'PLAYING' || !audioURL}
              >
                <Play size={24} />
              </Button>
            ))
            .with('PLAYING', () => (
              <Button
                variant="outline"
                className="rounded-full p-2 w-12 h-12 flex items-center justify-center"
                onClick={handleAudioPause}
              >
                <Pause size={24} />
              </Button>
            ))
            .exhaustive()}
        </section>

        <p className="text-sm text-gray-500 mt-2">
          {match(audioStatus)
            .with('ENDED', () => '오디오 재생이 끝났습니다.')
            .with('PLAYING', () => '오디오가 재생 중입니다.')
            .with('PAUSED', () => '오디오가 일시 정지되었습니다.')
            .otherwise(() => '')}
        </p>
      </div>
    </article>
  );
};

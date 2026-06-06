import {
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardCopy,
  Download,
  Loader2,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// ── Browser API Types ─────────────────────────────────────────────────────────

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

type ChromeAISession = {
  prompt(text: string): Promise<string>;
  promptStreaming(text: string): AsyncIterable<string>;
  destroy(): void;
};
type ChromeAICapabilities = { available: 'no' | 'readily' | 'after-download' };
type ChromeAILanguageModel = {
  capabilities(): Promise<ChromeAICapabilities>;
  create(opts: { systemPrompt: string }): Promise<ChromeAISession>;
};
type ChromeAI = { languageModel: ChromeAILanguageModel };

// ── Types ──────────────────────────────────────────────────────────────────────

type Question = {
  id: string;
  category?: string;
  question: string;
  hint?: string;
};

type InterviewData = {
  title: string;
  questions: Question[];
};

type QuestionResult = {
  index: number;
  category?: string;
  question: string;
  transcript: string;
  durationSeconds: number;
};

type InterviewSession = {
  sessionId: string;
  title: string;
  startedAt: string;
  completedAt: string;
  results: QuestionResult[];
};

type InterviewPhase = 'SETUP' | 'INTERVIEWING' | 'RESULTS';
type QuestionPhase = 'IDLE' | 'TTS_PLAYING' | 'RECORDING' | 'DONE';

// ── Constants ─────────────────────────────────────────────────────────────────

const EXAMPLE_JSON: InterviewData = {
  title: '풀스택 개발자 면접',
  questions: [
    {
      id: '1',
      category: '자기소개',
      question: '간단하게 자기소개를 해주세요.',
    },
    {
      id: '2',
      category: '기술',
      question: 'React의 렌더링 최적화 방법에 대해 설명해 주세요.',
      hint: 'useMemo, useCallback, React.memo 등',
    },
    {
      id: '3',
      category: '경험',
      question: '가장 어려웠던 프로젝트 경험과 어떻게 해결했는지 말씀해 주세요.',
    },
  ],
};

const AI_FEEDBACK_SYSTEM_PROMPT = `당신은 10년 경력의 시니어 개발자 면접관입니다.
면접 질문과 지원자의 답변을 보고 다음 형식으로 한국어 피드백을 제공하세요.
반드시 아래 항목만 포함하고, 각 항목은 1-2문장으로 간결하게 작성하세요.

**강점**: 답변에서 잘한 점
**개선점**: 보완하면 더 좋을 점
**점수**: 10점 만점 중 X점 (이유 한 줄)`;

const AI_SUMMARY_SYSTEM_PROMPT = `당신은 10년 경력의 시니어 개발자 면접관입니다.
전체 면접 Q&A를 검토하고 다음 형식으로 한국어 종합 평가를 제공하세요. 간결하게 작성하세요.

**종합 점수**: X / 10
**핵심 강점**: 2-3가지 bullet
**핵심 개선점**: 2-3가지 bullet
**최종 한마디**: 전반적인 인상 한 문장`;

// ── Helpers ───────────────────────────────────────────────────────────────────

const generateId = () => Math.random().toString(36).slice(2, 10);

const formatSeconds = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const getChromeAI = (): ChromeAI | null => {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { ai?: ChromeAI }).ai ?? null;
};

// ── Main Content ──────────────────────────────────────────────────────────────

const Content = () => {
  const [support] = useState(() => ({
    tts: typeof window !== 'undefined' && 'speechSynthesis' in window,
    stt:
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  }));

  // Chrome AI availability
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const aiSessionRef = useRef<ChromeAISession | null>(null);

  useEffect(() => {
    const check = async () => {
      const ai = getChromeAI();
      if (!ai) { setAiAvailable(false); return; }
      try {
        const cap = await ai.languageModel.capabilities();
        setAiAvailable(cap.available !== 'no');
      } catch {
        setAiAvailable(false);
      }
    };
    check();
  }, []);

  // Phase state
  const [phase, setPhase] = useState<InterviewPhase>('SETUP');
  const [questionPhase, setQuestionPhase] = useState<QuestionPhase>('IDLE');
  const questionPhaseRef = useRef<QuestionPhase>('IDLE');

  // Setup
  const [jsonInput, setJsonInput] = useState(JSON.stringify(EXAMPLE_JSON, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);

  // Interview state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const liveTranscriptRef = useRef('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [sessionStartedAt, setSessionStartedAt] = useState('');
  const [results, setResults] = useState<QuestionResult[]>([]);

  // AI feedback state
  const [aiFeedbacks, setAiFeedbacks] = useState<Record<number, string>>({});
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState<number | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingStartTimeRef = useRef(0);

  const [manualTranscript, setManualTranscript] = useState('');
  const [copied, setCopied] = useState(false);

  // ── Chrome AI ─────────────────────────────────────────────────────────────

  const getOrCreateSession = useCallback(async (systemPrompt: string): Promise<ChromeAISession | null> => {
    const ai = getChromeAI();
    if (!ai) return null;
    try {
      const session = await ai.languageModel.create({ systemPrompt });
      return session;
    } catch {
      return null;
    }
  }, []);

  const requestAIFeedback = useCallback(async (result: QuestionResult) => {
    if (!aiAvailable) return;
    setAiFeedbackLoading(result.index);
    try {
      const session = await getOrCreateSession(AI_FEEDBACK_SYSTEM_PROMPT);
      if (!session) return;
      const prompt = `질문: ${result.question}\n답변 (${result.durationSeconds}초): ${result.transcript || '(답변 없음)'}`;
      const feedback = await session.prompt(prompt);
      session.destroy();
      setAiFeedbacks(prev => ({ ...prev, [result.index]: feedback }));
    } catch {
      setAiFeedbacks(prev => ({ ...prev, [result.index]: '피드백 생성 중 오류가 발생했습니다.' }));
    } finally {
      setAiFeedbackLoading(null);
    }
  }, [aiAvailable, getOrCreateSession]);

  const requestAISummary = useCallback(async (allResults: QuestionResult[]) => {
    if (!aiAvailable) return;
    setAiSummaryLoading(true);
    try {
      const session = await getOrCreateSession(AI_SUMMARY_SYSTEM_PROMPT);
      if (!session) return;
      const content = allResults
        .map(r => `Q${r.index}. ${r.question}\n답변: ${r.transcript || '(없음)'}`)
        .join('\n\n');
      const summary = await session.prompt(content);
      session.destroy();
      setAiSummary(summary);
    } catch {
      setAiSummary('종합 평가 생성 중 오류가 발생했습니다.');
    } finally {
      setAiSummaryLoading(false);
    }
  }, [aiAvailable, getOrCreateSession]);

  // ── Setup Phase ──────────────────────────────────────────────────────────

  const handleStartInterview = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput) as InterviewData;
      if (!parsed.title || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        setParseError('title과 questions 배열이 필요합니다.');
        return;
      }
      setParseError(null);
      setInterviewData(parsed);
      setCurrentIndex(0);
      setResults([]);
      setAiFeedbacks({});
      setAiSummary('');
      setLiveTranscript('');
      liveTranscriptRef.current = '';
      setManualTranscript('');
      setRecordingSeconds(0);
      setQuestionPhase('IDLE');
      questionPhaseRef.current = 'IDLE';
      setSessionStartedAt(new Date().toISOString());
      setPhase('INTERVIEWING');
    } catch {
      setParseError('올바른 JSON 형식이 아닙니다.');
    }
  }, [jsonInput]);

  // ── Recording + STT ──────────────────────────────────────────────────────

  const startRecordingAndSTT = useCallback(async () => {
    setLiveTranscript('');
    liveTranscriptRef.current = '';
    setManualTranscript('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch {
      // 마이크 권한 없음 — STT만 진행
    }

    if (support.stt) {
      const win = window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
      const SpeechRecognitionImpl = win.SpeechRecognition ?? win.webkitSpeechRecognition;

      if (SpeechRecognitionImpl) {
        const recognition = new SpeechRecognitionImpl();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ko-KR';

        let finalText = '';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalText += `${result[0].transcript} `;
            } else {
              interim += result[0].transcript;
            }
          }
          const combined = finalText + interim;
          setLiveTranscript(combined);
          liveTranscriptRef.current = combined;
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (event.error !== 'no-speech') {
            console.warn('STT error:', event.error);
          }
        };

        recognition.onend = () => {
          if (questionPhaseRef.current === 'RECORDING') {
            try { recognition.start(); } catch { /* 이미 시작됨 */ }
          }
        };

        recognition.start();
      }
    }

    recordingStartTimeRef.current = Date.now();
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(Math.floor((Date.now() - recordingStartTimeRef.current) / 1000));
    }, 1000);

    setQuestionPhase('RECORDING');
    questionPhaseRef.current = 'RECORDING';
  }, [support]);

  // ── TTS ──────────────────────────────────────────────────────────────────

  const startTTS = useCallback((text: string) => {
    if (!support.tts) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;

    utterance.onstart = () => {
      setQuestionPhase('TTS_PLAYING');
      questionPhaseRef.current = 'TTS_PLAYING';
    };

    utterance.onend = () => {
      setTimeout(() => {
        if (questionPhaseRef.current === 'TTS_PLAYING') {
          startRecordingAndSTT();
        }
      }, 150);
    };

    utterance.onerror = () => {
      setQuestionPhase('IDLE');
      questionPhaseRef.current = 'IDLE';
    };

    window.speechSynthesis.speak(utterance);
  }, [startRecordingAndSTT, support]);

  const stopRecordingAndSTT = useCallback((): QuestionResult | null => {
    if (!interviewData) return null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(t => { t.stop(); });
    }
    mediaRecorderRef.current = null;

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try { recognitionRef.current.stop(); } catch { /* ok */ }
      recognitionRef.current = null;
    }

    const duration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
    const transcript = (liveTranscriptRef.current || manualTranscript).trim();
    const q = interviewData.questions[currentIndex];

    setQuestionPhase('DONE');
    questionPhaseRef.current = 'DONE';

    return {
      index: currentIndex + 1,
      category: q.category,
      question: q.question,
      transcript,
      durationSeconds: duration,
    };
  }, [interviewData, currentIndex, manualTranscript]);

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    if (!interviewData) return;
    const result = stopRecordingAndSTT();

    const nextResults = result ? (prev: QuestionResult[]) => [...prev, result] : (prev: QuestionResult[]) => prev;
    setResults(nextResults);

    // AI 피드백 요청 (비동기, 백그라운드)
    if (result) requestAIFeedback(result);

    setLiveTranscript('');
    liveTranscriptRef.current = '';
    setManualTranscript('');
    setRecordingSeconds(0);

    const nextIndex = currentIndex + 1;
    if (nextIndex < interviewData.questions.length) {
      setCurrentIndex(nextIndex);
      setQuestionPhase('IDLE');
      questionPhaseRef.current = 'IDLE';
    } else {
      setPhase('RESULTS');
    }
  }, [interviewData, currentIndex, stopRecordingAndSTT, requestAIFeedback]);

  const handleEndInterview = useCallback(() => {
    const result = stopRecordingAndSTT();
    if (result) {
      setResults(prev => {
        const next = [...prev, result];
        if (aiAvailable) requestAIFeedback(result);
        return next;
      });
    }
    setPhase('RESULTS');
  }, [stopRecordingAndSTT, aiAvailable, requestAIFeedback]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        try { recognitionRef.current.stop(); } catch { /* ok */ }
      }
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach(t => { t.stop(); });
      }
      aiSessionRef.current?.destroy();
    };
  }, []);

  // ── Export ────────────────────────────────────────────────────────────────

  const buildSession = useCallback((): InterviewSession => ({
    sessionId: generateId(),
    title: interviewData?.title ?? '',
    startedAt: sessionStartedAt,
    completedAt: new Date().toISOString(),
    results,
  }), [interviewData, sessionStartedAt, results]);

  const handleExportJSON = useCallback(() => {
    const session = buildSession();
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${session.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [buildSession]);

  const handleCopyForAI = useCallback(async () => {
    const session = buildSession();
    const lines = [
      `# 인터뷰 세션: ${session.title}`,
      `일시: ${new Date(session.startedAt).toLocaleString('ko-KR')}`,
      '',
      '아래는 제 인터뷰 답변입니다. 각 답변에 대해 피드백을 부탁드립니다:',
      '1. 답변의 명확성과 완결성',
      '2. 기술적 정확성',
      '3. 커뮤니케이션 방식',
      '4. 개선 제안',
      '',
      '---',
      '',
      ...session.results.flatMap(r => [
        `## Q${r.index}${r.category ? ` [${r.category}]` : ''}: ${r.question}`,
        `**답변** (${r.durationSeconds}초): ${r.transcript || '(답변 없음)'}`,
        '',
      ]),
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [buildSession]);

  const handleReset = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try { recognitionRef.current.stop(); } catch { /* ok */ }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(t => { t.stop(); });
      mediaRecorderRef.current = null;
    }
    aiSessionRef.current?.destroy();
    aiSessionRef.current = null;
    setPhase('SETUP');
    setQuestionPhase('IDLE');
    questionPhaseRef.current = 'IDLE';
    setCurrentIndex(0);
    setResults([]);
    setAiFeedbacks({});
    setAiSummary('');
    setLiveTranscript('');
    liveTranscriptRef.current = '';
    setManualTranscript('');
    setRecordingSeconds(0);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  const currentQuestion = interviewData?.questions[currentIndex];

  return (
    <article className="px-4 mt-12 pt-4 w-full md:max-w-(--breakpoint-md) mx-auto pb-16 space-y-6">

      {/* Chrome AI 상태 배너 */}
      {aiAvailable !== null && phase === 'SETUP' && (
        <div className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs',
          aiAvailable
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            : 'bg-muted text-muted-foreground border border-border',
        )}>
          <Bot className="size-3.5 shrink-0" />
          {aiAvailable
            ? 'Chrome AI (Gemini Nano) 사용 가능 — 답변 후 자동으로 AI 피드백을 생성합니다.'
            : 'Chrome AI 미지원 환경입니다. 인터뷰 후 "AI에 붙여넣기용 복사"로 외부 AI에 피드백을 요청하세요.'}
        </div>
      )}

      {/* STT 미지원 배너 */}
      {!support.stt && phase === 'INTERVIEWING' && (
        <div className={cn(
          'flex items-start gap-2 px-4 py-3 rounded-xl text-sm',
          'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
          'border border-yellow-200 dark:border-yellow-700',
        )}>
          <MicOff className="size-4 mt-0.5 shrink-0" />
          <span>이 브라우저는 실시간 음성인식(STT)을 지원하지 않습니다. 답변을 직접 입력해 주세요.</span>
        </div>
      )}

      {/* ── SETUP ─────────────────────────────────────────────────────────── */}
      {phase === 'SETUP' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">인터뷰 데이터 입력</h2>
            <p className="text-sm text-muted-foreground">
              아래 형식의 JSON을 붙여넣고 인터뷰를 시작하세요.
            </p>
          </div>

          <textarea
            value={jsonInput}
            onChange={e => {
              setJsonInput(e.target.value);
              setParseError(null);
            }}
            rows={18}
            spellCheck={false}
            className={cn(
              'w-full rounded-xl px-4 py-3 text-sm font-mono',
              'bg-white/60 dark:bg-white/5 backdrop-blur-sm',
              'border text-foreground resize-y',
              'focus:outline-none focus:ring-2 focus:ring-primary/40',
              parseError ? 'border-red-400 dark:border-red-500' : 'border-border',
            )}
          />

          {parseError && (
            <p className="text-sm text-red-500 dark:text-red-400">{parseError}</p>
          )}

          <button
            type="button"
            onClick={handleStartInterview}
            className={cn(
              'w-full py-3 rounded-xl font-medium text-sm',
              'bg-primary text-primary-foreground',
              'hover:opacity-90 active:scale-[0.98] transition-all',
            )}
          >
            인터뷰 시작
          </button>
        </div>
      )}

      {/* ── INTERVIEWING ──────────────────────────────────────────────────── */}
      {phase === 'INTERVIEWING' && interviewData && currentQuestion && (
        <div className="space-y-5">
          {/* 진행 바 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>진행</span>
              <span>{currentIndex + 1} / {interviewData.questions.length}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / interviewData.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 질문 카드 */}
          <div className={cn(
            'rounded-2xl px-5 py-5 space-y-3',
            'bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-border',
          )}>
            {currentQuestion.category && (
              <span className={cn(
                'inline-block text-xs font-medium px-2.5 py-0.5 rounded-full',
                'bg-primary/10 text-primary',
              )}>
                {currentQuestion.category}
              </span>
            )}
            <p className="text-base font-medium text-foreground leading-relaxed">
              {currentQuestion.question}
            </p>
            {currentQuestion.hint && (
              <p className="text-xs text-muted-foreground">힌트: {currentQuestion.hint}</p>
            )}
          </div>

          {/* TTS 버튼 */}
          {support.tts && (
            <button
              type="button"
              onClick={() => startTTS(currentQuestion.question)}
              disabled={questionPhase === 'TTS_PLAYING' || questionPhase === 'RECORDING'}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
                'border border-border bg-white/60 dark:bg-white/5 backdrop-blur-sm',
                'hover:opacity-80 active:scale-[0.98] transition-all',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              <Volume2 className="size-4" />
              {questionPhase === 'TTS_PLAYING' ? '읽는 중…' : '질문 읽기'}
            </button>
          )}

          {/* 녹음 상태 + 전사 */}
          <div className={cn(
            'rounded-2xl px-5 py-4 space-y-3 min-h-30',
            'bg-white/60 dark:bg-white/5 backdrop-blur-sm border',
            questionPhase === 'RECORDING'
              ? 'border-red-400 dark:border-red-500'
              : 'border-border',
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {questionPhase === 'RECORDING' ? (
                  <>
                    <span className="size-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-medium text-red-500">녹음 중</span>
                  </>
                ) : (
                  <>
                    <Mic className="size-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {questionPhase === 'TTS_PLAYING' ? '질문 재생 후 자동 시작' : '답변 대기 중'}
                    </span>
                  </>
                )}
              </div>
              {questionPhase === 'RECORDING' && (
                <span className="text-xs font-mono text-muted-foreground tabular-nums">
                  {formatSeconds(recordingSeconds)}
                </span>
              )}
            </div>

            {support.stt ? (
              <p className={cn(
                'text-sm leading-relaxed min-h-15',
                liveTranscript ? 'text-foreground' : 'text-muted-foreground',
              )}>
                {liveTranscript || (questionPhase === 'RECORDING' ? '말씀해 주세요…' : '')}
              </p>
            ) : (
              <textarea
                value={manualTranscript}
                onChange={e => setManualTranscript(e.target.value)}
                placeholder="답변을 직접 입력하세요…"
                rows={4}
                className={cn(
                  'w-full text-sm rounded-lg px-3 py-2 resize-none',
                  'bg-transparent border border-border',
                  'focus:outline-none focus:ring-2 focus:ring-primary/40',
                  'text-foreground placeholder:text-muted-foreground',
                )}
              />
            )}
          </div>

          {/* AI 피드백 로딩 표시 (이전 질문 피드백 생성 중) */}
          {aiAvailable && aiFeedbackLoading !== null && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              <span>Q{aiFeedbackLoading} AI 피드백 생성 중…</span>
            </div>
          )}

          {/* 수동 녹음 시작 */}
          {questionPhase === 'IDLE' && (
            <button
              type="button"
              onClick={startRecordingAndSTT}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
                'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
                'border border-red-200 dark:border-red-800',
                'hover:opacity-80 active:scale-[0.98] transition-all',
              )}
            >
              <Mic className="size-4" />
              바로 녹음 시작
            </button>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleNext}
              disabled={questionPhase === 'TTS_PLAYING'}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium',
                'bg-primary text-primary-foreground',
                'hover:opacity-90 active:scale-[0.98] transition-all',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              {currentIndex + 1 < interviewData.questions.length ? (
                <>다음 질문 <ChevronRight className="size-4" /></>
              ) : (
                <>인터뷰 완료 <CheckCircle2 className="size-4" /></>
              )}
            </button>
            <button
              type="button"
              onClick={handleEndInterview}
              disabled={questionPhase === 'TTS_PLAYING'}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium',
                'border border-border bg-white/60 dark:bg-white/5 backdrop-blur-sm',
                'hover:opacity-80 active:scale-[0.98] transition-all',
                'disabled:opacity-40 disabled:cursor-not-allowed text-foreground',
              )}
            >
              <Square className="size-4" />
              종료
            </button>
          </div>
        </div>
      )}

      {/* ── RESULTS ───────────────────────────────────────────────────────── */}
      {phase === 'RESULTS' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">인터뷰 완료</h2>
            <p className="text-sm text-muted-foreground">
              {interviewData?.title} · {results.length}문항
            </p>
          </div>

          {/* AI 종합 평가 */}
          {aiAvailable && (
            <div className={cn(
              'rounded-2xl px-5 py-4 space-y-3',
              'bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-border',
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">AI 종합 평가</span>
                </div>
                {!aiSummary && !aiSummaryLoading && (
                  <button
                    type="button"
                    onClick={() => requestAISummary(results)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-lg font-medium',
                      'bg-primary/10 text-primary hover:bg-primary/20 transition-colors',
                    )}
                  >
                    평가 요청
                  </button>
                )}
              </div>
              {aiSummaryLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  <span>전체 답변을 분석하고 있습니다…</span>
                </div>
              )}
              {aiSummary && (
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {aiSummary}
                </p>
              )}
            </div>
          )}

          {/* 결과 목록 */}
          <div className="space-y-4">
            {results.map(r => (
              <div
                key={r.index}
                className={cn(
                  'rounded-2xl px-5 py-4 space-y-3',
                  'bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-border',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">Q{r.index}</span>
                    {r.category && (
                      <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        'bg-primary/10 text-primary',
                      )}>
                        {r.category}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {formatSeconds(r.durationSeconds)}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">{r.question}</p>
                <p className={cn(
                  'text-sm leading-relaxed',
                  r.transcript ? 'text-foreground/80' : 'text-muted-foreground italic',
                )}>
                  {r.transcript || '(답변 없음)'}
                </p>

                {/* 개별 AI 피드백 */}
                {aiAvailable && (
                  <div className={cn(
                    'mt-1 pt-3 border-t border-border/60',
                  )}>
                    {aiFeedbackLoading === r.index ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="size-3 animate-spin" />
                        <span>AI 피드백 생성 중…</span>
                      </div>
                    ) : aiFeedbacks[r.index] ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                          <Sparkles className="size-3" />
                          AI 피드백
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                          {aiFeedbacks[r.index]}
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => requestAIFeedback(r)}
                        className="flex items-center gap-1.5 text-xs text-primary hover:opacity-70 transition-opacity"
                      >
                        <Sparkles className="size-3" />
                        AI 피드백 요청
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCopyForAI}
              className={cn(
                'flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium',
                'bg-primary text-primary-foreground',
                'hover:opacity-90 active:scale-[0.98] transition-all',
              )}
            >
              <ClipboardCopy className="size-4" />
              {copied ? '복사됨!' : 'AI에 붙여넣기용 복사'}
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className={cn(
                'flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium',
                'border border-border bg-white/60 dark:bg-white/5 backdrop-blur-sm',
                'hover:opacity-80 active:scale-[0.98] transition-all text-foreground',
              )}
            >
              <Download className="size-4" />
              JSON 내보내기
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={cn(
                'flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium',
                'text-muted-foreground hover:opacity-80 active:scale-[0.98] transition-all',
              )}
            >
              <RotateCcw className="size-4" />
              새 인터뷰
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

// ── Page Export ───────────────────────────────────────────────────────────────

export const InterviewBotPage = () => {
  return (
    <Content />
  );
};

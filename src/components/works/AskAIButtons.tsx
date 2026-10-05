import { Check, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { AI_TARGETS, askPrompt } from '@/lib/askAi';
import { cn } from '@/lib/utils';

type Props = {
  /** 렌즈에서 고른 역량 이름. 비어 있으면 일반적인 질문이 된다. */
  focus?: string[];
  className?: string;
};

/** 사이트는 LLM을 부르지 않는다 — 질문은 읽는 사람의 AI가 답한다. */
export const AskAIButtons = ({ focus = [], className }: Props) => {
  const [copied, setCopied] = useState(false);
  const prompt = askPrompt(focus);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드를 쓸 수 없는 환경이면 조용히 둔다. 링크 버튼은 그대로 쓸 수 있다.
    }
  };

  const button =
    'inline-flex items-center gap-1.5 rounded-md border border-border/70 px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors';

  return (
    <div className={cn('flex flex-wrap items-center gap-2 print:hidden', className)}>
      {AI_TARGETS.map((target) => (
        <a key={target.id} href={target.href(prompt)} target="_blank" rel="noopener noreferrer" className={button}>
          {target.label}
          <ExternalLink className="size-3" />
        </a>
      ))}
      <button type="button" onClick={copy} className={button}>
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? '복사했습니다' : '질문 복사'}
      </button>
    </div>
  );
};

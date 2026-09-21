import { Drawer } from 'vaul';
import type { CSSProperties, ReactNode } from 'react';
import { useVisualViewport } from '@/hooks/useVisualViewport';
import { cn } from '@/lib/utils';

/**
 * 모바일 하단 시트. vaul을 감싸서 손잡이·모서리·배경을 한곳에서 정한다.
 * 덱의 목차와 검색이 같은 시트를 쓰므로, 두 곳에서 같은 손맛이 나야 한다.
 *
 * 높이는 내용이 아니라 `height` 비율이 정하고, 그 기준은 창이 아니라 시각
 * 뷰포트다. 키보드가 올라오면 시각 뷰포트가 줄고, 시트는 그 안에서 같은 비율로
 * 다시 놓인다 — 그래서 입력창도 결과 목록도 키보드 뒤로 들어가지 않는다.
 *
 * vaul의 키보드 보정(repositionInputs)과 body 고정(iOS)은 끈다. 둘 다 창 높이를
 * 기준으로 시트를 밀어 올리는 방식이라 위의 배치와 다투고, body를 고정하면
 * 덱처럼 문서 스크롤로 위치를 세는 화면이 맨 위로 튄다.
 */
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * 닫힘 연출이 끝나 시트가 완전히 내려간 뒤. 시트가 떠 있는 동안은 다이얼로그가
   * 문서 스크롤을 잠가 두므로(iOS Safari는 그 상태에서 프로그램 스크롤도 막는다),
   * 문서를 스크롤하는 일은 이때로 미룬다.
   */
  onClosed?: () => void;
  /** 접근성 제목. 화면에는 보이지 않는다. */
  title: string;
  /** 시각 뷰포트 높이 대비 시트 높이(0~1). */
  height?: number;
  className?: string;
  children: ReactNode;
};

export const BottomSheet = ({ open, onOpenChange, onClosed, title, height = 0.92, className, children }: Props) => {
  const viewport = useVisualViewport(open);
  const style: CSSProperties | undefined = viewport
    ? {
        top: viewport.top + Math.round(viewport.height * (1 - height)),
        bottom: 'auto',
        height: Math.round(viewport.height * height),
      }
    : undefined;

  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      onAnimationEnd={(isOpen) => {
        // 오버레이(스크롤 잠금의 주인)가 내려가는 것과 거의 같은 순간이라, 한 박자 늦춘다.
        if (!isOpen) window.setTimeout(() => onClosed?.(), 60);
      }}
      noBodyStyles
      repositionInputs={false}
    >
      <Drawer.Portal>
        {/* touch-none: 덱의 문서 스크롤이 시트 뒤에서 따라 움직이지 않게 한다. */}
        <Drawer.Overlay className="fixed inset-0 z-[70] touch-none bg-black/40" />
        <Drawer.Content
          style={style}
          className={cn(
            'fixed inset-x-0 bottom-0 z-[71] flex max-h-[92%] flex-col outline-none',
            'rounded-t-2xl border-t border-border bg-background text-foreground',
            className,
          )}
        >
          <Drawer.Handle className="mt-3 mb-2 shrink-0" />
          <Drawer.Title className="sr-only">{title}</Drawer.Title>
          <Drawer.Description className="sr-only">{title}</Drawer.Description>
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

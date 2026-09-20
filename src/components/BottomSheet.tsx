import { Drawer } from 'vaul';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * 모바일 하단 시트. vaul을 감싸서 손잡이·모서리·배경을 한곳에서 정한다.
 * 덱의 목차와 검색이 같은 시트를 쓰므로, 두 곳에서 같은 손맛이 나야 한다.
 *
 * 높이는 내용이 정하지 않고 `snapPoints`가 정한다 — 키보드가 올라와도 시트가
 * 내용에 맞춰 튀지 않게 하기 위해서다.
 */
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 접근성 제목. 화면에는 보이지 않는다. */
  title: string;
  /** 0~1 비율 또는 px 문자열. 첫 값이 열릴 때의 높이다. */
  snapPoints?: (number | string)[];
  className?: string;
  children: ReactNode;
};

export const BottomSheet = ({ open, onOpenChange, title, snapPoints = [0.92], className, children }: Props) => (
  <Drawer.Root open={open} onOpenChange={onOpenChange} snapPoints={snapPoints} fadeFromIndex={0}>
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 z-[70] bg-black/40" />
      <Drawer.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-[71] flex h-full max-h-[97%] flex-col outline-none',
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

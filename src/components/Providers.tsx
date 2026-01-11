import { DarkModeProvider } from '@/providers/DarkModeProvider';
import { FontSizeProvider } from '@/providers/FontSizeContext';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const Providers = ({ children }: Props) => {
    return (
        <DarkModeProvider>
            <FontSizeProvider>{children}</FontSizeProvider>
        </DarkModeProvider>
    );
};

import { useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreWithCopyProps {
    children: React.ReactNode;
}

export const PreWithCopy = ({ children }: PreWithCopyProps) => {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = async () => {
        console.log(11);
        if (!preRef.current) return;

        const code = preRef.current.textContent || '';
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    return (
        <div className="relative my-4 w-full group">
            <pre ref={preRef} className="overflow-x-auto p-4 rounded-lg bg-gray-900 dark:bg-gray-950 shadow-lg">
                {children}
            </pre>
            <button
                onClick={handleCopy}
                className={cn(
                    'absolute top-2 right-2 p-2 rounded-md transition-all z-10',
                    'z-40 cursor-pointer',
                    'bg-gray-700  hover:bg-gray-600 text-gray-300 hover:text-white',
                    copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                )}
                aria-label={copied ? 'Copied!' : 'Copy code'}
                type="button"
            >
                {copied ? (
                    <Check size={16} className="text-green-400" />
                ) : (
                    <Copy size={16} />
                )}
            </button>
        </div>
    );
};

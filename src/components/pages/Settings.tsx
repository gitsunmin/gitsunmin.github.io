import { useDarkMode } from '@/hooks/useDarkMode';
import { Moon, Sun, Type } from 'lucide-react';
import { useFontSize } from '@/hooks/useFontSize';

export const SettingsPage = () => {
    const { darkMode, setDarkMode } = useDarkMode();
    const { fontSize, changeFontSize } = useFontSize();

    return (
        <div className="max-w-3xl mx-auto mt-12 px-4 py-8 w-full">
            <div className="bg-card rounded-lg shadow-sm dark:shadow-gray-600 divide-y">
                {/* 테마 설정 */}
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {darkMode ? (
                                <Moon className="h-5 w-5 text-blue-400" />
                            ) : (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            )}
                            <span className="font-medium">테마 모드</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setDarkMode(!darkMode)}
                            className="flex items-center justify-center h-6 w-12 rounded-full relative bg-secondary"
                            aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                        >
                            <div
                                className={`absolute h-5 w-5 rounded-full bg-primary transition-transform ${darkMode ? 'translate-x-3' : '-translate-x-3'}`}
                            />
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {darkMode
                            ? '다크 모드가 활성화되어 있습니다.'
                            : '라이트 모드가 활성화되어 있습니다.'}
                    </p>
                </div>

                {/* 폰트 사이즈 설정 */}
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Type className="h-5 w-5 text-blue-400" />
                        <span className="font-medium">폰트 크기</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                        컨텐츠의 텍스트 크기를 조절합니다.
                    </p>
                    <div className="flex gap-2">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => changeFontSize(size)}
                                className={`px-3 py-1.5 rounded-md text-sm ${fontSize === size
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                {size === 'small' ? '작게' : size === 'medium' ? '보통' : '크게'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

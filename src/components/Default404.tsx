import { useRouter } from '@tanstack/react-router';
import { Button } from './Button';

export const Default404 = () => {
  const router = useRouter();

  const handleGoHome = () => {
    console.log('handleGoHome');
    router.navigate({
      to: '/',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white">
      <div className="relative text-8xl font-bold flex gap-4">
        <span className="animate-bounce">4</span>
        <span className="animate-pulse">0</span>
        <span className="animate-bounce">4</span>
      </div>

      {/* 에러 메시지 */}
      <h1 className="mt-6 text-2xl font-semibold text-center">
        페이지를 찾을 수 없어요.
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
        요청하신 페이지가 존재하지 않아요. <br /> 주소를 확인해주세요.
      </p>

      {/* 홈으로 이동 버튼 */}
      <Button variant="primary" className="mt-6" onClick={handleGoHome}>
        홈으로 가기
      </Button>

      {/* 애니메이션 효과 (흐릿한 원) */}
      <div className="absolute bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};

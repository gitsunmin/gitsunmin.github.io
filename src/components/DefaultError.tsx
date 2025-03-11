import { Button } from './Button';

export const DefaultError = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoReport = () => {
    window.location.href = 'https://github.com/gitsunmin/i/issues/new';
  };
  return (
    <main className="flex flex-col items-center justify-center h-[100dvh] w-full gap-4">
      <h1 className="text-2xl">🙏 죄송합니다 🙏</h1>
      <div className="flex flex-col items-center justify-center gap-6">
        <p className="text-center">
          <span className="text-red-500">에러가 발생하였습니다.</span>
          <br />
        </p>
        <div className="flex gap-x-4">
          <Button variant="primary" onClick={handleGoHome}>
            홈으로
          </Button>
          <Button variant="outline" onClick={handleGoReport}>
            제보하기
          </Button>
        </div>
      </div>
    </main>
  );
};

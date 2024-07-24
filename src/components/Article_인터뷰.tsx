import { 인터뷰 } from '@/data/인터뷰';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import defaultMan from '@/assets/default_man.webp';
import { Card_채팅 } from '@/components/Card_채팅';

export const Article_인터뷰 = () => {
  return (
    <article className="flex flex-wrap gap-y-[10px] px-[10px] max-w-[430px] mx-auto">
      {인터뷰.map((채팅, index, list) => {
        const { name, text } = 채팅;
        const isContinues = list[index - 1]?.name === name;

        return (
          <>
            <div
              className={cn('w-full flex gap-x-[10px]', {
                'flex-row': name === 'James',
                'flex-row-reverse': name === 'Sunmin',
              })}
            >
              {isContinues ? (
                <div className="w-[40px]"></div>
              ) : (
                <div className="flex items-start">
                  <Avatar>
                    <AvatarImage
                      src={
                        name === 'James'
                          ? defaultMan
                          : 'https://github.com/gitsunmin.png'
                      }
                      alt={`${name}_profile`}
                      width={40}
                      className="rounded-full"
                    />
                    <AvatarFallback>{name}</AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div className={cn('max-w-[60%]')}>
                {isContinues ? null : (
                  <div
                    className={cn({
                      'text-left': name === 'James',
                      'text-right': name === 'Sunmin',
                    })}
                  >
                    {name}
                  </div>
                )}
                <Card_채팅 title={name} text={text} />
              </div>
            </div>
          </>
        );
      })}
    </article>
  );
};

import { script } from '@/data/소개';
import cn from 'classnames';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import defaultMan from '@/assets/default_man.webp';
import { Card_소개 } from '@/components/Card_소개';

export const Section_소개 = () => {
  return (
    <section className="flex flex-wrap gap-y-[10px] px-[10px] max-w-[430px] mx-auto">
      {script.map((script, index, list) => {
        const { name, text } = script;
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
                <Card_소개 title={name} text={text} />
              </div>
            </div>
          </>
        );
      })}
    </section>
  );
};

import { Card } from '@/components/ui/card';

type Props = {
  title: string;
  text: React.ReactNode;
};

export const Card_소개 = (props: Props) => {
  const { text } = props;
  return <Card className="rounded-[10px] py-[12px] px-[10px]">{text}</Card>;
};

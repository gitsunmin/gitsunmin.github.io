import { Page } from '@/components/project/Page';
import React from 'react';

type Props = {
  title: string;
  cover: {
    front: string;
    back: string;
  };
  description: React.ReactNode;
  achievements: React.ReactNode[];
};

export const BookTemplate = ({ title, cover, description }: Props) => {
  return (
    <article className="snap-y snap-mandatory h-[100dvh] overflow-y-scroll">
      <Page variant="cover">
        <img
          src={cover.front}
          loading="lazy"
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>

      <Page className="text-5xl flex items-center justify-center">{title}</Page>

      <Page>
        <h2 className="text-5xl">목차</h2>
      </Page>

      <Page>{description}</Page>

      <Page variant="cover">
        <img
          src={cover.back}
          loading="lazy"
          alt="식봄 프로젝트 정면 표지"
          aria-label="식봄 프로젝트 정면 표지"
        />
      </Page>
    </article>
  );
};

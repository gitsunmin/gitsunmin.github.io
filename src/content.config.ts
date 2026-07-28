/// <reference types="astro/client" />
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const til = defineCollection({
  loader: glob({
    pattern: ['**/*.mdx', '!README.mdx'],
    base: './modules/til',
  }),
  schema: z.looseObject({
    title: z.string().optional(),
    description: z.string().optional(),
    summary: z.string().optional(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    math: z.boolean().optional(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('gitsunmin'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const worksCollection = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/works',
  }),
  schema: z.object({
    title: z.string(),
    draft: z.boolean().default(false),
    // 아래 둘은 WorkBrief로 렌더된다. 본문 산문에서 분리해
    // "프로젝트 개요 / 담당 범위"를 모든 탭 상단에 같은 형태로 고정 노출한다.

    /** 한두 문장짜리 개요. 길어지면 본문 배경 절로 옮긴다. */
    summary: z.string().optional(),
    /**
     * 담당 범위. 한 줄에 하나씩, 무엇을 어디까지 했는지 서술형으로 적는다.
     * 예: "거래전표 등록 화면 — 설계부터 개발까지"
     * 전담/주도 같은 등급 라벨은 쓰지 않는다. 등급만으로는 무엇을 했는지 알 수 없다.
     */
    contributions: z.array(z.string()).optional(),
  }),
});

export const collections = { til, blog: blogCollection, works: worksCollection };

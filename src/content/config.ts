/// <reference types="astro/client" />
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const til = defineCollection({
    loader: glob({
        pattern: ['**/*.mdx', '!README.mdx'],
        base: './modules/til',
    }),
    schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        summary: z.string().optional(),
        date: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().optional(),
        image: z.string().optional(),
        author: z.string().optional(),
        math: z.boolean().optional(),
    }).passthrough(), // 추가 필드 허용
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('gitsunmin'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
  }),
});

export const collections = { til, blog: blogCollection };


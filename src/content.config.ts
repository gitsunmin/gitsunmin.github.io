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
  }),
});

export const collections = { til, blog: blogCollection, works: worksCollection };

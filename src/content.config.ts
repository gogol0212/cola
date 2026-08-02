import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['children', 'medical', 'critical-illness', 'savings', 'pension', 'overseas-assets']),
    summary: z.string(),
    audience: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['draft', 'reviewed', 'published']).default('draft'),
    sortOrder: z.number().int().default(100),
    updatedAt: z.coerce.date(),
    region: z.string().default('中国大陆'),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

export const collections = { products };

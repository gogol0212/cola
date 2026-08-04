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
    productLines: z.array(z.enum(['health', 'accident', 'critical-illness', 'retirement', 'wealth', 'legacy'])).min(1),
    audiences: z.array(z.enum(['adult', 'child'])).min(1),
    officialUrl: z.string().url().optional(),
    heroImage: z.string().optional(),
    heroImagePosition: z.string().default('center'),
    featured: z.boolean().default(false),
    status: z.enum(['draft', 'reviewed', 'published']).default('draft'),
    sortOrder: z.number().int().default(100),
    updatedAt: z.coerce.date(),
    region: z.string().default('中国大陆'),
    seoTitle: z.string(),
    seoDescription: z.string(),
    body: z.string().optional(),
  }),
});

const knowledge = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/knowledge' }),
  schema: z.object({
    title:z.string(),
    slug:z.string(),
    category:z.enum(['medical-policy','insurance-selection','claims','health','family-planning']),
    summary:z.string(),
    coverImage:z.string().optional(),
    featured:z.boolean().default(false),
    status:z.enum(['draft','reviewed','published']).default('draft'),
    updatedAt:z.coerce.date(),
    seoTitle:z.string(),
    seoDescription:z.string(),
    sourceText:z.string().optional(),
    disclaimer:z.string().default('本文仅用于保险及健康知识交流，不构成诊断、治疗、投保建议或销售承诺。'),
    authorLabel:z.string().default('未来可乐团队'),
  }),
});

export const collections = { products, knowledge };

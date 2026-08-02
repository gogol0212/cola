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
    needGroups: z.array(z.enum(['health', 'longevity', 'wealth'])).default([]),
    needTags: z.array(z.enum([
      'accident-medical', 'medical-costs', 'critical-illness', 'long-term-care',
      'family-responsibility', 'children-planning', 'retirement', 'wealth-management'
    ])).default([]),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['draft', 'reviewed', 'published']).default('draft'),
    sortOrder: z.number().int().default(100),
    updatedAt: z.coerce.date(),
    region: z.string().default('中国大陆'),
    seoTitle: z.string(),
    seoDescription: z.string(),
    painPoints: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    highlights: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    coverage: z.array(z.object({ title: z.string(), value: z.string(), text: z.string() })).default([]),
    cases: z.array(z.object({ title: z.string(), scenario: z.string(), result: z.string(), image: z.string().optional() })).default([]),
    comparison: z.array(z.object({ label: z.string(), product: z.string(), market: z.string() })).default([]),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    ctaTitle: z.string().default('预约一对一咨询'),
    ctaText: z.string().default('获得适合家庭实际情况的保障梳理。'),
    qrImage: z.string().optional(),
  }),
});

export const collections = { products };

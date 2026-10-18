import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SITE_PATH_OR_HTTPS } from './lib/checks';

// Tests point this at fixture content; the real site uses src/content.
const CONTENT_DIR = process.env.SITE_CONTENT_DIR ?? './src/content';

// A file on this site ("/papers/x.pdf") or a full https:// address.
const sitePathOrUrl = z.string().regex(SITE_PATH_OR_HTTPS, 'must start with "/" (a file on this site) or "https://"');

const papers = defineCollection({
  loader: glob({ pattern: '*.md', base: `${CONTENT_DIR}/papers` }),
  schema: z.strictObject({
    title: z.string().min(1),
    coauthors: z.array(z.strictObject({ name: z.string().min(1), url: z.url().optional() })).default([]),
    group: z.enum(['published', 'working', 'in-progress']),
    status: z.string().optional(),
    note: z.string().optional(),
    summary: z.string().optional(),
    order: z.int().default(100),
    home: z.boolean().optional(),
    links: z
      .strictObject({
        pdf: sitePathOrUrl.optional(),
        ssrn: z.url().optional(),
        doi: z.url().optional(),
        published: z.url().optional(),
        slides: sitePathOrUrl.optional(),
        data: z.url().optional(),
        other: z.array(z.strictObject({ label: z.string().min(1), url: sitePathOrUrl })).optional(),
      })
      .optional(),
  }),
});

const profile = defineCollection({
  loader: glob({ pattern: 'index.md', base: `${CONTENT_DIR}/profile` }),
  schema: ({ image }) =>
    z.strictObject({
      name: z.string().min(1),
      nameChinese: z.string().optional(),
      title: z.string().min(1),
      affiliation: z.string().min(1),
      email: z.email(),
      description: z.string().min(1).max(160),
      researchIntro: z.string().optional(),
      interests: z.array(z.string().min(1)).min(1),
      photo: image().optional(),
      photoAlt: z.string().optional(),
      links: z
        .strictObject({
          scholar: z.url().optional(),
          linkedin: z.url().optional(),
          orcid: z.url().optional(),
          ssrn: z.url().optional(),
        })
        .default({}),
      jobMarket: z
        .strictObject({
          onMarket: z.boolean().default(false),
          years: z.string().optional(),
          paper: z.string().optional(),
          references: z
            .array(
              z.strictObject({
                name: z.string().min(1),
                title: z.string().min(1),
                school: z.string().min(1),
                url: z.url().optional(),
              }),
            )
            .default([]),
        })
        .prefault({}),
      showTeaching: z.boolean().default(false),
    }),
});

const teaching = defineCollection({
  loader: glob({ pattern: 'index.md', base: `${CONTENT_DIR}/teaching` }),
  schema: z.strictObject({}),
});

export const collections = { papers, profile, teaching };

// The one place pages get their data: reads the content collections, checks the
// settings, and works out which optional parts of the site are switched on.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { checkSettings } from './checks';
import { homePapers, organizePapers, type OrganizedPapers } from './format';

type Paper = CollectionEntry<'papers'>;

export interface SiteData {
  profile: CollectionEntry<'profile'>;
  papers: Paper[];
  organized: OrganizedPapers<Paper>;
  homeList: Paper[];
  hasCv: boolean;
  showTeaching: boolean;
  buildDate: Date;
}

let cached: Promise<SiteData> | undefined;

export function loadSite(): Promise<SiteData> {
  cached ??= load();
  return cached;
}

async function load(): Promise<SiteData> {
  const profile = await getEntry('profile', 'index');
  if (!profile) throw new Error('Missing src/content/profile/index.md');
  const papers = await getCollection('papers');

  const errors = checkSettings(profile.data, papers.map((p) => p.id));
  if (errors.length) throw new Error(`Site settings problem:\n- ${errors.join('\n- ')}`);

  const hasCv = existsSync(join(process.env.SITE_PUBLIC_DIR ?? 'public', 'cv.pdf'));
  if (!hasCv) console.warn('[site] No public/cv.pdf yet, so CV links are hidden.');

  const jmpId = profile.data.jobMarket.paper;
  return {
    profile,
    papers,
    organized: organizePapers(papers, jmpId),
    homeList: homePapers(papers, jmpId),
    hasCv,
    showTeaching: profile.data.showTeaching,
    buildDate: new Date(),
  };
}

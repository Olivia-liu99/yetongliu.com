// Cross-field checks the content schema can't express. Messages are written for
// Yetong: each names the setting to fix and what it should be.
import type { PaperLinks } from './format';

/** A file on this site ("/papers/x.pdf") or a full https:// address — not "//host". */
export const SITE_PATH_OR_HTTPS = /^(\/(?!\/)|https:\/\/)/;

export interface SettingsToCheck {
  jobMarket: { onMarket: boolean; years?: string; paper?: string };
}

export function checkSettings(settings: SettingsToCheck, paperIds: string[]): string[] {
  const { onMarket, years, paper } = settings.jobMarket;
  const errors: string[] = [];
  if (paper && !paperIds.includes(paper)) {
    errors.push(`jobMarket.paper is "${paper}", but there is no file src/content/papers/${paper}.md`);
  }
  if (onMarket && !years) {
    errors.push('jobMarket.onMarket is true, so jobMarket.years is required (for example "2029–2030")');
  }
  return errors;
}

export interface PaperWithLinks {
  id: string;
  data: { links?: PaperLinks };
}

/** Links to files on this site ("/papers/x.pdf") whose file isn't in the public folder. */
export function checkLocalLinks(papers: PaperWithLinks[], fileExists: (sitePath: string) => boolean): string[] {
  const errors: string[] = [];
  for (const { id, data } of papers) {
    const links = data.links ?? {};
    const candidates: [string, string | undefined][] = [
      ['pdf', links.pdf],
      ['slides', links.slides],
      ...(links.other ?? []).map((other): [string, string] => ['other', other.url]),
    ];
    for (const [key, href] of candidates) {
      if (href?.startsWith('/') && !fileExists(href)) {
        errors.push(`papers/${id}.md: links.${key} is "${href}", but there is no file public${href}`);
      }
    }
  }
  return errors;
}

// Pure display helpers. No Astro imports, so they can be unit-tested directly.

export type PaperGroup = 'published' | 'working' | 'in-progress';

export interface PaperLinks {
  pdf?: string;
  ssrn?: string;
  doi?: string;
  published?: string;
  slides?: string;
  data?: string;
  other?: { label: string; url: string }[];
}

export interface PaperLike {
  id: string;
  data: { title: string; group: PaperGroup; order: number; home?: boolean };
}

export interface LinkItem {
  label: string;
  href: string;
}

/** Text to place after the name at `index` in a list of `count` names: "A and B", "A, B, and C". */
export function listSeparator(index: number, count: number): string {
  if (index >= count - 1) return '';
  if (count === 2) return ' and ';
  return index === count - 2 ? ', and ' : ', ';
}

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapes HTML, then turns *text* into <em>text</em> (used for journal names). */
export function inlineEmphasis(text: string): string {
  const escaped = text.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
  return escaped.replace(/\*([^*\s][^*]*?)\*/g, '<em>$1</em>');
}

/** "Innovation, technology diffusion and adoption" — keeps acronyms like "AI" capitalized. */
export function interestsLine(items: string[]): string {
  return items
    .map((item, i) => (i > 0 && /^[A-Z][a-z]/.test(item) ? item[0].toLowerCase() + item.slice(1) : item))
    .join(', ');
}

/** "October 2026", in Toronto time unless told otherwise. */
export function monthYear(date: Date, timeZone = 'America/Toronto'): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone });
}

const LINK_ORDER: [keyof Omit<PaperLinks, 'other'>, string][] = [
  ['pdf', 'PDF'],
  ['ssrn', 'SSRN'],
  ['doi', 'DOI'],
  ['published', 'Published version'],
  ['slides', 'Slides'],
  ['data', 'Replication files'],
];

/** The links shown under a paper, in a fixed order, skipping any that aren't set. */
export function paperLinks(links: PaperLinks | undefined, opts: { pdfLabel?: string } = {}): LinkItem[] {
  if (!links) return [];
  const items: LinkItem[] = [];
  for (const [key, label] of LINK_ORDER) {
    const href = links[key];
    if (href) items.push({ label: key === 'pdf' && opts.pdfLabel ? opts.pdfLabel : label, href });
  }
  for (const { label, url } of links.other ?? []) items.push({ label, href: url });
  return items;
}

function byOrderThenTitle<P extends PaperLike>(a: P, b: P): number {
  return a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);
}

export interface OrganizedPapers<P> {
  jmp?: P;
  published: P[];
  working: P[];
  inProgress: P[];
}

/** Splits papers into their Research-page groups, with the job market paper pulled out on its own. */
export function organizePapers<P extends PaperLike>(papers: P[], jmpId?: string): OrganizedPapers<P> {
  const jmp = jmpId ? papers.find((p) => p.id === jmpId) : undefined;
  const rest = papers.filter((p) => p !== jmp).sort(byOrderThenTitle);
  return {
    jmp,
    published: rest.filter((p) => p.data.group === 'published'),
    working: rest.filter((p) => p.data.group === 'working'),
    inProgress: rest.filter((p) => p.data.group === 'in-progress'),
  };
}

const HOME_GROUP_ORDER: PaperGroup[] = ['working', 'in-progress', 'published'];

/** Papers listed on the Home page: unpublished ones by default, minus the job market paper. */
export function homePapers<P extends PaperLike>(papers: P[], jmpId?: string): P[] {
  return papers
    .filter((p) => p.id !== jmpId && (p.data.home ?? p.data.group !== 'published'))
    .sort((a, b) => HOME_GROUP_ORDER.indexOf(a.data.group) - HOME_GROUP_ORDER.indexOf(b.data.group) || byOrderThenTitle(a, b));
}

/** JSON for a <script type="application/ld+json"> block that can't close the tag early. */
export function jsonLdString(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

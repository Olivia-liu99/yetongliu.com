// Reads the sites that global-setup.ts built into dist-test/.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';

export type Scenario = 'default' | 'market' | 'nocv';

const dir = (s: Scenario) => join('dist-test', s);

/** Everything a scenario's `astro build` printed, including warnings and errors. */
export function buildLog(name: Scenario | 'badlink'): string {
  return readFileSync(join('dist-test', `${name}.log`), 'utf8');
}

export function read(s: Scenario, path: string): string {
  return readFileSync(join(dir(s), path), 'utf8');
}

export function exists(s: Scenario, path: string): boolean {
  return existsSync(join(dir(s), path));
}

export function html(s: Scenario, path: string): HTMLElement {
  return parse(read(s, path));
}

/** Paper titles inside the labeled section with this id. */
export const titles = (d: HTMLElement, id: string) =>
  d.querySelectorAll(`section[aria-labelledby="${id}"] h3`).map((h) => h.text.trim());

/** The small-caps section labels, in page order. */
export const labels = (d: HTMLElement) => d.querySelectorAll('h2.row-label').map((h) => h.text.trim());

export function allHtml(s: Scenario): { path: string; root: HTMLElement }[] {
  return (readdirSync(dir(s), { recursive: true }) as string[])
    .filter((file) => file.endsWith('.html'))
    .map((path) => ({ path, root: html(s, path) }));
}

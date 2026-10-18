// Reads the sites that global-setup.ts built into dist-test/.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';

export type Scenario = 'default' | 'market';

const dir = (s: Scenario) => join('dist-test', s);

export function read(s: Scenario, path: string): string {
  return readFileSync(join(dir(s), path), 'utf8');
}

export function exists(s: Scenario, path: string): boolean {
  return existsSync(join(dir(s), path));
}

export function html(s: Scenario, path: string): HTMLElement {
  return parse(read(s, path));
}

export function allHtml(s: Scenario): { path: string; root: HTMLElement }[] {
  return (readdirSync(dir(s), { recursive: true }) as string[])
    .filter((file) => file.endsWith('.html'))
    .map((path) => ({ path, root: html(s, path) }));
}

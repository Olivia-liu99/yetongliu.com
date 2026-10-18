import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('deploys queue instead of failing when two changes are pushed close together', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  expect(workflow).toMatch(/^concurrency:\n {2}group: pages\n {2}cancel-in-progress: false$/m);
});

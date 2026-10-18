// Cross-field checks the content schema can't express. Messages are written for
// Yetong: each names the setting to fix and what it should be.

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

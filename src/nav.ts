import type { NavigationDestination } from '@kyralabs/m3e-react';

/** Primary destinations: text buttons in the top app bar (expanded), the navigation bar below. */
export interface NavLink extends NavigationDestination {
  href: string;
  /** "Get notified": the filled button in the top app bar. */
  isPrimary?: boolean;
}

const link = (key: string, label: string, icon: string, prefix: string): NavLink => ({
  key,
  label,
  icon,
  href: `${prefix}#${key}`,
});

const destinations = (prefix: string): NavLink[] => [
  link('features', 'Features', 'apps', prefix),
  link('built-by', 'About', 'info', prefix),
  { ...link('waitlist', 'Get notified', 'notifications', prefix), isPrimary: true },
];

export const homeNav = destinations('');
export const privacyNav = destinations('/');

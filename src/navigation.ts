import { createNavigation } from 'next-intl/navigation';

export const locales = ['es', 'en', 'fr'] as const;
export const localePrefix = 'always'; // Default

export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation({ locales, localePrefix });

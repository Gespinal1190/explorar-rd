'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <div className="relative">
            <select
                defaultValue={locale}
                disabled={isPending}
                onChange={onSelectChange}
                className="appearance-none bg-transparent py-1 px-2 pr-6 rounded-lg text-sm font-bold text-gray-600 hover:text-primary cursor-pointer focus:outline-none"
            >
                <option value="es">ES</option>
                <option value="en">EN</option>
                <option value="fr">FR</option>
            </select>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-500">
                ▼
            </div>
        </div>
    );
}

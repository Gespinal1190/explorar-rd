'use client';

import { updateUserProfile } from '@/lib/actions';
import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

export default function ProfileEditForm({ user }: { user: any }) {
    const t = useTranslations("UserDashboard");
    const [message, formAction, isPending] = useActionState(async (prev: any, formData: FormData) => {
        return await updateUserProfile(prev, formData);
    }, null);

    return (
        <form action={formAction} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t('name')}</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={user.name || ''}
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t('email')}</label>
                    <input
                        type="email"
                        name="email"
                        defaultValue={user.email}
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t('phone')}</label>
                    <input
                        type="tel"
                        name="phone"
                        defaultValue={user.phone || ''}
                        placeholder={t('phonePlaceholder')}
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t('newPassword')}</label>
                    <input
                        type="password"
                        name="password"
                        placeholder={t('newPasswordPlaceholder')}
                        className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            {message && <div className="text-sm font-medium text-green-600">{message.message}</div>}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                >
                    {isPending ? t('saving') : t('saveChanges')}
                </button>
            </div>
        </form>
    );
}


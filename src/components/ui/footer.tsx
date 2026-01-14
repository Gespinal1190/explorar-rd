import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div>
                        <div className="mb-6">
                            <img src="/logo-footer.png" alt="DescubreRD" className="h-16 w-auto" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            <strong>DescubreRD</strong>: {t('description')} - Tu plataforma líder para encontrar los mejores <strong>tours y excursiones en República Dominicana</strong>.
                        </p>

                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/descubrerd.app" rel="me" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a href="https://www.facebook.com/descubrerd.app" rel="me" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                            <a href="https://www.youtube.com/@descubrerd" rel="me" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300" aria-label="YouTube">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">{t('explore')}</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white">{t('home')}</Link></li>
                            <li><Link href="/destinos" className="hover:text-white">{t('destinations')}</Link></li>
                            <li><Link href="/blog" className="hover:text-white">{t('blog')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">{t('legal')}</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/legal/terms" className="hover:text-white">{t('terms')}</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-white">{t('privacy')}</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-white">{t('cookies')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">{t('contact')}</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>info@descubrerd.app</li>
                            <li>{t('address')}</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} DescubreRD. {t('rights')}
                </div>
            </div>
        </footer>
    );
}

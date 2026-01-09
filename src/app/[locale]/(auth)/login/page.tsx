

import LoginForm from "@/components/ui/login-form";
import { Link } from "@/navigation";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const t = useTranslations('Login');

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop" // High quality DR beach image
                    alt="Dominican Republic Beach"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <h2 className="text-4xl font-black mb-4 tracking-tighter">{t('discoverParadise')}</h2>
                    <p className="text-lg opacity-90 max-w-md">{t('leadingPlatform')}</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-[450px]">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-6">
                            <Logo className="h-20 w-auto mx-auto" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('welcomeBack')}</h1>
                        <p className="text-gray-500">{t('enterCredentials')}</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
                        <button className="flex-1 py-3 text-sm font-bold text-gray-900 bg-white shadow-sm rounded-xl transition-all">
                            {t('login')}
                        </button>
                        <Link href="/register" className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all text-center flex items-center justify-center">
                            {t('register')}
                        </Link>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

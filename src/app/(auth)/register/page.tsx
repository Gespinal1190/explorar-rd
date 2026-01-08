import RegisterForm from "@/components/ui/register-form";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";

export default async function RegisterPage(props: {
    searchParams: Promise<{ role?: string }>;
}) {
    const searchParams = await props.searchParams;
    const role = searchParams.role || 'USER';
    const isAgency = role === 'AGENCY';
    const googleEnabled = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900">
                <Image
                    src="https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=2026&auto=format&fit=crop" // Reliable DR/Tropical Image
                    alt="Dominican Republic Paradise"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <h2 className="text-4xl font-black mb-6 tracking-tighter leading-tight">
                        {isAgency ? (
                            <>
                                Lleva tu agencia al <br />
                                <span className="text-primary">siguiente nivel.</span>
                            </>
                        ) : (
                            <>
                                Vive aventuras que <br />
                                <span className="text-primary">nunca olvidarás.</span>
                            </>
                        )}
                    </h2>

                    <div className="space-y-4">
                        {isAgency ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg">📈</span>
                                    <p className="font-medium text-sm">Incrementa tus reservas en un 40%.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg">⚡</span>
                                    <p className="font-medium text-sm">Gestión digital automatizada.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg">🤝</span>
                                    <p className="font-medium text-sm">Conecta con miles de turistas.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg">🗺️</span>
                                    <p className="font-medium text-sm">Descubre destinos ocultos y exclusivos.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg">🔖</span>
                                    <p className="font-medium text-sm">Guarda tus favoritos y planifica.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/20 p-2 rounded-lg">🎁</span>
                                    <p className="font-medium text-sm">Accede a ofertas especiales.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-[450px]">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-6">
                            <Logo className="h-12 w-auto mx-auto" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {isAgency ? 'Registra tu empresa' : 'Crea tu cuenta'}
                        </h1>
                        <p className="text-gray-500">Únete a nuestra comunidad hoy mismo.</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
                        <Link href="/login" className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all text-center flex items-center justify-center">
                            Iniciar Sesión
                        </Link>
                        <button className="flex-1 py-3 text-sm font-bold text-gray-900 bg-white shadow-sm rounded-xl transition-all">
                            Registrarse
                        </button>
                    </div>

                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}

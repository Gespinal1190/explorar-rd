"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { registerAction } from "@/lib/auth-actions";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AgencyRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
        description: "",
        website: "",
        rnc: "",
        logo: "",
        licenseUrl: "",
        premisesUrl: "",
        acceptTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (!formData.acceptTerms) {
            setError("Debes aceptar los términos y condiciones");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // 1. Create User in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Register Agency in Database
            // Note: Currently registerAction only takes basic info. 
            // We might need to update the profile later or expand registerAction.
            // For now, we register the user and profile with basic info.
            const res = await registerAction(user.uid, formData.email, formData.name, "AGENCY", formData);

            if (res?.error) {
                setError(res.error);
                return;
            }

            // Ideally we would update the Agency Profile with the extra info here
            // but for this MVP restoration, getting the user created is key.
            // We can add an onboarding step later or a profile update call.

            router.push("/dashboard/agency");
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Este correo ya está registrado");
            } else {
                setError("Error al registrar la agencia: " + err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Hero Image & Info */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 text-white overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1932&auto=format&fit=crop"
                    alt="Agency Background"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-900/90 mix-blend-multiply" />

                <div className="relative z-10 p-16 flex flex-col justify-between h-full">
                    <div>
                        <Link href="/" className="inline-block">
                            <span className="text-4xl font-black tracking-tighter text-white">
                                Descubre<span className="text-teal-300">RD</span>
                            </span>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-black leading-tight">
                            Potencia tu Agencia de Turismo al siguiente nivel.
                        </h1>
                        <p className="text-xl text-gray-200">
                            Únete a la plataforma líder de turismo en República Dominicana.
                            Gestiona tus tours, recibe reservas en tiempo real y conecta con miles de viajeros.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-8">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <span className="text-3xl mb-2 block">🌍</span>
                                <h3 className="font-bold">Alcance Global</h3>
                                <p className="text-sm text-gray-300">Llega a turistas de todo el mundo.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <span className="text-3xl mb-2 block">⚡</span>
                                <h3 className="font-bold">Gestión Simple</h3>
                                <p className="text-sm text-gray-300">Panel de control intuitivo y potente.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-400">
                        © 2024 DescubreRD. Todos los derechos reservados.
                    </div>
                </div>
            </div>

            {/* Right Side - Multi-step Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-20 bg-white overflow-y-auto">
                <div className="max-w-md w-full mx-auto space-y-8">
                    <div className="lg:hidden text-center">
                        <Link href="/" className="inline-block">
                            <span className="text-3xl font-black tracking-tighter text-gray-900">
                                Descubre<span className="text-primary">RD</span>
                            </span>
                        </Link>
                    </div>

                    <div>
                        <h2 className="text-3xl font-black text-gray-900">
                            Registro de Agencia
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Completa el formulario para validar tu empresa.
                        </p>
                    </div>

                    {/* Steps Indicator */}
                    <div className="flex items-center space-x-4 mb-8">
                        <div className={`h-2 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
                        <div className={`h-2 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-gray-900">Datos de la Empresa</h3>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Comercial</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary border-2 transition-all font-medium"
                                        placeholder="Ej. Punta Cana Adventures"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">RNC (Registro Nacional de Contribuyentes)</label>
                                    <input
                                        name="rnc"
                                        type="text"
                                        required
                                        value={formData.rnc}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary border-2 transition-all font-medium"
                                        placeholder="Ej. 1-01-00000-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Descripción Corta</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary border-2 transition-all font-medium"
                                        placeholder="¿Qué hace especial a tu agencia?"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-gray-900">Contacto y Ubicación</h3>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono / WhatsApp</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary border-2 transition-all font-medium"
                                        placeholder="+1 (809) 000-0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Dirección Física</label>
                                    <input
                                        name="address"
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary border-2 transition-all font-medium"
                                        placeholder="Calle Principal #123, Ciudad"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Sitio Web (Opcional)</label>
                                    <input
                                        name="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary border-2 transition-all font-medium"
                                        placeholder="https://tuagencia.com"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-gray-900">Credenciales de Acceso</h3>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico Corporativo</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary border-2 transition-all font-medium"
                                        placeholder="contacto@tuagencia.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary border-2 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Confirmar Contraseña</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary border-2 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="acceptTerms"
                                            name="acceptTerms"
                                            type="checkbox"
                                            required
                                            checked={formData.acceptTerms}
                                            onChange={handleChange}
                                            className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                                            Acepto los <Link href="/terms" className="text-primary hover:underline">Términos y Condiciones</Link> y la <Link href="/privacy" className="text-primary hover:underline">Política de Privacidad</Link>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Atrás
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 py-4 px-6 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                                >
                                    Siguiente
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-4 px-6 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:opacity-90 transition-all shadow-emerald-500/30 disabled:opacity-50"
                                >
                                    {isLoading ? 'Creando Cuenta...' : 'Finalizar Registro'}
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            ¿Ya tienes una cuenta de partner? <Link href="/login" className="text-primary font-bold hover:underline">Inicia Sesión</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { register } from "@/lib/actions"; // We'll reuse but might need client-side handling for steps

export default function AgencyRegisterWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        description: "",
        instagram: "",
        website: "",
        logo: "",
        rnc: "",
        licenseUrl: "",
        premisesUrl: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Construct FormData for the server action
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("role", "AGENCY");

        // Agency Profile Data
        data.append("phone", formData.phone);
        data.append("description", formData.description);
        data.append("instagram", formData.instagram);
        data.append("website", formData.website);
        data.append("logo", formData.logo);
        data.append("rnc", formData.rnc);
        data.append("licenseUrl", formData.licenseUrl);
        data.append("premisesUrl", formData.premisesUrl);

        try {
            await register(undefined, data);
            // Ideally we'd sign in and update profile immediately, but for MPV:
            alert("¡Registro Completado! Por favor inicia sesión para terminar de configurar tu perfil.");
            window.location.href = "/login";
        } catch (error) {
            alert("Error al registrar");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBF8] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">

                {/* Visual Sidebar */}
                <div className="bg-gray-900 md:w-1/3 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                    <div className="relative z-10">
                        <Link href="/" className="text-2xl font-black tracking-tight">
                            Descubre<span className="text-primary">RD</span>
                        </Link>
                        <div className="mt-12 space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`flex items-center gap-4 ${step === i ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === i ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}>
                                        {i}
                                    </div>
                                    <span className="font-medium text-sm">
                                        {i === 1 && "Cuenta"}
                                        {i === 2 && "Detalles"}
                                        {i === 3 && "Verificación"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 md:w-2/3">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registra tu Agencia</h2>
                    <p className="text-gray-500 text-sm mb-8">Únete a la plataforma líder de turismo interno.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Nombre de la Agencia</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Ej. Viajes Exóticos RD" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Correo Corporativo</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="contacto@agencia.com" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Contraseña</label>
                                    <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="******" />
                                </div>
                                <button type="button" onClick={handleNext} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors">
                                    Siguiente Paso →
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Teléfono / WhatsApp</label>
                                        <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="809-555-5555" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Instagram (Opcional)</label>
                                        <input name="instagram" value={formData.instagram} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="@tuagencia" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Sitio Web (Opcional)</label>
                                    <input name="website" value={formData.website} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="https://www.tuagencia.com" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Logo de la Agencia</label>
                                    <div className="mt-1 flex items-center gap-4">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="w-full p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors text-center text-gray-500 text-sm">
                                                {formData.logo ? 'Archivo seleccionado' : 'Click para subir logo'}
                                            </div>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // In a real app, upload here. For now, use a fake URL or object URL
                                                    setFormData({ ...formData, logo: `https://fake-storage.com/${file.name}` })
                                                }
                                            }} />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Descripción</label>
                                    <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all h-24" placeholder="Breve descripción de tu agencia..." />
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={handleBack} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                                        Atrás
                                    </button>
                                    <button type="button" onClick={handleNext} className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors">
                                        Siguiente →
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4">
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-800 text-sm">
                                    <p className="font-bold mb-2">⚠️ Verificación Requerida</p>
                                    <p>Para verificar tu agencia, necesitamos al menos el RNC o Registro Mercantil.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">RNC o Registro Mercantil</label>
                                        <input required name="rnc" value={formData.rnc} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Documento de registro" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Licencia de Operador (Si aplica)</label>
                                        <input name="licenseUrl" value={formData.licenseUrl} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border-transparent focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="URL o Número de licencia" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Foto del Local o Equipo (Opcional)</label>
                                        <div className="mt-1">
                                            <label className="cursor-pointer block">
                                                <div className="w-full p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-primary">
                                                    <span className="text-2xl mb-2">📷</span>
                                                    <span className="text-sm font-medium">{formData.premisesUrl ? 'Foto seleccionada' : 'Subir foto del local'}</span>
                                                </div>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setFormData({ ...formData, premisesUrl: `https://fake-storage.com/${file.name}` })
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="checkbox" required className="mt-1" />
                                    <span className="text-sm text-gray-600">Acepto los <a href="#" className="underline text-primary">términos y condiciones para agencias</a> y confirmo que la información es verídica.</span>
                                </label>

                                <div className="flex gap-3">
                                    <button type="button" onClick={handleBack} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                                        Atrás
                                    </button>
                                    <button type="submit" disabled={isLoading} className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                                        {isLoading ? 'Creando cuenta...' : 'Finalizar Registro'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

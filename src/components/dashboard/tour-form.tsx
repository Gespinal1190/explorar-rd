'use client';

import { useActionState, useState, ChangeEvent, useRef, useEffect } from 'react';
import { createTour, updateTour } from '@/lib/actions';

interface TourFormProps {
    initialData?: {
        id: string;
        title: string;
        description: string;
        location: string;
        price: number;
        currency: string;
        duration: string | null;
        address?: string | null;
        requirements?: string | null;
        includes: string | null; // JSON String or string
        latitude?: number | null;
        longitude?: number | null;
        instagramUrl?: string | null;
        images?: { url: string }[];
        dates?: { date: Date | string }[]; // Updated type
    };
    isEditing?: boolean;
}

export default function TourForm({ initialData, isEditing = false }: TourFormProps) {
    // Choose action based on mode. Bind ID if editing.
    // Note: useActionState expects a function (state, payload) => state.
    // updateTour handles formData differently, but useActionState usually wraps it.
    // We'll stick to simple logic: pass the action reference.

    const action = isEditing ? updateTour : createTour;

    const [errorMessage, formAction, isPending] = useActionState(
        action,
        undefined
    );

    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial State load
    useEffect(() => {
        if (initialData?.images && initialData.images.length > 0) {
            setPreviews(initialData.images.map(img => img.url));
        }
        if (initialData?.dates && initialData.dates.length > 0) {
            // Convert dates to YYYY-MM-DD string for consistency with date input
            setSelectedDates(initialData.dates.map(d => new Date(d.date).toISOString().split('T')[0]));
        }
    }, [initialData]);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreviews(prev => [...prev, base64]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Helper to extract includes (parse JSON if needed)
    const getIncludesValue = () => {
        if (!initialData?.includes) return '';
        try {
            const parsed = JSON.parse(initialData.includes);
            if (Array.isArray(parsed)) return parsed.join(', ');
            return initialData.includes;
        } catch {
            return initialData.includes;
        }
    };

    return (
        <form action={formAction} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                {isEditing ? 'Editar Excursión' : 'Crear Nueva Excursión'}
            </h1>

            {isEditing && (
                <input type="hidden" name="id" value={initialData?.id} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="title">
                        Título de la Excursión
                    </label>
                    <input
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Ej. Salto del Limón VIP"
                        required
                        minLength={5}
                        defaultValue={initialData?.title}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="description">
                        Descripción Detallada
                    </label>
                    <textarea
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all h-32"
                        id="description"
                        name="description"
                        placeholder="Describe la experiencia, el itinerario y lo que la hace única..."
                        required
                        minLength={20}
                        defaultValue={initialData?.description}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="location">
                        Ubicación / Zona
                    </label>
                    <input
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        id="location"
                        type="text"
                        name="location"
                        list="location-options"
                        placeholder="Escribe o selecciona una zona..."
                        required
                        defaultValue={initialData?.location}
                    />
                    <datalist id="location-options">
                        <option value="Punta Cana" />
                        <option value="Samaná" />
                        <option value="Santo Domingo" />
                        <option value="Jarabacoa" />
                        <option value="Puerto Plata" />
                        <option value="Barahona" />
                        <option value="Monte Cristi" />
                        <option value="La Romana" />
                        <option value="Constanza" />
                        <option value="Bayahibe" />
                    </datalist>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="currency">
                            Moneda
                        </label>
                        <select
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
                            id="currency"
                            name="currency"
                            required
                            defaultValue={initialData?.currency || "DOP"}
                        >
                            <option value="DOP">RD$ (Peso)</option>
                            <option value="USD">USD (Dólar)</option>
                            <option value="EUR">EUR (Euro)</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="price">
                            Precio por Persona
                        </label>
                        <input
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            id="price"
                            type="number"
                            name="price"
                            placeholder="0.00"
                            min={1}
                            required
                            defaultValue={initialData?.price}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="duration">
                        Duración (Ej. 4 horas, Todo el día)
                    </label>
                    <input
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        id="duration"
                        type="text"
                        name="duration"
                        placeholder="Ej. 8 horas"
                        defaultValue={initialData?.duration || ""}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="includes">
                        Incluye (Separado por comas)
                    </label>
                    <input
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        id="includes"
                        type="text"
                        name="includes"
                        placeholder="Almuerzo, Transporte, Bebidas"
                        defaultValue={getIncludesValue()}
                    />
                </div>

                {/* New Fields */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Dirección Exacta / Punto de Encuentro (Google Maps)</label>
                    <input
                        name="address"
                        type="text"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Ej. Sendero Rancho Español - Salto El Limón, 32000, República Dominicana"
                        defaultValue={initialData?.address || initialData?.requirements || ""}
                    />
                    <p className="text-xs text-gray-400 mt-1">Copia y pega la dirección exacta o el lugar de encuentro.</p>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Instagram Link (Post/Reel)</label>
                    <input name="instagramUrl" type="url" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="https://instagram.com/p/..." defaultValue={initialData?.instagramUrl || ""} />
                </div>

                {/* Image Upload Carousel */}
                <div className="md:col-span-2 space-y-4">
                    <label className="block text-sm font-bold text-gray-700">Imágenes de la Excursión</label>

                    {/* Hidden input to store Base64 strings for the server action */}
                    <input type="hidden" name="imageUrls" value={previews.join('\n')} />

                    {previews.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                            {previews.map((src, idx) => (
                                <div key={idx} className="relative flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden border snap-center group">
                                    <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-gray-500 hover:text-primary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <span className="font-medium">Haz clic para subir imágenes</span>
                        <span className="text-xs mt-1">Soporta JPG, PNG, WEBP</span>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>

                {/* Available Dates Section */}
                <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                    <label className="block text-sm font-bold text-gray-700">Fechas Disponibles del Tour</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="date"
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            id="date-picker-input"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const input = document.getElementById('date-picker-input') as HTMLInputElement;
                                if (input.value) {
                                    if (!selectedDates.includes(input.value)) {
                                        setSelectedDates([...selectedDates, input.value].sort());
                                    }
                                    input.value = '';
                                }
                            }}
                            className="px-4 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors"
                        >
                            + Agregar Fecha
                        </button>
                    </div>

                    {/* Hidden input for server submission */}
                    <input type="hidden" name="availableDates" value={JSON.stringify(selectedDates)} />

                    {selectedDates.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedDates.map((date) => (
                                <span key={date} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-primary/10 text-primary border border-primary/20">
                                    {new Date(date).toLocaleDateString()}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDates(selectedDates.filter(d => d !== date))}
                                        className="hover:text-red-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic">No has seleccionado fechas. Si no seleccionas ninguna, el tour podría no estar disponible para reservar.</p>
                    )}
                </div>
            </div>

            <div className="pt-4">
                {errorMessage && (
                    <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">{errorMessage}</p>
                )}

                <div className="flex gap-4">
                    <a href="/dashboard/agency/tours" className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors text-center w-full md:w-auto">
                        Cancelar
                    </a>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50"
                    >
                        {isPending ? 'Guardando...' : (isEditing ? 'Actualizar Tour' : 'Publicar Tour')}
                    </button>
                </div>
            </div>
        </form>
    );
}

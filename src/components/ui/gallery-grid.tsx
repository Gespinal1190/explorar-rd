"use client";

import { useState } from "react";

interface GalleryProps {
    images: { id: string; url: string }[];
    title: string;
}

export function GalleryGrid({ images, title }: GalleryProps) {
    // If no images, return fallback
    if (!images || images.length === 0) return null;

    // Use state to track the active image index for the "Carousel" effect details
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const mainImage = images[currentImageIndex];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Full-Width Image */}
            <div className="relative w-full h-[60vh] md:h-[70vh] rounded-[2rem] overflow-hidden shadow-2xl group">
                {/* Navigation Buttons (Desktop Hover) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </>
                )}

                <img
                    src={mainImage.url}
                    alt={title}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-700"
                    onClick={() => setIsLightboxOpen(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Image Counter */}
                <div className="absolute bottom-6 right-6 bg-black/50 text-white px-4 py-1 rounded-full text-sm font-bold backdrop-blur-md border border-white/10">
                    {currentImageIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnail Carousel (Horizontal Scroll) */}
            {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x px-2 no-scrollbar">
                    {images.map((img, idx) => (
                        <div
                            key={img.id}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${currentImageIndex === idx ? 'ring-4 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                        >
                            <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

            {/* Fullscreen Lightbox */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center backdrop-blur-xl animate-in fade-in duration-300">
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Lightbox Navigation */}
                    <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <img
                        src={images[currentImageIndex].url}
                        alt="Full Screen"
                        className="max-w-[95vw] max-h-[90vh] object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

import Image from "next/image";

export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
    // Extract height from className or default to 32px (h-8)
    // This is a naive approximation to keep existing class usage working with Next/Image 'height' prop needing a number if not 'fill'
    // However, for simplicity and to respect 'h-8 w-auto' CSS behavior, we can use a relative wrapper or standard img tag if strict aspect ratio is known.
    // Given the variability, using a standard <img> tag or carefully styled Next/Image is best.
    // Let's use standard img for direct control via className which often contains 'h-x w-auto'.
    // Next/Image with 'fill' requires parent container constraint.

    return (
        <div className={`relative ${className} flex items-center`}>
            <Image
                src="/logo.png"
                alt="DescubreRD Logo"
                width={200} // Aspect ratio based on likely dimensions
                height={40}
                className="w-full h-full object-contain"
                priority
            />
        </div>
    );
}

export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 40"
            className={className}
            fill="none"
            aria-label="DescubreRD Logo"
        >
            <text
                x="0"
                y="30"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="800"
                fontSize="28"
                fill="currentColor" // Adapts to parent text color
                className="tracking-tighter"
            >
                Descubre
            </text>
            <text
                x="132"
                y="30"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="800"
                fontSize="28"
                fill="#14B8A6" // Teal/Primary
                className="tracking-tighter"
            >
                RD
            </text>
            {/* Optional stylistic underline or accent if needed, keeping it clean for now matching the text logo style */}
        </svg>
    );
}

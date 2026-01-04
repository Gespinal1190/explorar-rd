"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/ui/map-component"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-3xl" />
});

export { MapComponent as ClientMap };

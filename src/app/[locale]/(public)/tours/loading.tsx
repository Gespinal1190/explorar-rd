
import { Logo } from "@/components/ui/logo";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#FBFBF8]">
            {/* 1. Navbar Skeleton - Faithful Replica */}
            <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Logo Placeholder */}
                    <div className="flex items-center gap-2">
                        <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse" />
                    </div>

                    {/* Center Links Placeholder (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-10">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>

                    {/* Right Actions Placeholder */}
                    <div className="flex items-center space-x-4">
                        <div className="h-10 w-24 bg-gray-100 rounded-xl animate-pulse hidden md:block" />
                        <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse hidden md:block" />
                        {/* Mobile Menu Button */}
                        <div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse md:hidden" />
                    </div>
                </div>
            </nav>

            {/* 2. Header Section - Exact Spacing */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="max-w-4xl">
                        {/* Title H1 */}
                        <div className="h-10 md:h-14 w-3/4 bg-gray-200 rounded-xl animate-pulse mb-3 md:mb-5" />

                        {/* Description P */}
                        <div className="h-6 w-1/2 bg-gray-100 rounded-lg animate-pulse mb-8 md:mb-10" />

                        {/* Chips / Filter Pills */}
                        <div className="flex gap-2.5 overflow-x-hidden pb-4">
                            <div className="h-9 w-24 bg-gray-200 rounded-xl animate-pulse shrink-0" /> {/* Active one */}
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-9 w-24 bg-gray-50 rounded-xl animate-pulse shrink-0 border border-gray-100" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Layout */}
            <div className="container mx-auto px-4 py-8 md:py-12 mt-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters - Exact Width */}
                    <aside className="w-full lg:w-64 shrink-0 space-y-8 hidden lg:block">
                        {/* Filter Group 1 */}
                        <div>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full border border-gray-200 bg-gray-50 animate-pulse" />
                                        <div className="h-4 w-32 bg-gray-50 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Filter Group 2 */}
                        <div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded border border-gray-200 bg-gray-50 animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-50 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Help Box */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-3 w-full bg-gray-100 rounded animate-pulse mb-4" />
                            <div className="h-8 w-full bg-gray-200 rounded-lg animate-pulse" />
                        </div>
                    </aside>

                    {/* Tours Grid */}
                    <div className="flex-1 space-y-12">
                        {/* Featured Section Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                        </div>

                        {/* Grid - Exact Match to TourCard Dimensions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden h-[480px] flex flex-col shadow-sm">
                                    {/* Image Area */}
                                    <div className="relative h-48 md:h-64 bg-gray-200 animate-pulse">
                                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/50" />
                                        <div className="absolute top-4 left-4 w-20 h-6 rounded-lg bg-white/50" />
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        {/* Agency Info */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                                            <div className="space-y-1">
                                                <div className="h-2 w-20 bg-gray-100 rounded animate-pulse" />
                                                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div className="h-6 w-full bg-gray-100 rounded animate-pulse mb-2" />
                                        <div className="h-6 w-2/3 bg-gray-100 rounded animate-pulse mb-4" />

                                        {/* Specs */}
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <div className="h-8 bg-gray-50 rounded-lg animate-pulse" />
                                            <div className="h-8 bg-gray-50 rounded-lg animate-pulse" />
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="h-2 w-12 bg-gray-100 rounded animate-pulse" />
                                                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                                            </div>
                                            <div className="h-10 w-28 bg-gray-800 rounded-xl animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import Link from 'next/link';

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
                            <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
                            <nav className="space-y-2">
                                <LegalLink href="/legal/terms">Términos y Condiciones</LegalLink>
                                <LegalLink href="/legal/privacy">Política de Privacidad</LegalLink>
                                <LegalLink href="/legal/cookies">Política de Cookies</LegalLink>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 lg:p-12 prose prose-gray max-w-none">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
        >
            {children}
        </Link>
    );
}

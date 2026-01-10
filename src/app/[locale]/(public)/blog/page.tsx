import { Link } from "@/navigation";
import { blogPosts } from "@/components/blog/blog-data";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog de Viajes República Dominicana | Consejos y Guías | DescubreRD',
    description: 'Descubre los mejores consejos de viaje, guías de seguridad, gastronomía y joyas ocultas de República Dominicana en el blog oficial de DescubreRD.',
    keywords: ['blog viajes republica dominicana', 'consejos turismo rd', 'seguridad punta cana', 'mejores playas rd', 'turismo interno'],
};

export default function BlogIndexPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-16 text-center">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4">
                        EXPLORA NUESTRO BLOG
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        Historias y Consejos <br /> del <span className="text-primary">Paraíso</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Todo lo que necesitas saber para planificar tu próxima aventura en República Dominicana.
                        Guías escritas por locales y expertos.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                                    {post.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">
                                    <span>{post.date}</span>
                                    <span>•</span>
                                    <span>{post.readTime} lectura</span>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center gap-3 pt-6 border-t border-gray-50">
                                    <img
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="text-xs">
                                        <p className="font-bold text-gray-900">{post.author.name}</p>
                                        <p className="text-gray-400">{post.author.role}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

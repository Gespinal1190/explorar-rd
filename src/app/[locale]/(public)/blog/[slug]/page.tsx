import { blogPosts } from "@/components/blog/blog-data";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { Metadata } from 'next';

// Generate static params for all blog posts
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: 'Artículo no encontrado',
        };
    }

    return {
        title: `${post.title} | Blog DescubreRD`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-white pb-20 pt-24">
            {/* Hero Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                    <div className="container mx-auto px-4 pb-16">
                        <div className="max-w-4xl mx-auto text-white">
                            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
                                ← Volver al Blog
                            </Link>
                            <span className="block text-primary-400 font-bold tracking-wider text-sm mb-4 uppercase">
                                {post.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-6 text-sm font-medium text-white/90">
                                <div className="flex items-center gap-2">
                                    <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border-2 border-white/20" />
                                    <div>
                                        <p className="text-white">{post.author.name}</p>
                                        <p className="text-white/60 text-xs">{post.author.role}</p>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-white/20"></div>
                                <div>
                                    <p>{post.date}</p>
                                    <p className="text-white/60 text-xs">{post.readTime} de lectura</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Article Body */}
                    <div
                        className="prose prose-lg prose-gray max-w-none 
                        prose-headings:font-bold prose-headings:text-gray-900 
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-3xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Share / CTA Footer */}
                    <div className="mt-16 pt-10 border-t border-gray-100">
                        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                ¿Te inspiró este artículo?
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                                No dejes que se quede en un sueño. Encuentra las mejores agencias y guías locales para vivir esta experiencia.
                            </p>
                            <Link
                                href="/tours"
                                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
                            >
                                Explorar Tours Ahora
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

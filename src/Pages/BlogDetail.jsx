import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import logoImage from '../assets/edem_logo.png';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Calendar, User, Tag } from 'lucide-react';

const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const getImageUrl = (path, failedIds, postId) => {
    if (!path || failedIds.has(postId)) return logoImage;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${backendUrl}/${path.replace(/^\//, '')}`;
};

const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

const BlogDetail = () => {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [failedImages, setFailedImages] = useState(new Set());

    const handleImageError = (e, post) => {
        if (!e.target.dataset.retried) {
            e.target.dataset.retried = 'true';
            e.target.src = `${e.target.src.split('?')[0]}?t=${Date.now()}`;
            return;
        }
        setFailedImages(prev => new Set(prev).add(post._id));
        e.target.src = logoImage;
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/blog/${id}`);
                if (!data?.data) throw new Error('Post not found');
                const post = data.data;
                setBlogPost(post);

                const { data: all } = await axios.get(`${backendUrl}/api/blog`);
                const posts = Array.isArray(all?.data) ? all.data : [];
                const related = posts
                    .filter(p => p.published && p._id !== id && (p.category === post.category || !post.category))
                    .sort((a, b) => b.index - a.index || new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);
                setRelatedPosts(related);
            } catch (err) {
                setError(err.response?.data?.error || err.message || 'Failed to load post');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg width="220" height="180" viewBox="0 0 500 340" style={{ display: 'block', margin: '0 auto' }}>
                        <style>{`
                                @keyframes draw { to { stroke-dashoffset: 0; } }
                                @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                                @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: .7; } }
                                .ea-spiral { stroke-dasharray: 900; stroke-dashoffset: 900; animation: draw 2s cubic-bezier(.4,0,.2,1) forwards; }
                                .ea-dot { animation: pulse 1.4s ease-in-out infinite 2s; transform-origin: 257px 175px; }
                                .ea-letter { opacity: 0; }
                                .ea-letter-e { animation: fadeUp .5s ease .3s forwards; }
                                .ea-letter-a { animation: fadeUp .5s ease .5s forwards; }
                                .ea-name { opacity: 0; animation: fadeUp .6s ease .9s forwards; }
                            `}</style>
                        <path
                            className="ea-spiral"
                            d="M 160,245 C 120,245 95,215 95,180 C 95,130 135,100 185,100 C 250,100 295,148 295,200 C 295,255 250,295 195,295 C 130,295 80,250 80,185 C 80,125 128,80 195,80 C 270,80 340,128 345,185 C 352,255 310,310 240,320"
                            fill="none"
                            stroke="#F5A623"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <circle className="ea-dot" cx="257" cy="175" r="5" fill="#F5A623" />
                        <text className="ea-letter ea-letter-e" x="150" y="240" fontFamily="Georgia, 'Times New Roman', serif" fontSize="160" fontWeight="700" fill="#7B3B0A">E</text>
                        <text className="ea-letter ea-letter-a" x="240" y="240" fontFamily="Georgia, 'Times New Roman', serif" fontSize="160" fontWeight="700" fill="#F5A623">A</text>
                        <text className="ea-name" x="250" y="298" fontFamily="Georgia, 'Times New Roman', serif" fontSize="16" fontWeight="400" letterSpacing="6" fill="#7B3B0A" textAnchor="middle">EDEM  AMET</text>
                    </svg>
                </motion.div>
            </div>
        );
    }



    if (error || !blogPost) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-sm w-full p-8 bg-white rounded-2xl shadow-lg border border-[#F5A623]/30">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Article Unavailable</h2>
                    <p className="text-gray-500 text-sm mb-5">{error || 'Post not found.'}</p>
                    <Link to="/blog" className="inline-block px-5 py-2 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white rounded-xl text-sm font-medium shadow-md hover:opacity-90 transition-opacity">
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const paragraphs = blogPost.content?.split('\n').filter(p => p.trim()) || [];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="w-full min-h-screen pt-24 pb-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Nav */}
                <Link to="/blog" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group inline-flex items-center gap-2 text-sm text-[#7B3B0A] hover:text-[#F5A623] mb-8 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </Link>

                {/* Article Header */}
                <header className="mb-8">
                    {blogPost.category && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#7B3B0A]/10 to-[#F5A623]/10 text-[#7B3B0A] border border-[#F5A623]/30 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
                            <Tag className="w-3 h-3" /> {blogPost.category}
                        </span>
                    )}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7B3B0A] leading-tight mb-4">
                        {blogPost.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {blogPost.author && (
                            <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#F5A623]" />
                                <span className="font-medium text-gray-700">{blogPost.author}</span>
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#F5A623]" />
                            {formatDate(blogPost.createdAt)}
                        </span>
                    </div>
                </header>

                {/* Hero Image Swiper */}
                {blogPost.images?.length > 0 && (
                    <div className="relative rounded-2xl overflow-hidden mb-10 aspect-[16/9] bg-gray-100">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            slidesPerView={1}
                            navigation={{ nextEl: '.blog-next', prevEl: '.blog-prev' }}
                            pagination={{ clickable: true, el: '.blog-pagination' }}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            className="h-full w-full"
                        >
                            {blogPost.images.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <img
                                        src={getImageUrl(img, failedImages, blogPost._id)}
                                        alt={`${blogPost.title} ${i + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => handleImageError(e, blogPost)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {blogPost.images.length > 1 && (
                            <>
                                <button className="blog-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/80 rounded-full shadow-md hover:bg-white transition-all cursor-pointer border border-[#F5A623]/30">
                                    <ChevronLeft className="w-4 h-4 text-[#7B3B0A]" />
                                </button>
                                <button className="blog-next absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/80 rounded-full shadow-md hover:bg-white transition-all cursor-pointer border border-[#F5A623]/30">
                                    <ChevronRight className="w-4 h-4 text-[#7B3B0A]" />
                                </button>
                                <div className="blog-pagination absolute bottom-4 left-0 right-0 flex justify-center z-10" />
                            </>
                        )}
                    </div>
                )}

                {/* Article Body */}
                <article className="mb-10">
                    {/* Summary / Lead */}
                    {blogPost.summary && (
                        <p className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed border-l-4 border-[#F5A623] pl-5 mb-8 italic">
                            {blogPost.summary}
                        </p>
                    )}

                    {/* Full Content */}
                    <div className="prose prose-gray px-2 max-w-none">
                        {paragraphs.map((para, i) => (
                            <p key={i} className="text-base sm:text-lg text-gray-700 leading-relaxed mb-5">
                                {para}
                            </p>
                        ))}
                    </div>
                </article>

                {/* Divider */}
                <hr className="border-[#F5A623]/30 mb-8" />

                {/* Share */}
                <div className="mb-12">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#7B3B0A] mb-4 uppercase tracking-wide">
                        <Share2 className="w-4 h-4 text-[#F5A623]" /> Share this article
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blogPost.title)}&url=${shareUrl}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:opacity-85 transition-opacity shadow-md">
                            <Twitter className="w-4 h-4" /> Share on X
                        </a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white rounded-xl text-sm font-medium hover:opacity-85 transition-opacity shadow-md">
                            <Facebook className="w-4 h-4" /> Facebook
                        </a>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:opacity-85 transition-opacity shadow-md">
                            <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <div className="text-center mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#7B3B0A]">You Might Also Like</h2>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] mx-auto mt-2 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {relatedPosts.map((post) => (
                                <motion.div key={post._id} whileHover={{ y: -3 }}
                                    className="bg-white rounded-2xl overflow-hidden border border-[#F5A623]/20 hover:border-[#F5A623]/40 hover:shadow-md transition-all duration-300">
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={getImageUrl(post.images?.[0], failedImages, post._id)}
                                            alt={post.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            onError={(e) => handleImageError(e, post)}
                                        />
                                        {post.category && (
                                            <span className="absolute top-3 left-3 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm">
                                                {post.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-[#7B3B0A] mb-1.5 line-clamp-2 leading-snug">{post.title}</h3>
                                        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{post.summary}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">{formatDate(post.createdAt)}</span>
                                            <Link to={`/blog/${post._id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                className="inline-flex items-center gap-1 text-[#7B3B0A] hover:text-[#F5A623] text-xs font-semibold transition-all group">
                                                Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </motion.div>
    );
};

export default BlogDetail;
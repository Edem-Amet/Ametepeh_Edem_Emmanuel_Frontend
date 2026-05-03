// Blog.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import logoImage from '../assets/edem_logo.png';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Blog = ({ isHomePage = true }) => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [failedImages, setFailedImages] = useState(new Set());
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const TopLink = ({ to, children, className, ...props }) => (
        <Link
            to={to}
            className={className}
            onClick={scrollToTop}
            {...props}
        >
            {children}
        </Link>
    );

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/blog`);
                const posts = Array.isArray(data?.data) ? data.data : [];

                const publishedPosts = posts.filter(post => post.published);
                const sortedPosts = publishedPosts.sort((a, b) => {
                    if (b.index !== a.index) return b.index - a.index;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                const processedPosts = sortedPosts.map(post => ({
                    ...post,
                    createdAt: new Date(post.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })
                }));

                setBlogPosts(processedPosts);
                setError('');
            } catch (err) {
                console.error('❌ Error fetching blog posts:', err);
                setError('Blog posts are currently unavailable. Please check back later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [backendUrl]);

    const getImageUrl = (imagePath, postId) => {
        if (!imagePath || failedImages.has(postId)) {
            return logoImage;
        }

        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        if (imagePath.startsWith('data:')) {
            return imagePath;
        }

        let cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        return `${backendUrl}/${cleanPath}`;
    };

    const handleImageError = (e, blogPost) => {
        console.warn(`Image load failed for ${blogPost.title}:`, e.target.src);

        if (!e.target.dataset.retried) {
            e.target.dataset.retried = 'true';
            const originalUrl = e.target.src.split('?')[0];
            const cacheBustedUrl = `${originalUrl}?t=${Date.now()}`;
            e.target.src = cacheBustedUrl;
            return;
        }

        if (!e.target.dataset.alternateAttempted && blogPost.images) {
            e.target.dataset.alternateAttempted = 'true';
            const alternatePath = `/images/blog/${blogPost.images[0].split('/').pop()}`;
            const alternateUrl = `${backendUrl}${alternatePath}`;
            e.target.src = alternateUrl;
            return;
        }

        setFailedImages(prev => new Set(prev).add(blogPost._id));
        e.target.src = logoImage;
    };

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

    if (error) return (
        <div className="min-h-[300px] flex items-center justify-center px-4 transition-colors duration-500">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center max-w-md w-full p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-[#F5A623]/30"
            >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">Content Unavailable</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 sm:px-6 py-2 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white rounded-lg hover:opacity-90 transition-all text-sm sm:text-base shadow-md"
                >
                    Try Again
                </button>
            </motion.div>
        </div>
    );

    return (
        <div className={`w-full sm:pt-8 mt-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${!isHomePage && 'min-h-screen'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 md:mb-12"
                >
                    {/* Header */}
                    <motion.div className="text-center mb-2 pt-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Posts</span>
                        </h2>
                        <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Articles on my journey
                        </p>
                    </motion.div>
                </motion.div>

                {isHomePage ? (
                    <>
                        {/* Featured Blog Post (First Item) */}
                        {blogPosts.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="mb-8 md:mb-16"
                            >
                                <div className="bg-transparent rounded-2xl shadow-md shadow-[#7B3B0A]/20 overflow-hidden border border-[#F5A623]/30 hover:shadow-2xl transition-all duration-500">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image Gallery */}
                                        <div className="md:w-1/2 h-96 md:h-96 relative overflow-hidden bg-transparent">
                                            <Swiper
                                                modules={[Autoplay, Pagination]}
                                                spaceBetween={30}
                                                slidesPerView={1}
                                                autoplay={{
                                                    delay: 5000,
                                                    disableOnInteraction: false,
                                                }}
                                                pagination={{
                                                    clickable: true,
                                                    el: '.featured-pagination',
                                                }}
                                                className="h-full w-full"
                                            >
                                                {blogPosts[0].images.map((image, index) => (
                                                    <SwiperSlide key={index}>
                                                        <img
                                                            src={getImageUrl(image, blogPosts[0]._id)}
                                                            alt={`${blogPosts[0].title} - ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => handleImageError(e, blogPosts[0])}
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                            <div className="featured-pagination absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10"></div>

                                            {/* Date Badge */}
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-[#F5A623]/30">
                                                <span className="text-xs sm:text-sm font-medium text-[#7B3B0A]">
                                                    {blogPosts[0].createdAt}
                                                </span>
                                            </div>
                                            {blogPosts[0].index > 0 && (
                                                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white px-3 py-1 rounded-full shadow-sm text-xs sm:text-sm font-medium">
                                                    Featured Post
                                                </div>
                                            )}
                                        </div>

                                        {/* Blog Content */}
                                        <div className="p-6 sm:p-8 md:w-1/2 flex flex-col shadow-md shadow-[#F5A623]/20">
                                            <div className="mb-4">
                                                <span className="inline-block bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                                    {blogPosts[0].category || 'Blog Post'}
                                                </span>
                                                <h3 className="text-xl sm:text-2xl font-bold text-[#7B3B0A] mb-3">
                                                    {blogPosts[0].title}
                                                </h3>
                                                <p className="text-gray-600 text-sm sm:text-base lg:line-clamp-6 line-clamp-4">
                                                    {blogPosts[0].summary}
                                                </p>
                                            </div>

                                            {blogPosts[0].author && (
                                                <div className="mb-4">
                                                    <span className="text-sm text-gray-500">By </span>
                                                    <span className="text-sm font-medium text-[#F5A623]">{blogPosts[0].author}</span>
                                                </div>
                                            )}

                                            <div className="mt-auto text-sm pt-4 border-t border-gray-100">
                                                <TopLink
                                                    to={`/blog/${blogPosts[0]._id}`}
                                                    className="group inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white font-medium rounded-2xl hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[#7B3B0A]/30"
                                                >
                                                    Read Full Article
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </TopLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Other Blog Posts in Swiper */}
                        {blogPosts.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="mb-2 relative"
                            >
                                <h3 className="text-xl md:text-2xl font-bold text-[#7B3B0A] mb-6 text-center">More Blog Posts</h3>

                                <Swiper
                                    modules={[Autoplay, Pagination, Navigation]}
                                    spaceBetween={24}
                                    slidesPerView={1}
                                    autoplay={{
                                        delay: 5000,
                                        disableOnInteraction: false,
                                    }}
                                    pagination={{
                                        clickable: true,
                                        el: '.blog-pagination',
                                    }}
                                    navigation={{
                                        nextEl: '.blog-next',
                                        prevEl: '.blog-prev',
                                    }}
                                    breakpoints={{
                                        640: { slidesPerView: 2 },
                                        1024: { slidesPerView: 3 }
                                    }}
                                    className="pb-6"
                                >
                                    {blogPosts.slice(1).map((post) => (
                                        <SwiperSlide key={post._id}>
                                            <motion.div
                                                className="bg-transparent rounded-2xl h-[500px] shadow-md shadow-[#7B3B0A]/20 overflow-hidden border border-[#F5A623]/30 hover:shadow-2xl hover:shadow-[#F5A623]/20 transition-all duration-500 flex flex-col mx-2"
                                                whileHover={{ y: -8 }}
                                            >
                                                <div className="relative aspect-video overflow-hidden">
                                                    <img
                                                        src={getImageUrl(post.images[0], post._id)}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition duration-500 hover:scale-110"
                                                        onError={(e) => handleImageError(e, post)}
                                                    />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                                        <span className="text-white text-sm font-medium">
                                                            {post.createdAt}
                                                        </span>
                                                    </div>
                                                    {post.index > 0 && (
                                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white text-xs px-2 py-1 rounded-full">
                                                            Featured
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5 flex flex-col">
                                                    <h3 className="text-xl font-bold text-[#7B3B0A] mt-3 mb-2 line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-6 mt-3 line-clamp-5">
                                                        {post.summary}
                                                    </p>
                                                    {post.author && (
                                                        <div className="mb-4">
                                                            <span className="text-xs text-gray-500">By </span>
                                                            <span className="text-xs font-medium text-[#F5A623]">{post.author}</span>
                                                        </div>
                                                    )}
                                                    <div className="pt-5 border-t border-gray-100">
                                                        <TopLink
                                                            to={`/blog/${post._id}`}
                                                            className="group inline-flex items-center text-base font-medium text-[#7B3B0A] hover:text-[#F5A623] transition-all duration-300"
                                                        >
                                                            Continue reading
                                                            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                                        </TopLink>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <div className="blog-pagination flex justify-center mt-4"></div>
                                <div className="blog-next absolute top-1/2 right-2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 text-[#7B3B0A] rounded-full shadow-lg hover:bg-white transition-all cursor-pointer border border-[#F5A623]/30">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                                <div className="blog-prev absolute top-1/2 left-2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 text-[#7B3B0A] rounded-full shadow-lg hover:bg-white transition-all cursor-pointer border border-[#F5A623]/30">
                                    <ChevronLeft className="w-5 h-5" />
                                </div>
                            </motion.div>
                        )}
                    </>
                ) : (
                    /* Full Blog Grid Layout for Non-Homepage */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogPosts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-transparent rounded-2xl overflow-hidden border border-[#F5A623]/30 shadow-lg shadow-[#7B3B0A]/20 transition-all duration-500 flex flex-col hover:shadow-2xl hover:-translate-y-1"
                            >
                                <div className="relative h-48 sm:h-56 overflow-hidden">
                                    <img
                                        src={getImageUrl(post.images[0], post._id)}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition duration-500 hover:scale-105"
                                        onError={(e) => handleImageError(e, post)}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                        <span className="text-white text-xs sm:text-sm">
                                            {post.createdAt}
                                        </span>
                                    </div>
                                    {post.index > 0 && (
                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white text-xs px-2 py-1 rounded-full">
                                            Featured
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 sm:p-6 flex-grow flex flex-col">
                                    <h3 className="text-lg sm:text-xl font-bold text-[#7B3B0A] mb-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3">
                                        {post.summary}
                                    </p>
                                    {post.author && (
                                        <div className="mb-4">
                                            <span className="text-xs text-gray-500">By </span>
                                            <span className="text-xs font-medium text-[#F5A623]">{post.author}</span>
                                        </div>
                                    )}
                                    <TopLink
                                        to={`/blog/${post._id}`}
                                        className="mt-auto group inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white hover:opacity-90 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-[#7B3B0A]/30"
                                    >
                                        Read More
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </TopLink>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Posts Message */}
                {blogPosts.length === 0 && !loading && !error && (
                    <div className="text-center py-12 px-6 bg-white/70 rounded-lg shadow-sm border border-[#F5A623]/30">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#F5A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <p className="text-[#7B3B0A] text-lg font-medium">No blog posts available.</p>
                        <p className="text-[#7B3B0A]/60">Check back later for new content.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
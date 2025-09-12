import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Instagram,
    Linkedin,
    Github,
    Twitter,
    Globe,
    RotateCcw
} from 'lucide-react';

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const intervalRef = useRef(null);

    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Fetch published banners from backend
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/banner`);
            const data = await response.json();

            if (data.success) {
                // Filter only published banners
                const publishedBanners = (data.data || []).filter(banner => banner.published);
                setBanners(publishedBanners);

                if (publishedBanners.length === 0) {
                    setError('No published banners found');
                }
            } else {
                throw new Error(data.error || 'Failed to fetch banners');
            }
        } catch (err) {
            console.error('Error fetching banners:', err);
            setError('Failed to load banners');
            // Fallback to demo data if API fails
            setBanners([getDemoData()]);
        } finally {
            setLoading(false);
        }
    };

    // Demo data fallback
    const getDemoData = () => ({
        _id: 'demo',
        headline: 'Hello, I am',
        highlightedText: 'Edem Ametepeh',
        description: 'Teaching Assistant at KNUST with a BSc in Physics, passionate about Artificial Intelligence and Human-Computer Interaction research, digital inclusion, and building impactful solutions as a full-stack developer.',
        socialLinks: {
            linkedin: 'https://www.linkedin.com/in/ametepeh-emmanuel-174139244/',
            github: 'https://github.com/Edem-Amet',
            twitter: 'https://twitter.com/',
            instagram: 'https://www.Instagram.com/',
            website: 'https://example.com'
        },
        buttons: [
            { text: 'View Portfolio', url: '#portfolio', style: 'filled' },
            { text: 'Explore More', url: '#about', style: 'outline' }
        ],
        stats: [
            { label: 'Years Experience', value: '3+' },
            { label: 'Projects Completed', value: '7+' },
            { label: 'Happy Clients', value: '8+' }
        ],
        mainImage: {
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
            altText: 'Profile Image'
        },
        published: true
    });

    // Auto-play functionality
    useEffect(() => {
        if (banners.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % banners.length);
            }, 10000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [banners.length]);

    // Touch handlers for mobile swiping
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && banners.length > 1) {
            nextSlide();
        }
        if (isRightSwipe && banners.length > 1) {
            prevSlide();
        }
    };

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Animation variants
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -15, 0],
            rotate: [0, 3, -3, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
                <motion.div
                    className="text-center space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-transparent border-t-primary border-b-secondary"></div>
                        <div className="absolute inset-0 inline-block animate-ping rounded-full h-16 w-16 border-2 border-secondary opacity-20"></div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Loading Portfolio</h2>
                        <p className="text-muted-foreground">Preparing your experience...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/10 to-destructive/20">
                <motion.div
                    className="text-center space-y-6 max-w-md mx-auto px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-destructive/20 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                        <RotateCcw className="h-12 w-12 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-destructive">Unable to Load</h2>
                        <p className="text-destructive">{error}</p>
                    </div>
                    <motion.button
                        onClick={fetchBanners}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Try Again
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    if (banners.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">No Banners Available</h2>
                    <p className="text-muted-foreground">Please check back later.</p>
                </div>
            </div>
        );
    }

    const currentBanner = banners[currentSlide];

    return (
        <div className="relative w-full pl-2 pr-2 sm:pl-8 sm:pr-8 mt-16 pt-12 sm:pt-2 md:mt-16 sm:mt-8 min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--secondary)) 2px, transparent 0), radial-gradient(circle at 75px 75px, hsl(var(--primary)) 2px, transparent 0)`,
                    backgroundSize: '100px 100px'
                }}></div>
            </div>

            {/* Main Banner Content */}
            <div
                className="relative h-screen pt-16 lg:pt-0"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <AnimatePresence mode="wait" custom={currentSlide}>
                    <motion.section
                        key={currentSlide}
                        custom={currentSlide}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-20 py-8 lg:py-0"
                    >
                        {/* Left Content */}
                        <motion.div
                            className="flex-1 max-w-2xl mt-4 lg:mt-0"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Main Headline */}
                            <motion.div variants={itemVariants} className="space-y-4 mb-6 md:mb-8">
                                <motion.h1
                                    className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-bold leading-tight"
                                    variants={itemVariants}
                                >
                                    <span className="text-primary">
                                        {currentBanner.headline || 'Welcome'}
                                    </span>
                                    {currentBanner.highlightedText && (
                                        <>
                                            <br />
                                            <motion.span
                                                className="text-secondary"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, duration: 0.8 }}
                                            >
                                                {currentBanner.highlightedText}
                                            </motion.span>
                                        </>
                                    )}
                                </motion.h1>

                                <motion.p
                                    variants={itemVariants}
                                    className="text-sm sm:text-base md:text-md text-muted-foreground leading-relaxed max-w-xl"
                                >
                                    {currentBanner.description || 'Professional portfolio and showcase.'}
                                </motion.p>
                            </motion.div>

                            {/* Social Links */}
                            {currentBanner.socialLinks && Object.values(currentBanner.socialLinks).some(link => link) && (
                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-wrap items-center gap-3 mb-6 md:mb-8"
                                >
                                    {currentBanner.socialLinks.linkedin && (
                                        <motion.a
                                            href={currentBanner.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative p-2 md:p-3 bg-card rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Linkedin className="h-5 w-5 md:h-6 md:w-6 text-[#0A66C2]" />
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                LinkedIn
                                            </div>
                                        </motion.a>
                                    )}

                                    {currentBanner.socialLinks.github && (
                                        <motion.a
                                            href={currentBanner.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative p-2 md:p-3 bg-card rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Github className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                GitHub
                                            </div>
                                        </motion.a>
                                    )}

                                    {currentBanner.socialLinks.twitter && (
                                        <motion.a
                                            href={currentBanner.socialLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative p-2 md:p-3 bg-card rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Twitter className="h-5 w-5 md:h-6 md:w-6 text-[#1DA1F2]" />
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                Twitter
                                            </div>
                                        </motion.a>
                                    )}

                                    {currentBanner.socialLinks.instagram && (
                                        <motion.a
                                            href={currentBanner.socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative p-2 md:p-3 bg-card rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Instagram className="h-5 w-5 md:h-6 md:w-6 text-[#E4405F]" />
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                Instagram
                                            </div>
                                        </motion.a>
                                    )}

                                    {currentBanner.socialLinks.website && (
                                        <motion.a
                                            href={currentBanner.socialLinks.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative p-2 md:p-3 bg-card rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Globe className="h-5 w-5 md:h-6 md:w-6 text-[#10B981]" />
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                Website
                                            </div>
                                        </motion.a>
                                    )}
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            {currentBanner.buttons && currentBanner.buttons.some(btn => btn.text) && (
                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12"
                                >
                                    {currentBanner.buttons.map((button, index) => {
                                        if (!button.text) return null;

                                        return (
                                            <motion.a
                                                key={index}
                                                href={button.url || '#'}
                                                target={button.url?.startsWith('http') ? "_blank" : "_self"}
                                                rel="noopener noreferrer"
                                                className={`group relative inline-flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 ${button.style === 'filled'
                                                    ? 'bg-secondary text-white shadow-lg hover:shadow-xl'
                                                    : 'border-2 border-primary text-primary hover:bg-secondary hover:text-background'
                                                    }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {button.text}
                                                <ExternalLink className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-200" />
                                            </motion.a>
                                        );
                                    })}
                                </motion.div>
                            )}

                            {/* Statistics */}
                            {currentBanner.stats && currentBanner.stats.some(stat => stat.value && stat.label) && (
                                <motion.div
                                    variants={itemVariants}
                                    className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-2xl"
                                >
                                    {currentBanner.stats.map((stat, index) => {
                                        if (!stat.value || !stat.label) return null;

                                        const colors = [
                                            'bg-secondary text-white',
                                            'bg-primary text-white',
                                            'bg-accent text-accent-foreground',
                                            'bg-muted-foreground text-background'
                                        ];

                                        return (
                                            <motion.div
                                                key={index}
                                                className={`${colors[index % colors.length]} p-3 md:p-5 rounded-xl md:rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105`}
                                                whileHover={{ scale: 1.05, rotateY: 5 }}
                                            >
                                                <motion.h3
                                                    className="text-lg md:text-lg lg:text-lg font-bold mb-1 md:mb-2"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                                                >
                                                    {stat.value}
                                                </motion.h3>
                                                <p className="text-xs md:text-sm font-medium opacity-90">
                                                    {stat.label}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Right Content - Image */}
                        <motion.div
                            className="flex-1 flex justify-center items-center relative max-w-md mx-auto lg:mx-0 mb-8 lg:mb-0"
                            variants={itemVariants}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="relative">
                                {/* Main Image Container */}
                                <motion.div
                                    className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-secondary to-primary p-1"
                                    variants={floatingVariants}
                                    animate="animate"
                                >
                                    <div className="w-full h-full rounded-3xl overflow-hidden bg-background">
                                        {currentBanner.mainImage?.url ? (
                                            <img
                                                src={currentBanner.mainImage.url}
                                                alt={currentBanner.mainImage.altText || currentBanner.highlightedText || 'Profile'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <div className="text-muted-foreground text-center">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-muted-foreground rounded-full flex items-center justify-center">
                                                        <span className="text-2xl md:text-3xl font-bold text-background">
                                                            {(currentBanner.highlightedText || 'U').charAt(0)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs md:text-sm">Profile Image</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Floating Decorative Elements */}
                                <motion.div
                                    className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full shadow-lg md:block hidden"
                                    animate={{
                                        y: [0, -8, 0],
                                        rotate: [0, 180, 360],
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                <motion.div
                                    className="absolute -bottom-3 -left-3 w-10 h-10 bg-purple-500 rounded-full shadow-lg md:block hidden"
                                    animate={{
                                        y: [0, 12, 0],
                                        x: [0, 4, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                />

                                {/* Background Circles */}
                                <motion.div
                                    className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/20 rounded-full md:block hidden"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />

                                <motion.div
                                    className="absolute -bottom-6 -right-6 w-20 h-20 bg-primary/20 rounded-full md:block hidden"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                />
                            </div>
                        </motion.div>
                    </motion.section>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {banners.length > 1 && (
                <>
                    {/* Arrow Navigation */}
                    <motion.button
                        onClick={prevSlide}
                        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-background hover:shadow-xl transition-all duration-300 z-10"
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                    </motion.button>

                    <motion.button
                        onClick={nextSlide}
                        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-background hover:shadow-xl transition-all duration-300 z-10"
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                    </motion.button>

                    {/* Bottom Controls */}
                    <motion.div
                        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 md:space-x-4 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 md:px-6 md:py-3 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        {/* Slide Indicators */}
                        <div className="flex space-x-1 md:space-x-2">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-secondary scale-125'
                                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default Banner;
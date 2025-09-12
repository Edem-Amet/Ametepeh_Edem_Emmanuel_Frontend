import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Code, Eye, AlertCircle, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Enhanced animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            when: "beforeChildren",
            delayChildren: 0.2
        }
    }
};

const projectVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
        }
    },
    hover: {
        y: -8,
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    }
};

const Projects = ({ showAll = false, limit = 3 }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/projects`);
            const data = await response.json();

            if (data.success) {
                // Filter only published projects and sort by orderIndex
                const publishedProjects = data.data
                    .filter(project => project.published)
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

                // Limit projects for home screen
                const displayProjects = showAll ? publishedProjects : publishedProjects.slice(0, limit);
                setProjects(displayProjects);
            } else {
                throw new Error(data.error || 'Failed to fetch projects');
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to load projects. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Extract GitHub and Live Demo links from project links
    const getProjectLinks = (links) => {
        if (!links || !Array.isArray(links)) return { github: null, live: null };

        const github = links.find(link =>
            link.label.toLowerCase().includes('github') ||
            link.label.toLowerCase().includes('code') ||
            link.label.toLowerCase().includes('source')
        );

        const live = links.find(link =>
            link.label.toLowerCase().includes('demo') ||
            link.label.toLowerCase().includes('live') ||
            link.label.toLowerCase().includes('preview') ||
            link.label.toLowerCase().includes('visit')
        );

        return {
            github: github?.url || null,
            live: live?.url || null
        };
    };

    // Swiper functions
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % projects.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Loading state
    if (loading) {
        return (
            <section id="projects" className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Projects</span>
                        </h2>
                    </div>
                    <div className="flex items-center justify-center py-16 md:py-20">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-primary mx-auto" />
                            <p className="text-base md:text-lg font-medium text-secondary">Loading amazing projects...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section id="projects" className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Projects</span>
                        </h2>
                    </div>
                    <div className="flex items-center justify-center py-16 md:py-20">
                        <div className="text-center space-y-4 max-w-md mx-auto px-4">
                            <AlertCircle className="h-10 w-10 md:h-12 md:w-12 text-red-500 mx-auto" />
                            <h3 className="text-xl font-semibold text-gray-900">Unable to Load Projects</h3>
                            <p className="text-gray-600">{error}</p>
                            <button
                                onClick={fetchProjects}
                                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-medium transition-colors mt-4"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const ProjectCard = ({ project, index }) => {
        const { github, live } = getProjectLinks(project.links);

        return (
            <motion.div
                variants={projectVariants}
                whileHover="hover"
                className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg shadow-primary/70 transition-all duration-300
                 flex flex-col border border-gray-100 h-full"
            >
                {/* Project Image */}
                <div className="relative h-48 sm:h-56 bg-gray-200 overflow-hidden group cursor-pointer">
                    {project.mainImage?.url ? (
                        <img
                            src={project.mainImage.url}
                            alt={project.mainImage.altText || project.title}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                            onClick={() => setSelectedImage(project.mainImage)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Code size={40} className="md:w-12 md:h-12" />
                        </div>
                    )}

                    {/* Order Badge */}
                    <div className="absolute top-3 left-3 bg-primary text-white rounded-full px-2 py-1 text-xs font-medium">
                        #{project.orderIndex || index + 1}
                    </div>
                </div>

                {/* Project Content */}
                <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2 md:mb-3">
                            {project.title}
                        </h3>
                        <p className="text-gray-800 text-sm sm:text-base mb-4 md:mb-5 leading-relaxed">
                            {project.description || 'No description available'}
                        </p>

                        {/* Tech Stack Tags */}
                        {project.techStack && project.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 md:mb-5">
                                {project.techStack.slice(0, 4).map((tech, techIndex) => (
                                    <motion.span
                                        key={techIndex}
                                        className="bg-gradient-to-r from-gray-800 to-gray-800 text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20"
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor: "rgba(99, 102, 241, 0.2)"
                                        }}
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                                {project.techStack.length > 4 && (
                                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        +{project.techStack.length - 4} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Additional Links */}
                        {project.links && project.links.length > 2 && (
                            <div className="mb-3 md:mb-4">
                                <p className="text-xs sm:text-sm text-gray-500 mb-1.5">Additional Resources:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {project.links
                                        .filter(link =>
                                            !link.label.toLowerCase().includes('github') &&
                                            !link.label.toLowerCase().includes('demo') &&
                                            !link.label.toLowerCase().includes('live') &&
                                            !link.label.toLowerCase().includes('code')
                                        )
                                        .slice(0, 2)
                                        .map((link, linkIndex) => (
                                            <a
                                                key={linkIndex}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                                            >
                                                {link.label}
                                            </a>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3 mt-auto pt-3 md:pt-4 border-t border-gray-100">
                        {github ? (
                            <motion.a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center border border-primary text-primary hover:bg-primary hover:text-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                                whileHover={{ y: -2, backgroundColor: "rgb(99, 102, 241)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Github size={14} className="sm:w-4 sm:h-4" />
                                <span className="truncate">Code</span>
                            </motion.a>
                        ) : (
                            <div className="flex-1 text-center bg-gray-100 text-gray-400 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2">
                                <Github size={14} className="sm:w-4 sm:h-4" />
                                <span className="truncate">Code N/A</span>
                            </div>
                        )}

                        {live ? (
                            <motion.a
                                href={live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-center bg-secondary hover:bg-primary-dark text-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                                <span className="truncate">Live Demo</span>
                            </motion.a>
                        ) : (
                            <div className="flex-1 text-center bg-gray-100 text-gray-400 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2">
                                <Eye size={14} className="sm:w-4 sm:h-4" />
                                <span className="truncate">Demo N/A</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };.......

    return (
        <>
            <section
                id="projects"
                className="pt-24 sm:mt-8 md:pt-20 px-4 sm:px-6 lg:px-8"
            >
                <motion.div
                    className="max-w-7xl mx-auto"
                >
                    {/* Section Header */}
                    <motion.div
                        variants={projectVariants}
                        className="text-center mb-12 md:mb-16"
                    >
                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Projects</span>
                        </motion.h2>
                        <motion.p
                            className="text-md sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4"
                        >
                            {showAll ? (
                                <>
                                    Explore my complete project portfolio showcasing various technologies and solutions.
                                    <span className="block mt-2 text-sm text-gray-500">
                                        {projects.length} project{projects.length !== 1 ? 's' : ''} available
                                    </span>
                                </>
                            ) : (
                                <>
                                    Each project represents a unique challenge solved with clean code and thoughtful design.
                                    <span className="block mt-2 text-sm text-gray-500">
                                        Featuring top {Math.min(projects.length, limit)} priority projects
                                    </span>
                                </>
                            )}
                        </motion.p>
                    </motion.div>

                    {/* Projects Display */}
                    {projects.length > 0 ? (
                        <>
                            {/* Desktop/Tablet Grid */}
                            <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {projects.map((project, index) => (
                                    <ProjectCard key={project._id} project={project} index={index} />
                                ))}
                            </div>

                            {/* Mobile Swiper - Only show on home page (when not showing all projects) */}
                            {!showAll ? (
                                <div className="md:hidden relative mx-2">
                                    <div className="overflow-hidden rounded-xl shadow-xl pb-4 ml-2 mr-2">
                                        <div
                                            className="flex transition-transform duration-500 ease-in-out"
                                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                        >
                                            {projects.map((project, index) => (
                                                <div key={project._id} className="w-full flex-shrink-0 px-2">
                                                    <ProjectCard project={project} index={index} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Navigation Arrows */}
                                    {projects.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevSlide}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10 backdrop-blur-sm"
                                                aria-label="Previous project"
                                            >
                                                <ChevronLeft className="w-5 h-5 text-secondary" />
                                            </button>
                                            <button
                                                onClick={nextSlide}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10 backdrop-blur-sm"
                                                aria-label="Next project"
                                            >
                                                <ChevronRight className="w-5 h-5 text-secondary" />
                                            </button>
                                        </>
                                    )}

                                    {/* Dots Indicator */}
                                    {projects.length > 1 && (
                                        <div className="flex justify-center mt-6 space-x-2">
                                            {projects.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => goToSlide(index)}
                                                    className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                                        ? 'bg-primary scale-125'
                                                        : 'bg-gray-300 hover:bg-gray-400'
                                                        }`}
                                                    aria-label={`Go to slide ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // On the main projects page, show grid layout even on mobile
                                <div className="grid grid-cols-1 gap-6 md:hidden">
                                    {projects.map((project, index) => (
                                        <ProjectCard key={project._id} project={project} index={index} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        // Empty state
                        <div className="text-center py-16 md:py-20">
                            <Code size={48} className="mx-auto text-gray-400 mb-3" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Available</h3>
                            <p className="text-gray-600 max-w-md mx-auto px-4">
                                Projects are being updated. Check back soon to see amazing work!
                            </p>
                        </div>
                    )}

                    {/* Explore All Button - Only show on home screen */}
                    {!showAll && projects.length > 0 && (
                        <motion.div
                            className="text-center mt-12 md:mt-16"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <motion.a
                                href="/projects"
                                className="inline-flex items-center px-4 py-2 md:px-8 md:py-4 border-2 border-primary rounded-full text-primary hover:bg-secondary hover:border-none hover:text-white transition-all duration-300 font-medium text-base md:text-lg"
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>Explore All Projects</span>
                                <motion.svg
                                    className="ml-2 w-4 h-4 md:w-5 md:h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </motion.svg>
                            </motion.a>

                            <p className="mt-3 text-sm text-gray-500">
                                {projects.length === limit ? `Showing top ${limit} projects` : `Showing ${projects.length} project${projects.length !== 1 ? 's' : ''}`}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </section>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative max-w-4xl w-full max-h-[85vh] bg-black rounded-lg md:rounded-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 md:p-2 transition-all z-10"
                                aria-label="Close image"
                            >
                                <X size={20} className="md:w-6 md:h-6" />
                            </button>

                            {/* Image */}
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.altText}
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Projects;
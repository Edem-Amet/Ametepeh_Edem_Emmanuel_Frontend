import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Code, Eye, AlertCircle, Loader2, X, ChevronLeft, ChevronRight, ArrowRight, Layers, Bookmark, Heart, ArrowUpRight, User } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// ─── animation variants ───────────────────────────────────────────────────────
const projectVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    },
    hover: {
        y: -8, scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' }
    }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2, ease: 'easeIn' } }
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const getProjectLinks = (links) => {
    if (!links || !Array.isArray(links)) return { github: null, live: null };
    const github = links.find(l =>
        ['github', 'code', 'source'].some(k => l.label.toLowerCase().includes(k))
    );
    const live = links.find(l =>
        ['demo', 'live', 'preview', 'visit'].some(k => l.label.toLowerCase().includes(k))
    );
    return { github: github?.url || null, live: live?.url || null };
};

// ─── SHARED PROJECT CARD ─────────────────────────────────────────────────────
const ProjectCard = ({ project, index, onOpen, isSwiper = false }) => {
    const { github, live } = getProjectLinks(project.links);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isSwiper ? 0 : index * 0.12, duration: 0.55 }}
            className="group cursor-pointer h-full"
            onClick={() => onOpen(project)}
        >
            <div className="bg-white rounded-2xl border border-primary/20 shadow-lg shadow-secondary/10 overflow-hidden transition-all duration-500 h-full flex flex-col hover:-translate-y-1 hover:shadow-xl">

                {/* Image */}
                <div className="relative m-3 overflow-hidden rounded-xl">
                    {project.mainImage?.url ? (
                        <div className="relative w-full h-52">
                            <img
                                src={project.mainImage.url}
                                alt={project.mainImage.altText || project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                        </div>
                    ) : (
                        <div className="w-full h-52 flex items-center justify-center rounded-xl"
                            style={{ background: 'linear-gradient(135deg, #7B3B0A12, #F5A62312)' }}>
                            <Code className="w-10 h-10 text-secondary opacity-40" />
                        </div>
                    )}

                    {/* Order badge */}
                    <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-gray-900/80 backdrop-blur-sm text-xs font-semibold text-white rounded-lg border border-white/20">
                            #{project.orderIndex || index + 1}
                        </span>
                    </div>

                    {/* Hover action icons */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-1.5">
                        <button className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
                            onClick={e => e.stopPropagation()}>
                            <Bookmark size={11} />
                        </button>
                        <button className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
                            onClick={e => e.stopPropagation()}>
                            <Heart size={11} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-5 pb-5 flex flex-col flex-1 space-y-3">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-primary leading-snug group-hover:text-secondary transition-colors">
                        {project.title}
                    </h3>

                    {/* Description — 2 lines */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-1">
                        {project.description || 'No description available.'}
                    </p>

                    {/* Tech pills — show on card always */}
                    {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {project.techStack.slice(0, 3).map((tech, i) => (
                                <span key={i}
                                    className="px-2 py-0.5 text-xs font-medium rounded-md"
                                    style={{
                                        background: 'linear-gradient(to right, #7B3B0A12, #F5A62312)',
                                        color: '#7B3B0A',
                                        border: '1px solid #F5A62335'
                                    }}>
                                    {tech}
                                </span>
                            ))}
                            {project.techStack.length > 3 && (
                                <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-500">
                                    +{project.techStack.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex gap-2">
                            {github ? (
                                <button
                                    onClick={e => { e.stopPropagation(); window.open(github, '_blank'); }}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ background: '#7B3B0A15', color: '#7B3B0A' }}
                                    title="Source Code"
                                >
                                    <Github size={14} />
                                </button>
                            ) : (
                                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-300 cursor-not-allowed" title="No repo">
                                    <Github size={14} />
                                </button>
                            )}
                            {live ? (
                                <button
                                    onClick={e => { e.stopPropagation(); window.open(live, '_blank'); }}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ background: '#F5A62315', color: '#F5A623' }}
                                    title="Live Demo"
                                >
                                    <ExternalLink size={14} />
                                </button>
                            ) : (
                                <button className="p-1.5 rounded-lg bg-gray-100 text-gray-300 cursor-not-allowed" title="No live demo">
                                    <ExternalLink size={14} />
                                </button>
                            )}
                        </div>

                        <button
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
                            style={{
                                background: 'linear-gradient(to right, #7B3B0A12, #F5A62312)',
                                color: '#7B3B0A',
                            }}
                        >
                            View Details <ArrowUpRight size={11} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ─── PROJECT MODAL (full detail) ─────────────────────────────────────────────
const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;
    const { github, live } = getProjectLinks(project.links);
    const extraLinks = project.links?.filter(l =>
        !['github', 'code', 'source', 'demo', 'live', 'preview', 'visit'].some(k => l.label.toLowerCase().includes(k))
    ) || [];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                style={{ background: 'rgba(0,0,0,0.70)' }}
                onClick={onClose}
            >
                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-3xl max-h-[75vh] mt-4 flex flex-col"
                    style={{ border: '1px solid #F5A62330' }}
                >
                    {/* Sticky header */}
                    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-start justify-between">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-1">
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                    style={{ background: '#7B3B0A15', color: '#7B3B0A' }}>
                                    #{project.orderIndex || 1}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors ml-4 flex-shrink-0"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {/* Image */}
                        {project.mainImage?.url && (
                            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                <img
                                    src={project.mainImage.url}
                                    alt={project.mainImage.altText || project.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                        )}

                        <div className="p-6 space-y-6">
                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                    <Layers size={13} /> Project Overview
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-sm">
                                    {project.description || 'No description available.'}
                                </p>
                            </div>

                            {/* Tech Stack */}
                            {project.techStack?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                        <Code size={13} /> Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech, i) => (
                                            <span key={i}
                                                className="px-3 py-1.5 text-sm font-medium rounded-xl"
                                                style={{
                                                    background: 'linear-gradient(to right, #7B3B0A10, #F5A62310)',
                                                    color: '#7B3B0A',
                                                    border: '1px solid #F5A62340'
                                                }}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Extra links */}
                            {extraLinks.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                        Additional Resources
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {extraLinks.map((link, i) => (
                                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                                className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA buttons */}
                            <div className="flex flex-wrap gap-3 pt-2">
                                {github && (
                                    <a href={github} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:shadow-md"
                                        style={{ border: '1.5px solid #7B3B0A', color: '#7B3B0A' }}>
                                        <Github size={15} /> Source Code
                                    </a>
                                )}
                                {live && (
                                    <a href={live} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-all hover:shadow-lg hover:scale-105"
                                        style={{ background: 'linear-gradient(to right, #8B4513, #FF8C00)' }}>
                                        <ExternalLink size={15} /> Visit Site
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Projects = ({ showAll = false, limit = 3 }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const isHomepage = !showAll;

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/projects`);
            const data = await response.json();
            if (data.success) {
                const published = data.data
                    .filter(p => p.published)
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
                setProjects(showAll ? published : published.slice(0, limit));
            } else {
                throw new Error(data.error || 'Failed to fetch projects');
            }
        } catch (err) {
            setError('Failed to load projects. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // ── loading ──
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

                        {/* Spiral */}
                        <path
                            className="ea-spiral"
                            d="M 160,245 C 120,245 95,215 95,180 C 95,130 135,100 185,100 C 250,100 295,148 295,200 C 295,255 250,295 195,295 C 130,295 80,250 80,185 C 80,125 128,80 195,80 C 270,80 340,128 345,185 C 352,255 310,310 240,320"
                            fill="none"
                            stroke="#F5A623"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />

                        {/* Dot */}
                        <circle className="ea-dot" cx="257" cy="175" r="5" fill="#F5A623" />

                        {/* E */}
                        <text
                            className="ea-letter ea-letter-e"
                            x="150" y="240"
                            fontFamily="Georgia, 'Times New Roman', serif"
                            fontSize="160"
                            fontWeight="700"
                            fill="#7B3B0A"
                        >E</text>

                        {/* A */}
                        <text
                            className="ea-letter ea-letter-a"
                            x="240" y="240"
                            fontFamily="Georgia, 'Times New Roman', serif"
                            fontSize="160"
                            fontWeight="700"
                            fill="#F5A623"
                        >A</text>

                        {/* Name */}
                        <text
                            className="ea-name"
                            x="250" y="298"
                            fontFamily="Georgia, 'Times New Roman', serif"
                            fontSize="16"
                            fontWeight="400"
                            letterSpacing="6"
                            fill="#7B3B0A"
                            textAnchor="middle"
                        >EDEM  AMET</text>
                    </svg>
                </motion.div>
            </div>
        );
    }

    // ── error ──
    if (error) {
        return (
            <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Projects</h3>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button onClick={fetchProjects}
                        className="px-6 py-2.5 text-white rounded-xl font-medium transition hover:shadow-lg"
                        style={{ background: 'linear-gradient(to right, #7B3B0A, #F5A623)' }}>
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // HOMEPAGE — coverflow swiper, same card style as PortfolioCard reference
    // ──────────────────────────────────────────────────────────────────────────
    if (isHomepage) {
        return (
            <>
                <section id="projects" className="relative pt-4 sm:pt-16 overflow-hidden mt-8 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto relative">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-4 md:mb-10"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    My Projects
                                </span>
                            </h2>

                            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                                Discover top projects
                            </p>
                        </motion.div>

                        {/* Coverflow Swiper */}
                        {projects.length > 0 ? (
                            <div className="pb-16">
                                <Swiper
                                    modules={[Navigation, Pagination, EffectCoverflow]}
                                    effect="coverflow"
                                    grabCursor={true}
                                    centeredSlides={true}
                                    slidesPerView="auto"
                                    initialSlide={Math.min(1, projects.length - 1)}
                                    coverflowEffect={{
                                        rotate: 25,
                                        stretch: 0,
                                        depth: 100,
                                        modifier: 1.5,
                                        slideShadows: false,
                                    }}
                                    pagination={{ clickable: true, dynamicBullets: true }}
                                    navigation={true}
                                    breakpoints={{
                                        320: { slidesPerView: 1, spaceBetween: 20 },
                                        640: { slidesPerView: 1, spaceBetween: 20 },
                                        768: { slidesPerView: 2, spaceBetween: 30 },
                                        1024: { slidesPerView: 3, spaceBetween: 40 },
                                    }}
                                    className="projects-swiper-home"
                                >
                                    {projects.map((project, index) => (
                                        <SwiperSlide key={project._id} className="max-w-sm mx-auto">
                                            <ProjectCard
                                                project={project}
                                                index={index}
                                                isSwiper={true}
                                                onOpen={setSelectedProject}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* View All CTA */}
                                <div className="text-center mt-4">
                                    <Link to="/projects" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                                            style={{ background: 'linear-gradient(to right, #8B4513, #FF8C00)' }}
                                        >
                                            <Layers size={17} />
                                            View All Projects
                                            <ArrowRight size={17} />
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Code size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Projects Yet</h3>
                                <p className="text-gray-400">Projects are being updated. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Modal */}
                {selectedProject && (
                    <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
                )}

                {/* Swiper styles */}
                <style>{`
                    .projects-swiper-home {
                        padding: 20px 10px 60px;
                    }
                    .projects-swiper-home .swiper-slide {
                        width: 300px;
                        transition: transform 0.3s ease, opacity 0.3s ease;
                        opacity: 1;
                    }
                    @media (min-width: 640px) {
                        .projects-swiper-home .swiper-slide { width: 350px; }
                    }
                    @media (min-width: 768px) {
                        .projects-swiper-home .swiper-slide { width: 380px; }
                    }
                    .projects-swiper-home .swiper-button-next,
                    .projects-swiper-home .swiper-button-prev {
                        color: #7B3B0A;
                        background: rgba(255,255,255,0.92);
                        backdrop-filter: blur(10px);
                        width: 38px;
                        height: 38px;
                        border-radius: 50%;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        border: 1px solid #F5A62330;
                    }
                    .projects-swiper-home .swiper-button-next:after,
                    .projects-swiper-home .swiper-button-prev:after {
                        font-size: 14px;
                        font-weight: 700;
                    }
                    .projects-swiper-home .swiper-pagination-bullet {
                        background: #F5A62360;
                        opacity: 1;
                        width: 8px;
                        height: 8px;
                        margin: 0 4px;
                    }
                    .projects-swiper-home .swiper-pagination-bullet-active {
                        background: #7B3B0A;
                        width: 24px;
                        border-radius: 10px;
                    }
                `}</style>
            </>
        );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // FULL PAGE — grid layout, all details
    // ──────────────────────────────────────────────────────────────────────────
    return (
        <>
            <section id="projects" className="pt-20 mt-4 px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-7xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
                    }}
                >
                    {/* Header */}
                    <motion.div variants={projectVariants} className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Projects</span>
                        </h2>
                        <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            A complete portfolio of projects
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            {projects.length} project{projects.length !== 1 ? 's' : ''} available
                        </p>
                    </motion.div>

                    {projects.length > 0 ? (
                        <>
                            {/* Desktop / Tablet grid */}
                            <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {projects.map((project, index) => (
                                    <motion.div key={project._id} variants={projectVariants}>
                                        <ProjectCard
                                            project={project}
                                            index={index}
                                            onOpen={setSelectedProject}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Mobile grid */}
                            <div className="grid grid-cols-1 gap-6 md:hidden">
                                {projects.map((project, index) => (
                                    <motion.div key={project._id} variants={projectVariants}>
                                        <ProjectCard
                                            project={project}
                                            index={index}
                                            onOpen={setSelectedProject}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <motion.div variants={projectVariants} className="text-center py-20">
                            <Code size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Projects Available</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Projects are being updated. Check back soon!
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </section>

            {/* Modal */}
            {selectedProject && (
                <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
        </>
    );
};

export default Projects;
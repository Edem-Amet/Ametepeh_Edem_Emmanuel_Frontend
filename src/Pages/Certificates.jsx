import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaArrowRight, FaTimes, FaAward } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────
// CERTIFICATE DATA — add more objects here as you earn them
// ─────────────────────────────────────────────
import cert1 from '../assets/html_css_js.png'; // Getting Started with Git and GitHub
import cert2 from '../assets/data_structures.png'; // Data Structures
import cert3 from '../assets/algo_strings.png'; // Algorithms on Strings
import cert4 from '../assets/intro_cloud_computing.png'; // Introduction to Cloud Computing
import cert5 from '../assets/intro_to_SE.png'; // IBM Introduction to Software Engineering
import cert6 from '../assets/algorithm_on_graphs.png'; // Algorithm on Graphs
import cert7 from '../assets/Algorithm_toolbox.png'; // Algorithmic Toolbox
import cert8 from '../assets/graph.png'; // Foundations of UX Design

const certificates = [
    {
        id: 1,
        title: "Getting Started with Git and GitHub",
        issuer: "IBM",
        category: "Developer Tools",
        date: "2024",
        image: cert1,
        description:
            "Completed IBM's hands-on course covering version control fundamentals, Git workflows, branching strategies, and collaborative development on GitHub. Gained practical experience using Git commands and managing repositories.",
        skills: ["Git", "GitHub", "Version Control", "Branching & Merging", "Pull Requests", "Open Source Collaboration"],
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/MRV48JYD8YVR",
    },
    {
        id: 2,
        title: "Data Structures",
        issuer: "University of California San Diego",
        category: "Computer Science",
        date: "2024",
        image: cert2,
        description:
            "Mastered core data structures including arrays, linked lists, stacks, queues, trees, heaps, and hash tables through UC San Diego's rigorous curriculum. Applied these structures to design efficient algorithms and solve complex computational problems.",
        skills: ["Arrays & Linked Lists", "Trees & Heaps", "Hash Tables", "Stacks & Queues", "Algorithm Design", "Time Complexity"],
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/WLIE8KEJEUUU",
    },
    {
        id: 3,
        title: "Algorithms on Strings",
        issuer: "University of California San Diego",
        category: "Computer Science",
        date: "2024",
        image: cert3,
        description:
            "Studied advanced string processing algorithms including pattern matching, suffix arrays, Burrows-Wheeler transform, and sequence alignment. Applied techniques used in bioinformatics, search engines, and data compression.",
        skills: ["Pattern Matching", "Suffix Arrays", "Suffix Trees", "Burrows-Wheeler Transform", "String Alignment", "Dynamic Programming"],
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/EXA9FJVQSC7B",
    },
    {
        id: 4,
        title: "Introduction to Cloud Computing",
        issuer: "IBM",
        category: "Cloud & DevOps",
        date: "2024",
        image: cert4,
        description:
            "Gained a solid foundation in cloud computing concepts, service models (IaaS, PaaS, SaaS), deployment models, and emerging cloud technologies. Explored key providers and understood how cloud infrastructure supports modern applications.",
        skills: ["Cloud Fundamentals", "IaaS / PaaS / SaaS", "Public & Private Cloud", "Cloud Security", "Microservices", "Serverless Computing"],
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/OPJZ363E6JM8",
    },
    {
        id: 5,
        title: "Introduction to Software Engineering",
        issuer: "IBM",
        category: "Software Engineering",
        date: "2024",
        image: cert5,
        description:
            "Completed IBM's introduction to software engineering covering the SDLC, agile methodologies, software architecture, design patterns, and career pathways in the field. Built a foundational understanding of how professional software is conceived, built, and maintained.",
        skills: ["SDLC", "Agile & Scrum", "Software Architecture", "Design Patterns", "DevOps Basics", "Career in Tech"],
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/QXUI8NA0PL7U",
    },
    {
        id: 6,
        title: "Algorithms on Graphs",
        issuer: "University of California San Diego",
        category: "Computer Science",
        date: "2024",
        image: cert6,
        description:
            "Explored graph theory and algorithms including BFS, DFS, shortest paths (Dijkstra, Bellman-Ford), minimum spanning trees, and strongly connected components. Applied graph algorithms to real-world network and routing problems.",
        skills: ["BFS & DFS", "Dijkstra's Algorithm", "Bellman-Ford", "Minimum Spanning Trees", "Topological Sort", "Strongly Connected Components"],
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/7EB6LCY836YJ",
    },
    {
        id: 7,
        title: "Algorithmic Toolbox",
        issuer: "University of California San Diego",
        category: "Computer Science",
        date: "2024",
        image: cert7,
        description:
            "Built a strong algorithmic thinking toolkit covering greedy algorithms, divide-and-conquer, dynamic programming, and algorithm analysis. Solved a wide range of programming challenges to sharpen problem-solving skills.",
        skills: ["Greedy Algorithms", "Divide & Conquer", "Dynamic Programming", "Recursion", "Big-O Analysis", "Problem Solving"],
        credentialUrl: "https://www.coursera.org/account/accomplishments/verify/ELPFP4P89W2P",
    },
    {
        id: 8,
        title: "Foundations of User Experience (UX) Design",
        issuer: "Google",
        category: "UI/UX Design",
        date: "2024",
        image: cert8,
        description:
            "Completed Google's foundational UX design course covering the design thinking process, user research methods, wireframing, prototyping, and accessibility principles. Developed an understanding of what makes products useful, equitable, and enjoyable.",
        skills: ["Design Thinking", "User Research", "Wireframing", "Prototyping", "Accessibility", "Usability Testing"],
        credentialUrl: "https://www.coursera.org/account/accomplishments/records/W9K6L44ETELW",
    },
    // ── Add more certificates below ──
    // {
    //   id: 9,
    //   title: "Certificate Title",
    //   issuer: "Issuer Name",
    //   category: "Category",
    //   date: "2024",
    //   image: cert9,
    //   description: "Short description of what you learned.",
    //   skills: ["Skill 1", "Skill 2"],
    //   credentialUrl: "",
    // },
];

// ─────────────────────────────────────────────
// SHARED CARD MODAL
// ─────────────────────────────────────────────
const CertModal = ({ cert, onClose }) => {
    if (!cert) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.75)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.85, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.85, opacity: 0, y: 30 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                >
                    {/* Certificate image */}
                    <div className="relative">
                        {cert.image ? (
                            <img
                                src={cert.image}
                                alt={cert.title}
                                className="w-full h-56 sm:h-72 object-cover"
                            />
                        ) : (
                            <div
                                className="w-full h-56 sm:h-72 flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #7B3B0A22, #F5A62322)' }}
                            >
                                <FaAward className="text-7xl text-secondary opacity-40" />
                            </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 p-5">
                            <span className="text-xs font-semibold uppercase tracking-widest text-orange-300 mb-1 block">
                                {cert.category}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                                {cert.title}
                            </h3>
                            <p className="text-sm text-white/80 mt-1">{cert.issuer} · {cert.date}</p>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Details */}
                    <div className="p-6 overflow-y-auto flex-1">
                        <p className="text-gray-600 text-sm leading-relaxed mb-5">
                            {cert.description}
                        </p>

                        {cert.skills?.length > 0 && (
                            <div className="mb-5">
                                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                    Skills Acquired
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {cert.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                background: 'linear-gradient(to right, #7B3B0A18, #F5A62318)',
                                                color: '#7B3B0A',
                                                border: '1px solid #F5A62340',
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {cert.credentialUrl && (
                            <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:shadow-lg hover:scale-105"
                                style={{ background: 'linear-gradient(to right, #7B3B0A, #F5A623)' }}
                            >
                                Verify Credential <FaExternalLinkAlt className="text-xs" />
                            </a>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ─────────────────────────────────────────────
// HOMEPAGE — AUTO-SLIDING CAROUSEL
// ─────────────────────────────────────────────
const CertCarousel = () => {
    const trackRef = useRef(null);
    const [selected, setSelected] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate items for seamless infinite scroll
    const doubled = [...certificates, ...certificates];

    return (
        <section className="pt-20 mt-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <motion.div
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Certificates &amp;{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Achievements
                        </span>
                    </h2>
                    <p className="text-md text-gray-500 max-w-xl mx-auto">
                        Credentials I've earned along the way
                    </p>
                </div>

                {/* Scrolling track */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Fade edges */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to right, white, transparent)' }}
                    />
                    <div
                        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to left, white, transparent)' }}
                    />

                    <div className="overflow-hidden">
                        <div
                            ref={trackRef}
                            className="flex gap-5"
                            style={{
                                animation: isPaused
                                    ? 'none'
                                    : `certScroll ${certificates.length * 6}s linear infinite`,
                                width: 'max-content',
                            }}
                        >
                            {doubled.map((cert, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -6, scale: 1.03 }}
                                    onClick={() => setSelected(cert)}
                                    className="cursor-pointer flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
                                >
                                    {/* Image or placeholder */}
                                    {cert.image ? (
                                        <img
                                            src={cert.image}
                                            alt={cert.title}
                                            className="w-full h-40 object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-40 flex items-center justify-center"
                                            style={{ background: 'linear-gradient(135deg, #7B3B0A14, #F5A62314)' }}
                                        >
                                            <FaAward className="text-5xl text-secondary opacity-50" />
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <span
                                            className="text-xs font-semibold uppercase tracking-widest mb-1 block"
                                            style={{ color: '#F5A623' }}
                                        >
                                            {cert.category}
                                        </span>
                                        <h4 className="text-sm font-bold text-gray-800 leading-snug mb-1 line-clamp-2">
                                            {cert.title}
                                        </h4>
                                        <p className="text-xs text-gray-500">{cert.issuer} · {cert.date}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-10 text-center">
                    <Link
                        to="/certificates"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl font-medium text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                        style={{ background: 'linear-gradient(to right, #8B4513, #FF8C00)' }}
                    >
                        View All Certificates
                        <FaArrowRight className="text-sm" />
                    </Link>
                </div>
            </motion.div>

            {/* Keyframe CSS */}
            <style>{`
                @keyframes certScroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>

            {/* Modal */}
            {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
        </section>
    );
};

// ─────────────────────────────────────────────
// FULL CERTIFICATES PAGE
// ─────────────────────────────────────────────
const CertificatesPage = () => {
    const [selected, setSelected] = useState(null);

    const item = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
    };

    return (
        <section className="pt-20 mt-4 px-4 sm:px-6 lg:px-8 min-h-screen">
            <motion.div
                className="max-w-6xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
                }}
            >
                {/* Header */}
                <motion.div variants={item} className="text-center mb-14">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                        style={{
                            background: 'linear-gradient(to right, #7B3B0A15, #F5A62315)',
                            color: '#7B3B0A',
                            border: '1px solid #F5A62340',
                        }}
                    >
                        <FaAward /> Verified Credentials
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        My{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Certificates
                        </span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        A collection of certifications and achievements that reflect my commitment to continuous learning and professional development.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <div
                            className="h-1 w-12 rounded-full"
                            style={{ background: 'linear-gradient(to right, #7B3B0A, #F5A623)' }}
                        />
                        <div className="h-1 w-4 rounded-full bg-gray-200" />
                        <div className="h-1 w-2 rounded-full bg-gray-100" />
                    </div>
                </motion.div>

                {/* Count badge */}
                <motion.div variants={item} className="mb-8 flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
                    </span>
                    <div className="flex-1 h-px bg-gray-100" />
                </motion.div>

                {/* Grid — 2 cols on sm, 3 cols on lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            variants={item}
                            whileHover={{ y: -8 }}
                            onClick={() => setSelected(cert)}
                            className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-50 flex flex-col"
                        >
                            {/* Image / placeholder */}
                            <div className="relative overflow-hidden">
                                {cert.image ? (
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-48 flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #7B3B0A18, #F5A62318)' }}
                                    >
                                        <FaAward className="text-6xl text-secondary opacity-40 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                                        View Details <FaArrowRight className="text-xs" />
                                    </span>
                                </div>

                                {/* Category tag */}
                                <div
                                    className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full"
                                    style={{
                                        background: 'rgba(255,255,255,0.92)',
                                        color: '#7B3B0A',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    {cert.category}
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-primary transition-colors">
                                        {cert.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-3">
                                        {cert.issuer} · {cert.date}
                                    </p>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                                        {cert.description}
                                    </p>

                                    {/* Skill pills — show first 3 */}
                                    {cert.skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {cert.skills.slice(0, 3).map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                                                    style={{
                                                        background: '#F5A62318',
                                                        color: '#7B3B0A',
                                                        border: '1px solid #F5A62335',
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {cert.skills.length > 3 && (
                                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                                                    +{cert.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Bottom divider + issuer logo placeholder */}
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center"
                                            style={{ background: 'linear-gradient(135deg, #7B3B0A, #F5A623)' }}
                                        >
                                            <FaAward className="text-white text-xs" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">{cert.issuer}</span>
                                    </div>
                                    {cert.credentialUrl && (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={e => e.stopPropagation()}
                                            className="text-xs flex items-center gap-1 font-medium transition-colors"
                                            style={{ color: '#F5A623' }}
                                        >
                                            Verify <FaExternalLinkAlt className="text-xs" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {certificates.length === 0 && (
                    <motion.div variants={item} className="text-center py-24">
                        <FaAward className="text-6xl text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500">No certificates yet</h3>
                        <p className="text-gray-400 mt-2">Certificates will appear here once added.</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Modal */}
            {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
        </section>
    );
};

// ─────────────────────────────────────────────
// MAIN EXPORT — isHomepage switches between views
// ─────────────────────────────────────────────
const Certificates = ({ isHomepage = false }) => {
    return isHomepage ? <CertCarousel /> : <CertificatesPage />;
};

export default Certificates;
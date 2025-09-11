import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FaFilePdf, FaFilePowerpoint, FaFlask, FaMicroscope, FaSpinner } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const Research = () => {
    const [researchProjects, setResearchProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                when: "beforeChildren"
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    // Fetch research projects
    useEffect(() => {
        const fetchResearch = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${backendUrl}/api/research`);
                const data = await response.json();

                if (data.success) {
                    // Only show published research
                    const publishedResearch = data.data.filter(project => project.published);
                    setResearchProjects(publishedResearch);
                } else {
                    throw new Error(data.error || 'Failed to fetch research projects');
                }
            } catch (err) {
                console.error('Error fetching research:', err);
                setError('Failed to load research projects');
            } finally {
                setLoading(false);
            }
        };

        fetchResearch();
    }, [backendUrl]);

    // Helper function to get file icon based on URL extension or title
    const getFileIcon = (title, url) => {
        const lowerTitle = title.toLowerCase();
        const lowerUrl = url.toLowerCase();

        if (lowerTitle.includes('poster') || lowerTitle.includes('presentation') ||
            lowerUrl.includes('.ppt') || lowerUrl.includes('.pptx')) {
            return <FaFilePowerpoint className="text-xl" />;
        }
        return <FaFilePdf className="text-xl" />;
    };

    // Helper function to get file background color
    const getFileIconBg = (title, url) => {
        const lowerTitle = title.toLowerCase();
        const lowerUrl = url.toLowerCase();

        if (lowerTitle.includes('poster') || lowerTitle.includes('presentation') ||
            lowerUrl.includes('.ppt') || lowerUrl.includes('.pptx')) {
            return 'bg-red-100 text-red-600';
        }
        return 'bg-blue-100 text-blue-600';
    };

    // Loading state
    if (loading) {
        return (
            <section id="research" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
                        <p className="text-xl text-gray-600">Loading research projects...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section id="research" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        <p className="text-xl text-red-600 mb-4">Error loading research projects</p>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    // Get the most recent published research project
    const currentResearch = researchProjects.length > 0 ? researchProjects[0] : null;

    // Check if there's a next project to show
    const hasNextProject = currentResearch?.nextProject?.title && currentResearch?.nextProject?.description;

    return (
        <section id="research" className="pt-20 sm:pt-20 mt-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted">
            <motion.div
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <motion.div variants={item} className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mb-6">
                        Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Work</span>
                    </h1>
                    <p className="text-md text-gray-600 max-w-3xl mx-auto">
                        Exploring scientific frontiers through physics and computing
                    </p>
                </motion.div>

                {/* No Research State */}
                {!currentResearch && (
                    <motion.div variants={item} className="text-center py-12">
                        <FaMicroscope className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-600 mb-2">No published research yet</h3>
                        <p className="text-gray-500">Research projects will appear here when published.</p>
                    </motion.div>
                )}

                {/* Current Research */}
                {currentResearch && (
                    <motion.div variants={item} className="mb-20">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Cover Image with Hover Effect */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative h-64 sm:h-80 overflow-hidden"
                            >
                                {currentResearch.mainImage?.url ? (
                                    <img
                                        src={currentResearch.mainImage.url}
                                        alt={currentResearch.mainImage.altText || currentResearch.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                        <FaMicroscope className="text-6xl text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex items-end p-6">
                                    <div>
                                        {currentResearch.statusTag && (
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-sm mb-3">
                                                <FaMicroscope className="mr-2" /> {currentResearch.statusTag}
                                            </div>
                                        )}
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                            {currentResearch.title}
                                        </h2>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="p-6 sm:p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Main Content */}
                                    <div className="lg:col-span-2">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Overview</h3>
                                        <p className="text-gray-600 mb-6">
                                            {currentResearch.overview || 'No overview provided.'}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                            {/* Collaborators */}
                                            {currentResearch.collaborators && currentResearch.collaborators.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                                        Collaborators
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {currentResearch.collaborators.map((person, i) => (
                                                            <div key={i} className="bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-2 rounded-lg border-l-4 border-primary">
                                                                <div className="font-medium text-gray-800">{person.name}</div>
                                                                {person.role && <div className="text-sm text-primary/80">{person.role}</div>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Supervisors */}
                                            {currentResearch.supervisors && currentResearch.supervisors.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                                        Supervisors
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {currentResearch.supervisors.map((person, i) => (
                                                            <div key={i} className="bg-gradient-to-r from-secondary/10 to-secondary/5 px-3 py-2 rounded-lg border-l-4 border-secondary">
                                                                <div className="font-medium text-gray-800">{person.name}</div>
                                                                {person.role && <div className="text-sm text-secondary/80">{person.role}</div>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Key Methods */}
                                        {currentResearch.keyMethods && currentResearch.keyMethods.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                                    Key Methods
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {currentResearch.keyMethods.map((method, i) => (
                                                        method.url ? (
                                                            <motion.a
                                                                key={i}
                                                                href={method.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                whileHover={{ scale: 1.05 }}
                                                                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                                                            >
                                                                {method.label}
                                                                <FiExternalLink className="ml-1 text-xs" />
                                                            </motion.a>
                                                        ) : (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm"
                                                            >
                                                                {method.label}
                                                            </span>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sidebar with Links */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            {/* Research Materials */}
                                            {currentResearch.researchMaterials && currentResearch.researchMaterials.length > 0 && (
                                                <div className="mb-6">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Research Materials</h3>
                                                    <div className="space-y-3">
                                                        {currentResearch.researchMaterials.map((material, i) => (
                                                            <motion.a
                                                                key={i}
                                                                whileHover={{ x: 5 }}
                                                                href={material.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                                                            >
                                                                <div className="flex items-center">
                                                                    <div className={`p-2 rounded-md mr-3 ${getFileIconBg(material.title, material.url)}`}>
                                                                        {getFileIcon(material.title, material.url)}
                                                                    </div>
                                                                    <span className="font-medium text-gray-700">{material.title}</span>
                                                                </div>
                                                                <FiExternalLink className="text-gray-400" />
                                                            </motion.a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Key Findings */}
                                            {currentResearch.keyFindings && (
                                                <div className={`${currentResearch.researchMaterials?.length > 0 ? 'pt-6 border-t border-gray-200' : ''}`}>
                                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                                        Key Finding
                                                    </h4>
                                                    <p className="text-gray-600">
                                                        {currentResearch.keyFindings}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Future Research */}
                {hasNextProject && (
                    <motion.div variants={item}>
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 sm:p-12 rounded-2xl text-center">
                            <div className="max-w-2xl mx-auto">
                                {currentResearch.nextProject.comingSoon && (
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white text-primary text-sm mb-4 shadow-sm">
                                        <FaFlask className="mr-2" /> Coming Soon
                                    </div>
                                )}
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                    {currentResearch.nextProject.title}
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    {currentResearch.nextProject.description}
                                </p>
                                {currentResearch.nextProject.notifyButton?.label && currentResearch.nextProject.notifyButton?.url && (
                                    <motion.a
                                        href={currentResearch.nextProject.notifyButton.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg font-medium"
                                    >
                                        {currentResearch.nextProject.notifyButton.label}
                                    </motion.a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Additional Research Projects */}
                {researchProjects.length > 1 && (
                    <motion.div variants={item} className="mt-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Research</h2>
                            <p className="text-gray-600">Explore my other research projects</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {researchProjects.slice(1).map((project) => (
                                <motion.div
                                    key={project._id}
                                    variants={item}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="relative h-48">
                                        {project.mainImage?.url ? (
                                            <img
                                                src={project.mainImage.url}
                                                alt={project.mainImage.altText || project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                                <FaMicroscope className="text-4xl text-gray-400" />
                                            </div>
                                        )}
                                        {project.statusTag && (
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-white rounded-full text-xs font-medium">
                                                {project.statusTag}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {project.overview}
                                        </p>

                                        {/* Quick stats */}
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center space-x-4">
                                                {project.collaborators?.length > 0 && (
                                                    <span>{project.collaborators.length} Collaborator{project.collaborators.length > 1 ? 's' : ''}</span>
                                                )}
                                                {project.researchMaterials?.length > 0 && (
                                                    <span>{project.researchMaterials.length} Material{project.researchMaterials.length > 1 ? 's' : ''}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
};

export default Research;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Upload, ImageIcon, Users, BookOpen, FileText, Link as LinkIcon, Award, ArrowRight } from 'lucide-react';

const ManageResearch = () => {
    const [research, setResearch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResearch, setEditingResearch] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        statusTag: '',
        overview: '',
        collaborators: [{ name: '', role: '' }],
        supervisors: [{ name: '', role: '' }],
        keyMethods: [{ label: '', url: '' }],
        researchMaterials: [{ title: '', url: '' }],
        keyFindings: '',
        nextProject: {
            title: '',
            description: '',
            comingSoon: false,
            notifyButton: { label: '', url: '' }
        },
        published: false
    });
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Fetch research projects
    useEffect(() => {
        fetchResearch();
    }, []);

    const fetchResearch = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/research`);
            const data = await response.json();

            if (data.success) {
                setResearch(data.data || []);
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

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            statusTag: '',
            overview: '',
            collaborators: [{ name: '', role: '' }],
            supervisors: [{ name: '', role: '' }],
            keyMethods: [{ label: '', url: '' }],
            researchMaterials: [{ title: '', url: '' }],
            keyFindings: '',
            nextProject: {
                title: '',
                description: '',
                comingSoon: false,
                notifyButton: { label: '', url: '' }
            },
            published: false
        });
        setMainImageFile(null);
        setMainImagePreview('');
        setEditingResearch(null);
    };

    // Handle file selection
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setMainImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Handle array field changes
    const handleArrayFieldChange = (field, index, key, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) =>
                i === index ? { ...item, [key]: value } : item
            )
        }));
    };

    // Add array item
    const addArrayItem = (field, defaultItem) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultItem]
        }));
    };

    // Remove array item
    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    // Handle next project change
    const handleNextProjectChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            nextProject: {
                ...prev.nextProject,
                [key]: value
            }
        }));
    };

    // Handle next project notify button change
    const handleNotifyButtonChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            nextProject: {
                ...prev.nextProject,
                notifyButton: {
                    ...prev.nextProject.notifyButton,
                    [key]: value
                }
            }
        }));
    };

    // Open modal for create/edit
    const openModal = (researchProject = null) => {
        if (researchProject) {
            setEditingResearch(researchProject);
            setFormData({
                title: researchProject.title || '',
                statusTag: researchProject.statusTag || '',
                overview: researchProject.overview || '',
                collaborators: researchProject.collaborators?.length > 0 ? researchProject.collaborators : [{ name: '', role: '' }],
                supervisors: researchProject.supervisors?.length > 0 ? researchProject.supervisors : [{ name: '', role: '' }],
                keyMethods: researchProject.keyMethods?.length > 0 ? researchProject.keyMethods : [{ label: '', url: '' }],
                researchMaterials: researchProject.researchMaterials?.length > 0 ? researchProject.researchMaterials : [{ title: '', url: '' }],
                keyFindings: researchProject.keyFindings || '',
                nextProject: {
                    title: researchProject.nextProject?.title || '',
                    description: researchProject.nextProject?.description || '',
                    comingSoon: researchProject.nextProject?.comingSoon || false,
                    notifyButton: {
                        label: researchProject.nextProject?.notifyButton?.label || '',
                        url: researchProject.nextProject?.notifyButton?.url || ''
                    }
                },
                published: researchProject.published || false
            });
            setMainImagePreview(researchProject.mainImage?.url || '');
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('statusTag', formData.statusTag);
            formDataToSend.append('overview', formData.overview);
            formDataToSend.append('keyFindings', formData.keyFindings);
            formDataToSend.append('published', formData.published);

            // Append collaborators
            formData.collaborators.forEach((collaborator, index) => {
                formDataToSend.append(`collaborators[${index}][name]`, collaborator.name);
                formDataToSend.append(`collaborators[${index}][role]`, collaborator.role);
            });

            // Append supervisors
            formData.supervisors.forEach((supervisor, index) => {
                formDataToSend.append(`supervisors[${index}][name]`, supervisor.name);
                formDataToSend.append(`supervisors[${index}][role]`, supervisor.role);
            });

            // Append key methods
            formData.keyMethods.forEach((method, index) => {
                formDataToSend.append(`keyMethods[${index}][label]`, method.label);
                formDataToSend.append(`keyMethods[${index}][url]`, method.url);
            });

            // Append research materials
            formData.researchMaterials.forEach((material, index) => {
                formDataToSend.append(`researchMaterials[${index}][title]`, material.title);
                formDataToSend.append(`researchMaterials[${index}][url]`, material.url);
            });

            // Append next project
            formDataToSend.append('nextProject[title]', formData.nextProject.title);
            formDataToSend.append('nextProject[description]', formData.nextProject.description);
            formDataToSend.append('nextProject[comingSoon]', formData.nextProject.comingSoon);
            formDataToSend.append('nextProject[notifyButton][label]', formData.nextProject.notifyButton.label);
            formDataToSend.append('nextProject[notifyButton][url]', formData.nextProject.notifyButton.url);

            if (mainImageFile) {
                formDataToSend.append('mainImage', mainImageFile);
            }

            const url = editingResearch
                ? `${backendUrl}/api/research/${editingResearch._id}`
                : `${backendUrl}/api/research`;

            const method = editingResearch ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });

            const data = await response.json();

            if (data.success) {
                await fetchResearch();
                closeModal();
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to save research project');
            }
        } catch (err) {
            console.error('Error saving research:', err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete research
    const handleDelete = async (researchId) => {
        try {
            const response = await fetch(`${backendUrl}/api/research/${researchId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                await fetchResearch();
                setDeleteConfirm(null);
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to delete research project');
            }
        } catch (err) {
            console.error('Error deleting research:', err);
            setError(err.message);
        }
    };

    // Toggle research status
    const toggleStatus = async (researchProject) => {
        try {
            const formData = new FormData();
            formData.append('title', researchProject.title || '');
            formData.append('statusTag', researchProject.statusTag || '');
            formData.append('overview', researchProject.overview || '');
            formData.append('keyFindings', researchProject.keyFindings || '');
            formData.append('collaborators', JSON.stringify(researchProject.collaborators || []));
            formData.append('supervisors', JSON.stringify(researchProject.supervisors || []));
            formData.append('keyMethods', JSON.stringify(researchProject.keyMethods || []));
            formData.append('researchMaterials', JSON.stringify(researchProject.researchMaterials || []));
            formData.append('nextProject', JSON.stringify(researchProject.nextProject || {}));
            formData.append('published', !researchProject.published);

            const response = await fetch(`${backendUrl}/api/research/${researchProject._id}`, {
                method: 'PUT',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                await fetchResearch();
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to update research status');
            }
        } catch (err) {
            console.error('Error updating research status:', err);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg font-medium text-secondary">Loading Research Projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary">Manage Research Projects</h1>
                        <p className="text-gray-600 mt-2">Create and manage your research portfolio</p>
                    </div>
                    <motion.button
                        onClick={() => openModal()}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={20} />
                        <span>Add New Research</span>
                    </motion.button>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Research Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {research.map((project) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                        >
                            {/* Research Image */}
                            <div className="relative h-48 bg-gray-200">
                                {project.mainImage?.url ? (
                                    <img
                                        src={project.mainImage.url}
                                        alt={project.mainImage.altText || project.title || 'Research'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <BookOpen size={48} />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${project.published
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {project.published ? 'Published' : 'Draft'}
                                </div>

                                {/* Status Tag */}
                                {project.statusTag && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-white rounded-full text-xs font-medium">
                                        {project.statusTag}
                                    </div>
                                )}
                            </div>

                            {/* Research Content */}
                            <div className="p-4">
                                <div className="mb-2">
                                    <h3 className="text-lg font-semibold text-secondary line-clamp-2">
                                        {project.title || 'No Title'}
                                    </h3>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {project.overview || 'No overview provided'}
                                </p>

                                {/* Collaborators & Supervisors */}
                                <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                                    {project.collaborators && project.collaborators.length > 0 && (
                                        <div className="flex items-center">
                                            <Users size={12} className="mr-1" />
                                            <span>{project.collaborators.length} Collaborator{project.collaborators.length > 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                    {project.supervisors && project.supervisors.length > 0 && (
                                        <div className="flex items-center">
                                            <Award size={12} className="mr-1" />
                                            <span>{project.supervisors.length} Supervisor{project.supervisors.length > 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Research Materials Preview */}
                                {project.researchMaterials && project.researchMaterials.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {project.researchMaterials.slice(0, 2).map((material, index) => (
                                            <div key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs flex items-center">
                                                <FileText size={10} className="mr-1" />
                                                {material.title}
                                            </div>
                                        ))}
                                        {project.researchMaterials.length > 2 && (
                                            <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
                                                +{project.researchMaterials.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openModal(project)}
                                            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Research"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(project)}
                                            className={`p-2 rounded-lg transition-colors ${project.published
                                                ? 'text-red-600 hover:bg-red-50'
                                                : 'text-green-600 hover:bg-green-50'
                                                }`}
                                            title={project.published ? 'Unpublish' : 'Publish'}
                                        >
                                            {project.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(project._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Research"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {research.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-secondary mb-2">No research projects found</h3>
                        <p className="text-gray-600 mb-6">Create your first research project to get started</p>
                        <button
                            onClick={() => openModal()}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg"
                        >
                            Add New Research
                        </button>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-secondary">
                                    {editingResearch ? 'Edit Research Project' : 'Create New Research Project'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-secondary">Basic Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Research Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="e.g., Spectroscopic Analysis of Local Alcoholic Bitters"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status Tag
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.statusTag}
                                                onChange={(e) => setFormData({ ...formData, statusTag: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="e.g., Active Research, Completed"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Overview
                                        </label>
                                        <textarea
                                            value={formData.overview}
                                            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                            placeholder="Provide a comprehensive overview of the research project..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Key Findings
                                        </label>
                                        <textarea
                                            value={formData.keyFindings}
                                            onChange={(e) => setFormData({ ...formData, keyFindings: e.target.value })}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                            placeholder="Summarize the key findings and results..."
                                        />
                                    </div>
                                </div>

                                {/* Collaborators */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-secondary">Collaborators</h3>
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('collaborators', { name: '', role: '' })}
                                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add Collaborator
                                        </button>
                                    </div>

                                    {formData.collaborators.map((collaborator, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={collaborator.name}
                                                    onChange={(e) => handleArrayFieldChange('collaborators', index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                    placeholder="Collaborator name"
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Role
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={collaborator.role}
                                                        onChange={(e) => handleArrayFieldChange('collaborators', index, 'role', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                        placeholder="e.g., Research Assistant"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('collaborators', index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        disabled={formData.collaborators.length === 1}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Supervisors */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-secondary">Supervisors</h3>
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('supervisors', { name: '', role: '' })}
                                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add Supervisor
                                        </button>
                                    </div>

                                    {formData.supervisors.map((supervisor, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={supervisor.name}
                                                    onChange={(e) => handleArrayFieldChange('supervisors', index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                    placeholder="Supervisor name"
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Role
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={supervisor.role}
                                                        onChange={(e) => handleArrayFieldChange('supervisors', index, 'role', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                        placeholder="e.g., Principal Investigator"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('supervisors', index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        disabled={formData.supervisors.length === 1}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Key Methods */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-secondary">Key Methods</h3>
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('keyMethods', { label: '', url: '' })}
                                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add Method
                                        </button>
                                    </div>

                                    {formData.keyMethods.map((method, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Method Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={method.label}
                                                    onChange={(e) => handleArrayFieldChange('keyMethods', index, 'label', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                    placeholder="e.g., Partial Least Squares Regression"
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Reference URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={method.url}
                                                        onChange={(e) => handleArrayFieldChange('keyMethods', index, 'url', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                        placeholder="https://example.com/method-info"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('keyMethods', index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        disabled={formData.keyMethods.length === 1}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Research Materials */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-secondary">Research Materials</h3>
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('researchMaterials', { title: '', url: '' })}
                                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add Material
                                        </button>
                                    </div>

                                    {formData.researchMaterials.map((material, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Material Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={material.title}
                                                    onChange={(e) => handleArrayFieldChange('researchMaterials', index, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                    placeholder="e.g., Poster Presentation, Full Paper"
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Material URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={material.url}
                                                        onChange={(e) => handleArrayFieldChange('researchMaterials', index, 'url', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                        placeholder="https://example.com/material"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('researchMaterials', index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        disabled={formData.researchMaterials.length === 1}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Next Project */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-secondary">Next Project (Optional)</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Next Project Title
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nextProject.title}
                                                onChange={(e) => handleNextProjectChange('title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="e.g., Advanced Spectroscopic Techniques"
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Coming Soon Status</h4>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm text-gray-600">Regular</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleNextProjectChange('comingSoon', !formData.nextProject.comingSoon)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.nextProject.comingSoon ? 'bg-primary' : 'bg-gray-200'}`}
                                                    >
                                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.nextProject.comingSoon ? 'translate-x-6' : 'translate-x-1'}`} />
                                                    </button>
                                                    <span className="text-sm text-gray-600">Coming Soon</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Next Project Description
                                        </label>
                                        <textarea
                                            value={formData.nextProject.description}
                                            onChange={(e) => handleNextProjectChange('description', e.target.value)}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                            placeholder="Brief description of the upcoming project..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notify Button Label
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nextProject.notifyButton.label}
                                                onChange={(e) => handleNotifyButtonChange('label', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="e.g., Get Notified"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notify Button URL
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.nextProject.notifyButton.url}
                                                onChange={(e) => handleNotifyButtonChange('url', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="https://example.com/notify"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Main Image Upload */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-secondary">Main Image</h3>

                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 relative">
                                        {mainImagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={mainImagePreview}
                                                    alt="Preview"
                                                    className="w-full h-64 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMainImageFile(null);
                                                        setMainImagePreview('');
                                                    }}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                                                <p className="text-gray-600 mb-2">Click to upload main image</p>
                                                <p className="text-sm text-gray-500">Supports JPG, PNG, GIF, WebP (Max 10MB)</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={handleMainImageChange}
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Published Toggle */}
                                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                                    <div>
                                        <h4 className="text-lg font-medium text-secondary">Publication Status</h4>
                                        <p className="text-sm text-gray-500">Control whether this research project is visible to visitors</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-600">Draft</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, published: !formData.published })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.published ? 'bg-primary' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.published ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <span className="text-sm text-gray-600">Published</span>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                                    >
                                        {submitting && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                        )}
                                        <Save size={16} />
                                        <span>{submitting ? 'Saving...' : (editingResearch ? 'Update Research' : 'Create Research')}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 max-w-md w-full"
                    >
                        <h3 className="text-lg font-semibold text-secondary mb-4">
                            Delete Research Project
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this research project? This action cannot be undone and will permanently remove all associated data including images.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete Research
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageResearch;
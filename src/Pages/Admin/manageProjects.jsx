import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Upload, ImageIcon, Code, ExternalLink, FileText, Link as LinkIcon, ArrowRight } from 'lucide-react';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        techStack: [''],
        links: [{ label: '', url: '' }],
        published: false,
        orderIndex: 0
    });
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Fetch projects
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/projects`);
            const data = await response.json();

            if (data.success) {
                setProjects(data.data || []);
            } else {
                throw new Error(data.error || 'Failed to fetch projects');
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            techStack: [''],
            links: [{ label: '', url: '' }],
            published: false,
            orderIndex: 0
        });
        setMainImageFile(null);
        setMainImagePreview('');
        setEditingProject(null);
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

    // Handle tech stack changes
    const handleTechStackChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.map((tech, i) =>
                i === index ? value : tech
            )
        }));
    };

    // Add tech stack item
    const addTechStackItem = () => {
        setFormData(prev => ({
            ...prev,
            techStack: [...prev.techStack, '']
        }));
    };

    // Remove tech stack item
    const removeTechStackItem = (index) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter((_, i) => i !== index)
        }));
    };

    // Handle links changes
    const handleLinkChange = (index, key, value) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.map((link, i) =>
                i === index ? { ...link, [key]: value } : link
            )
        }));
    };

    // Add link item
    const addLinkItem = () => {
        setFormData(prev => ({
            ...prev,
            links: [...prev.links, { label: '', url: '' }]
        }));
    };

    // Remove link item
    const removeLinkItem = (index) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }));
    };

    // Open modal for create/edit
    const openModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title || '',
                description: project.description || '',
                techStack: project.techStack?.length > 0 ? project.techStack : [''],
                links: project.links?.length > 0 ? project.links : [{ label: '', url: '' }],
                published: project.published || false,
                orderIndex: project.orderIndex || 0
            });
            setMainImagePreview(project.mainImage?.url || '');
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
            formDataToSend.append('description', formData.description);
            formDataToSend.append('published', formData.published);
            formDataToSend.append('orderIndex', formData.orderIndex);

            // Append tech stack (filter out empty values)
            const filteredTechStack = formData.techStack.filter(tech => tech.trim() !== '');
            filteredTechStack.forEach((tech, index) => {
                formDataToSend.append(`techStack[${index}]`, tech);
            });

            // Append links (filter out empty values)
            const filteredLinks = formData.links.filter(link => link.label.trim() !== '' || link.url.trim() !== '');
            filteredLinks.forEach((link, index) => {
                formDataToSend.append(`links[${index}][label]`, link.label);
                formDataToSend.append(`links[${index}][url]`, link.url);
            });

            if (mainImageFile) {
                formDataToSend.append('mainImage', mainImageFile);
            }

            const url = editingProject
                ? `${backendUrl}/api/projects/${editingProject._id}`
                : `${backendUrl}/api/projects`;

            const method = editingProject ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });

            const data = await response.json();

            if (data.success) {
                await fetchProjects();
                closeModal();
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to save project');
            }
        } catch (err) {
            console.error('Error saving project:', err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete project
    const handleDelete = async (projectId) => {
        try {
            const response = await fetch(`${backendUrl}/api/projects/${projectId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                await fetchProjects();
                setDeleteConfirm(null);
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to delete project');
            }
        } catch (err) {
            console.error('Error deleting project:', err);
            setError(err.message);
        }
    };

    // Toggle project status
    const toggleStatus = async (project) => {
        try {
            const formData = new FormData();
            formData.append('title', project.title || '');
            formData.append('description', project.description || '');
            formData.append('orderIndex', project.orderIndex || 0);
            formData.append('published', !project.published);

            // Append existing tech stack
            if (project.techStack && project.techStack.length > 0) {
                project.techStack.forEach((tech, index) => {
                    formData.append(`techStack[${index}]`, tech);
                });
            }

            // Append existing links
            if (project.links && project.links.length > 0) {
                project.links.forEach((link, index) => {
                    formData.append(`links[${index}][label]`, link.label);
                    formData.append(`links[${index}][url]`, link.url);
                });
            }

            const response = await fetch(`${backendUrl}/api/projects/${project._id}`, {
                method: 'PUT',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                await fetchProjects();
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to update project status');
            }
        } catch (err) {
            console.error('Error updating project status:', err);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg font-medium text-secondary">Loading Projects...</p>
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
                        <h1 className="text-3xl font-bold text-secondary">Manage Projects</h1>
                        <p className="text-gray-600 mt-2">Create and manage your project portfolio</p>
                    </div>
                    <motion.button
                        onClick={() => openModal()}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={20} />
                        <span>Add New Project</span>
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

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                        >
                            {/* Project Image */}
                            <div className="relative h-48 bg-gray-200">
                                {project.mainImage?.url ? (
                                    <img
                                        src={project.mainImage.url}
                                        alt={project.mainImage.altText || project.title || 'Project'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Code size={48} />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${project.published
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {project.published ? 'Published' : 'Draft'}
                                </div>

                                {/* Order Index */}
                                <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-white rounded-full text-xs font-medium">
                                    #{project.orderIndex || 0}
                                </div>
                            </div>

                            {/* Project Content */}
                            <div className="p-4">
                                <div className="mb-2">
                                    <h3 className="text-lg font-semibold text-secondary line-clamp-2">
                                        {project.title || 'No Title'}
                                    </h3>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {project.description || 'No description provided'}
                                </p>

                                {/* Tech Stack Preview */}
                                {project.techStack && project.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {project.techStack.slice(0, 3).map((tech, index) => (
                                            <div key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                                {tech}
                                            </div>
                                        ))}
                                        {project.techStack.length > 3 && (
                                            <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
                                                +{project.techStack.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Links Preview */}
                                {project.links && project.links.length > 0 && (
                                    <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <LinkIcon size={12} className="mr-1" />
                                            <span>{project.links.length} Link{project.links.length > 1 ? 's' : ''}</span>
                                        </div>
                                        {project.links.some(link => link.label.toLowerCase().includes('demo') || link.label.toLowerCase().includes('live')) && (
                                            <div className="flex items-center">
                                                <ExternalLink size={12} className="mr-1" />
                                                <span>Live Demo</span>
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
                                            title="Edit Project"
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
                                            title="Delete Project"
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
                {projects.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Code size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-secondary mb-2">No projects found</h3>
                        <p className="text-gray-600 mb-6">Create your first project to get started</p>
                        <button
                            onClick={() => openModal()}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg"
                        >
                            Add New Project
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
                        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-secondary">
                                    {editingProject ? 'Edit Project' : 'Create New Project'}
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
                                                Project Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="e.g., Full E-Commerce Platform"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Order Index
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.orderIndex}
                                                onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                            placeholder="Complete online store with user accounts, payment processing, and admin dashboard..."
                                        />
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-secondary">Tech Stack</h3>
                                        <button
                                            type="button"
                                            onClick={addTechStackItem}
                                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add Technology
                                        </button>
                                    </div>

                                    {formData.techStack.map((tech, index) => (
                                        <div key={index} className="flex space-x-2">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={tech}
                                                    onChange={(e) => handleTechStackChange(index, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                    placeholder="e.g., React, Node.js, MongoDB"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeTechStackItem(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                disabled={formData.techStack.length === 1}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-secondary">Project Links</h3>
                                        <button
                                            type="button"
                                            onClick={addLinkItem}
                                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add Link
                                        </button>
                                    </div>

                                    {formData.links.map((link, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Label
                                                </label>
                                                <input
                                                    type="text"
                                                    value={link.label}
                                                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                    placeholder="e.g., View Code, Live Demo"
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={link.url}
                                                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                        placeholder="https://example.com"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLinkItem(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        disabled={formData.links.length === 1}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Image Upload */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-secondary">Project Image</h3>

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
                                                <p className="text-gray-600 mb-2">Click to upload project image</p>
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
                                        <p className="text-sm text-gray-500">Control whether this project is visible to visitors</p>
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
                                        <span>{submitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}</span>
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
                            Delete Project
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this project? This action cannot be undone and will permanently remove all associated data including images.
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
                                Delete Project
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageProjects;
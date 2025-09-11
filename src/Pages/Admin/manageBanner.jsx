import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, Upload, ImageIcon, Globe, Github, Linkedin, Twitter, Instagram } from 'lucide-react';

const ManageBanner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        headline: '',
        highlightedText: '',
        description: '',
        socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            instagram: '',
            website: ''
        },
        buttons: [
            { text: '', url: '', style: 'filled' },
            { text: '', url: '', style: 'outline' }
        ],
        stats: [
            { label: '', value: '' }
        ],
        published: false
    });
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Fetch banners
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/banner`);
            const data = await response.json();

            if (data.success) {
                setBanners(data.data || []);
            } else {
                throw new Error(data.error || 'Failed to fetch banners');
            }
        } catch (err) {
            console.error('Error fetching banners:', err);
            setError('Failed to load banners');
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            headline: '',
            highlightedText: '',
            description: '',
            socialLinks: {
                linkedin: '',
                github: '',
                twitter: '',
                instagram: '',
                website: ''
            },
            buttons: [
                { text: '', url: '', style: 'filled' },
                { text: '', url: '', style: 'outline' }
            ],
            stats: [
                { label: '', value: '' }
            ],
            published: false
        });
        setMainImageFile(null);
        setMainImagePreview('');
        setEditingBanner(null);
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

    // Handle social links change
    const handleSocialLinkChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value
            }
        }));
    };

    // Handle button change
    const handleButtonChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            buttons: prev.buttons.map((button, i) =>
                i === index ? { ...button, [field]: value } : button
            )
        }));
    };

    // Handle stats change
    const handleStatsChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            stats: prev.stats.map((stat, i) =>
                i === index ? { ...stat, [field]: value } : stat
            )
        }));
    };

    // Add new stat
    const addStat = () => {
        setFormData(prev => ({
            ...prev,
            stats: [...prev.stats, { label: '', value: '' }]
        }));
    };

    // Remove stat
    const removeStat = (index) => {
        setFormData(prev => ({
            ...prev,
            stats: prev.stats.filter((_, i) => i !== index)
        }));
    };

    // Open modal for create/edit
    const openModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                headline: banner.headline || '',
                highlightedText: banner.highlightedText || '',
                description: banner.description || '',
                socialLinks: {
                    linkedin: banner.socialLinks?.linkedin || '',
                    github: banner.socialLinks?.github || '',
                    twitter: banner.socialLinks?.twitter || '',
                    instagram: banner.socialLinks?.instagram || '',
                    website: banner.socialLinks?.website || ''
                },
                buttons: banner.buttons?.length > 0 ? banner.buttons : [
                    { text: '', url: '', style: 'filled' },
                    { text: '', url: '', style: 'outline' }
                ],
                stats: banner.stats?.length > 0 ? banner.stats : [
                    { label: '', value: '' }
                ],
                published: banner.published || false
            });
            setMainImagePreview(banner.mainImage?.url || '');
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
            // Use FormData when we have a file to upload or for updates
            const formDataToSend = new FormData();
            formDataToSend.append('headline', formData.headline);
            formDataToSend.append('highlightedText', formData.highlightedText);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('published', formData.published);

            // Append each social link individually
            Object.entries(formData.socialLinks).forEach(([key, value]) => {
                formDataToSend.append(`socialLinks[${key}]`, value);
            });

            // Append each button individually
            formData.buttons.forEach((button, index) => {
                formDataToSend.append(`buttons[${index}][text]`, button.text);
                formDataToSend.append(`buttons[${index}][url]`, button.url);
                formDataToSend.append(`buttons[${index}][style]`, button.style);
            });

            // Append each stat individually
            formData.stats.forEach((stat, index) => {
                formDataToSend.append(`stats[${index}][label]`, stat.label);
                formDataToSend.append(`stats[${index}][value]`, stat.value);
            });

            if (mainImageFile) {
                formDataToSend.append('mainImage', mainImageFile);
            }

            const url = editingBanner
                ? `${backendUrl}/api/banner/${editingBanner._id}`
                : `${backendUrl}/api/banner`;

            const method = editingBanner ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });

            const data = await response.json();

            if (data.success) {
                await fetchBanners();
                closeModal();
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to save banner');
            }
        } catch (err) {
            console.error('Error saving banner:', err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete banner
    const handleDelete = async (bannerId) => {
        try {
            const response = await fetch(`${backendUrl}/api/banner/${bannerId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                await fetchBanners();
                setDeleteConfirm(null);
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to delete banner');
            }
        } catch (err) {
            console.error('Error deleting banner:', err);
            setError(err.message);
        }
    };

    // Toggle banner status
    const toggleStatus = async (banner) => {
        try {
            const formData = new FormData();
            formData.append('headline', banner.headline || '');
            formData.append('highlightedText', banner.highlightedText || '');
            formData.append('description', banner.description || '');
            formData.append('socialLinks', JSON.stringify(banner.socialLinks || {}));
            formData.append('buttons', JSON.stringify(banner.buttons || []));
            formData.append('stats', JSON.stringify(banner.stats || []));
            formData.append('published', !banner.published);

            const response = await fetch(`${backendUrl}/api/banner/${banner._id}`, {
                method: 'PUT',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                await fetchBanners();
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to update banner status');
            }
        } catch (err) {
            console.error('Error updating banner status:', err);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-lg font-medium text-secondary">Loading Banners...</p>
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
                        <h1 className="text-3xl font-bold text-secondary">Manage Portfolio Banners</h1>
                        <p className="text-gray-600 mt-2">Create and manage your portfolio hero banners</p>
                    </div>
                    <motion.button
                        onClick={() => openModal()}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={20} />
                        <span>Add New Banner</span>
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

                {/* Banners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <motion.div
                            key={banner._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
                        >
                            {/* Banner Preview */}
                            <div className="relative h-48 bg-gray-200">
                                {banner.mainImage?.url ? (
                                    <img
                                        src={banner.mainImage.url}
                                        alt={banner.mainImage.altText || banner.headline || 'Banner'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon size={48} />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${banner.published
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {banner.published ? 'Published' : 'Draft'}
                                </div>
                            </div>

                            {/* Banner Content */}
                            <div className="p-4">
                                <div className="mb-2">
                                    <h3 className="text-lg font-semibold text-secondary">
                                        {banner.headline || 'No Headline'}
                                    </h3>
                                    {banner.highlightedText && (
                                        <p className="text-primary font-medium">
                                            {banner.highlightedText}
                                        </p>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {banner.description || 'No description provided'}
                                </p>

                                {/* Stats Preview */}
                                {banner.stats && banner.stats.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {banner.stats.slice(0, 2).map((stat, index) => (
                                            <div key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                <span className="font-semibold text-primary">{stat.value}</span>
                                                <span className="text-gray-600 ml-1">{stat.label}</span>
                                            </div>
                                        ))}
                                        {banner.stats.length > 2 && (
                                            <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
                                                +{banner.stats.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Social Links Preview */}
                                {banner.socialLinks && Object.values(banner.socialLinks).some(link => link) && (
                                    <div className="flex space-x-2 mb-4">
                                        {banner.socialLinks.linkedin && <Linkedin size={16} className="text-gray-400" />}
                                        {banner.socialLinks.github && <Github size={16} className="text-gray-400" />}
                                        {banner.socialLinks.twitter && <Twitter size={16} className="text-gray-400" />}
                                        {banner.socialLinks.instagram && <Instagram size={16} className="text-gray-400" />}
                                        {banner.socialLinks.website && <Globe size={16} className="text-gray-400" />}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openModal(banner)}
                                            className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Banner"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(banner)}
                                            className={`p-2 rounded-lg transition-colors ${banner.published
                                                ? 'text-red-600 hover:bg-red-50'
                                                : 'text-green-600 hover:bg-green-50'
                                                }`}
                                            title={banner.published ? 'Unpublish' : 'Publish'}
                                        >
                                            {banner.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(banner._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Banner"
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
                {banners.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-secondary mb-2">No banners found</h3>
                        <p className="text-gray-600 mb-6">Create your first portfolio banner to get started</p>
                        <button
                            onClick={() => openModal()}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg"
                        >
                            Add New Banner
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
                        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-secondary">
                                    {editingBanner ? 'Edit Portfolio Banner' : 'Create New Portfolio Banner'}
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
                                                Headline
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.headline}
                                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="e.g., Hello, I am"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Highlighted Text
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.highlightedText}
                                                onChange={(e) => setFormData({ ...formData, highlightedText: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="e.g., John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                            placeholder="Brief description about yourself or your work"
                                        />
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-secondary">Social Links</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <Linkedin size={16} className="mr-2" />
                                                LinkedIn
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.socialLinks.linkedin}
                                                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <Github size={16} className="mr-2" />
                                                GitHub
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.socialLinks.github}
                                                onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="https://github.com/username"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <Twitter size={16} className="mr-2" />
                                                Twitter
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.socialLinks.twitter}
                                                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="https://twitter.com/username"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <Instagram size={16} className="mr-2" />
                                                Instagram
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.socialLinks.instagram}
                                                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="https://instagram.com/username"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <Globe size={16} className="mr-2" />
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.socialLinks.website}
                                                onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-secondary">Action Buttons</h3>

                                    {formData.buttons.map((button, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Button Text
                                                </label>
                                                <input
                                                    type="text"
                                                    value={button.text}
                                                    onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                    placeholder="e.g., View Portfolio"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Button URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={button.url}
                                                    onChange={(e) => handleButtonChange(index, 'url', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                    placeholder="https://example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Button Style
                                                </label>
                                                <select
                                                    value={button.style}
                                                    onChange={(e) => handleButtonChange(index, 'style', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                >
                                                    <option value="filled">Filled</option>
                                                    <option value="outline">Outline</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-secondary">Statistics</h3>
                                        <button
                                            type="button"
                                            onClick={addStat}
                                            className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm"
                                        >
                                            Add Stat
                                        </button>
                                    </div>

                                    {formData.stats.map((stat, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Label
                                                </label>
                                                <input
                                                    type="text"
                                                    value={stat.label}
                                                    onChange={(e) => handleStatsChange(index, 'label', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                    placeholder="e.g., Years Experience"
                                                />
                                            </div>
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Value
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={stat.value}
                                                        onChange={(e) => handleStatsChange(index, 'value', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-secondary"
                                                        placeholder="e.g., 3+"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStat(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        disabled={formData.stats.length === 1}
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
                                        <p className="text-sm text-gray-500">Control whether this banner is visible to visitors</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-600">Draft</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, published: !formData.published })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.published ? 'bg-primary' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.published ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
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
                                        <span>{submitting ? 'Saving...' : (editingBanner ? 'Update Banner' : 'Create Banner')}</span>
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
                            Delete Banner
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this banner? This action cannot be undone and will permanently remove all associated data including images.
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
                                Delete Banner
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageBanner;
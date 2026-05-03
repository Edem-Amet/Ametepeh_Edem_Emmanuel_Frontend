// ManageBlog.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Save,
    X,
    Upload,
    ImageIcon,
    FileText,
    User,
    Tag,
    Calendar,
    List,
    AlertCircle,
    ChevronRight
} from 'lucide-react';

const initialForm = {
    title: '',
    summary: '',
    content: '',
    author: '',
    category: '',
    published: false,
    images: [],
    imagePreviews: [],
    existingImages: [],
    index: 0
};

const ManageBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [editingBlog, setEditingBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${backendUrl}/api/blog`);
            const data = await response.json();

            if (data.success) {
                const processed = data.data.map(blog => ({
                    ...blog,
                    images: blog.images ? blog.images.map(img =>
                        img.startsWith('http') ? img : `${backendUrl}${img}`
                    ) : [],
                    createdAt: new Date(blog.createdAt).toLocaleDateString()
                }));
                setBlogs(processed);
            } else {
                throw new Error(data.error || 'Failed to fetch blogs');
            }
        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError('Failed to load blogs: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(initialForm);
        setEditingBlog(null);
    };

    const openModal = (blog = null) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title || '',
                summary: blog.summary || '',
                content: blog.content || '',
                author: blog.author || '',
                category: blog.category || '',
                published: blog.published || false,
                images: [],
                imagePreviews: [],
                existingImages: blog.images || [],
                index: blog.index || 0
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const totalImages = files.length + formData.imagePreviews.length + formData.existingImages.length;

        if (totalImages > 10) {
            setError('Maximum 10 images allowed');
            return;
        }

        setError(null);

        const previews = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files],
            imagePreviews: [...prev.imagePreviews, ...previews]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
        }));
    };

    const removeExistingImage = (index) => {
        setFormData(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (!formData.title || !formData.summary || !formData.content) {
            setError('Title, summary, and content are required');
            setIsSubmitting(false);
            return;
        }

        const totalImages = formData.images.length + formData.existingImages.length;
        if (totalImages < 1 || totalImages > 10) {
            setError('You must have between 1 and 10 images');
            setIsSubmitting(false);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('summary', formData.summary);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('published', formData.published);
        formDataToSend.append('index', formData.index);

        if (formData.existingImages.length > 0) {
            formDataToSend.append('existingImages', JSON.stringify(formData.existingImages));
        }

        formData.images.forEach(file => {
            formDataToSend.append('images', file);
        });

        try {
            const url = editingBlog
                ? `${backendUrl}/api/blog/${editingBlog._id}`
                : `${backendUrl}/api/blog`;

            const method = editingBlog ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });

            const data = await response.json();

            if (data.success) {
                await fetchBlogs();
                closeModal();
            } else {
                throw new Error(data.error || 'Failed to save blog');
            }
        } catch (err) {
            console.error('Error saving blog:', err);
            setError(err.message || 'Failed to save blog');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (blogId) => {
        try {
            const response = await fetch(`${backendUrl}/api/blog/${blogId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                await fetchBlogs();
                setDeleteConfirm(null);
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to delete blog');
            }
        } catch (err) {
            console.error('Error deleting blog:', err);
            setError(err.message || 'Failed to delete blog');
        }
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

    return (
        <div className="min-h-screen py-8 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#7B3B0A]">Manage Blog Posts</h1>
                        <p className="text-[#7B3B0A]/70 mt-2">Create and manage your blog content</p>
                    </div>
                    <motion.button
                        onClick={() => openModal()}
                        className="bg-[#7B3B0A] hover:bg-[#8B4513] text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-md"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={20} />
                        <span>Add New Post</span>
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

                {/* Blog Posts Grid */}
                <div className="bg-gradient-to-br from-[#7B3B0A]/5 to-[#F5A623]/5 rounded-xl shadow-lg p-6 border border-[#F5A623]/30">
                    <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] flex items-center">
                        <ChevronRight className="mr-2 text-[#F5A623]" />
                        Published Blog Posts
                    </h3>

                    {blogs.length === 0 && !loading ? (
                        <div className="text-center py-12 px-6 bg-white/70 rounded-lg shadow-sm border border-[#F5A623]/20">
                            <FileText className="mx-auto h-12 w-12 text-[#F5A623] mb-4" />
                            <p className="text-[#7B3B0A] text-lg font-medium">No blog posts found.</p>
                            <p className="text-[#7B3B0A]/60">Create your first blog post to get started.</p>
                            <button
                                onClick={() => openModal()}
                                className="mt-4 bg-[#7B3B0A] hover:bg-[#8B4513] text-white px-6 py-3 rounded-lg transition-colors shadow-md"
                            >
                                Create First Post
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {blogs
                                .sort((a, b) => (b.index || 0) - (a.index || 0))
                                .map(blog => (
                                    <motion.div
                                        key={blog._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-[#F5A623]/20"
                                    >
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-lg font-bold text-[#7B3B0A] line-clamp-2">
                                                    {blog.title || 'Untitled Post'}
                                                </h4>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-3 py-1 text-xs rounded-full flex items-center ${blog.published
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {blog.published ? (
                                                            <>
                                                                <Eye className="mr-1" size={12} />
                                                                Published
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="mr-1" size={12} />
                                                                Draft
                                                            </>
                                                        )}
                                                    </span>
                                                    {(blog.index || 0) > 0 && (
                                                        <span className="mt-1 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white">
                                                            Priority: {blog.index}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-[#7B3B0A]/70 mb-3 line-clamp-2">
                                                {blog.summary || 'No summary provided'}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {blog.category && (
                                                    <span className="bg-[#7B3B0A]/10 text-[#7B3B0A] px-3 py-1 text-xs rounded-full flex items-center">
                                                        <Tag className="mr-1" size={10} />
                                                        {blog.category}
                                                    </span>
                                                )}
                                                {blog.author && (
                                                    <span className="bg-[#F5A623]/10 text-[#F5A623] px-3 py-1 text-xs rounded-full flex items-center">
                                                        <User className="mr-1" size={10} />
                                                        {blog.author}
                                                    </span>
                                                )}
                                                <span className="bg-gray-100 text-gray-700 px-3 py-1 text-xs rounded-full flex items-center">
                                                    <Calendar className="mr-1" size={10} />
                                                    {blog.createdAt}
                                                </span>
                                            </div>

                                            {blog.images && blog.images.length > 0 && (
                                                <div className="grid grid-cols-3 gap-2 mb-4">
                                                    {blog.images.slice(0, 3).map((img, idx) => (
                                                        <div key={idx} className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm relative">
                                                            <img
                                                                src={img}
                                                                alt={`Blog ${idx + 1}`}
                                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                                onError={(e) => {
                                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEySDNNMTIgM1YyMU0xMiAzTDggN001IDlNMTIgMjFMMTYgMTdNMTkgMTVNMTIgM1YyMSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=';
                                                                }}
                                                            />
                                                            {idx === 2 && blog.images.length > 3 && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-lg">
                                                                    +{blog.images.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                                                <button
                                                    onClick={() => openModal(blog)}
                                                    className="flex items-center px-4 py-2 text-sm bg-[#7B3B0A] hover:bg-[#8B4513] text-white rounded-md transition duration-200 shadow-sm"
                                                >
                                                    <Edit className="mr-1.5" size={14} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(blog._id)}
                                                    className="flex items-center px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-200 shadow-sm"
                                                >
                                                    <Trash2 className="mr-1.5" size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    )}
                </div>
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
                                <h2 className="text-2xl font-bold text-[#7B3B0A]">
                                    {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#7B3B0A] mb-2">
                                            <FileText className="inline mr-2" size={16} />
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-[#F5A623]/40 rounded-lg focus:ring-2 focus:ring-[#7B3B0A] focus:border-transparent bg-white text-[#7B3B0A]"
                                            placeholder="Enter blog title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#7B3B0A] mb-2">
                                            <User className="inline mr-2" size={16} />
                                            Author
                                        </label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-[#F5A623]/40 rounded-lg focus:ring-2 focus:ring-[#7B3B0A] focus:border-transparent bg-white text-[#7B3B0A]"
                                            placeholder="Blog author"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#7B3B0A] mb-2">
                                            <Tag className="inline mr-2" size={16} />
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-[#F5A623]/40 rounded-lg focus:ring-2 focus:ring-[#7B3B0A] focus:border-transparent bg-white text-[#7B3B0A]"
                                            placeholder="Blog category"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#7B3B0A] mb-2">
                                            <List className="inline mr-2" size={16} />
                                            Display Priority (Higher = First)
                                        </label>
                                        <input
                                            type="number"
                                            name="index"
                                            value={formData.index}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-[#F5A623]/40 rounded-lg focus:ring-2 focus:ring-[#7B3B0A] focus:border-transparent bg-white text-[#7B3B0A]"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#7B3B0A] mb-2">
                                        Summary *
                                    </label>
                                    <textarea
                                        name="summary"
                                        value={formData.summary}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className="w-full px-3 py-2 border border-[#F5A623]/40 rounded-lg focus:ring-2 focus:ring-[#7B3B0A] focus:border-transparent bg-white text-[#7B3B0A]"
                                        placeholder="Enter a brief summary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#7B3B0A] mb-2">
                                        Content *
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        required
                                        rows={8}
                                        className="w-full px-3 py-2 border border-[#F5A623]/40 rounded-lg focus:ring-2 focus:ring-[#7B3B0A] focus:border-transparent bg-white text-[#7B3B0A]"
                                        placeholder="Enter the full blog content"
                                    />
                                </div>

                                {/* Images */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#7B3B0A] mb-2">
                                            <ImageIcon className="inline mr-2" size={16} />
                                            Images * (1-10 images)
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <label className="cursor-pointer bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] hover:opacity-90 px-4 py-2 rounded-lg text-white transition duration-200 flex items-center shadow-md">
                                                <Upload className="mr-2" size={16} />
                                                Upload Images
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            <span className="text-sm text-[#7B3B0A]/60 flex items-center">
                                                <AlertCircle className="mr-1" size={14} />
                                                {formData.images.length + formData.existingImages.length} images selected
                                            </span>
                                        </div>
                                    </div>

                                    {/* Existing Images */}
                                    {formData.existingImages.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-[#7B3B0A] mb-2">
                                                Existing Images
                                            </h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                {formData.existingImages.map((img, idx) => (
                                                    <div key={`existing-${idx}`} className="relative group rounded-lg overflow-hidden shadow-md border border-[#F5A623]/30">
                                                        <img
                                                            src={img}
                                                            alt={`Existing ${idx + 1}`}
                                                            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(idx)}
                                                            className="absolute bottom-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* New Images Preview */}
                                    {formData.imagePreviews.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-[#7B3B0A] mb-2">
                                                New Images
                                            </h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                {formData.imagePreviews.map((preview, idx) => (
                                                    <div key={`preview-${idx}`} className="relative group rounded-lg overflow-hidden shadow-md border border-[#F5A623]/30">
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${idx + 1}`}
                                                            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute bottom-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Published Toggle */}
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-[#7B3B0A]">
                                        Publication Status
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-[#7B3B0A]/70">Draft</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, published: !formData.published })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.published
                                                ? 'bg-[#7B3B0A]'
                                                : 'bg-gray-200'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.published ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-sm text-[#7B3B0A]/70">Published</span>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-[#7B3B0A] border border-[#F5A623]/40 rounded-lg hover:bg-[#F5A623]/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-gradient-to-r from-[#7B3B0A] to-[#F5A623] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors shadow-md"
                                    >
                                        {isSubmitting && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                        )}
                                        <Save size={16} />
                                        <span>
                                            {isSubmitting
                                                ? 'Saving...'
                                                : editingBlog
                                                    ? 'Update Post'
                                                    : 'Create Post'
                                            }
                                        </span>
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
                        <h3 className="text-lg font-semibold text-[#7B3B0A] mb-4">
                            Delete Blog Post
                        </h3>
                        <p className="text-[#7B3B0A]/70 mb-6">
                            Are you sure you want to delete this blog post? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-[#7B3B0A] border border-[#F5A623]/40 rounded-lg hover:bg-[#F5A623]/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageBlog;
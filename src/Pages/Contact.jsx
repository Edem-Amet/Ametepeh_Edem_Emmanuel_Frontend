import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.name && form.email && form.message) {
            setSubmitted(true);
            setForm({ name: "", email: "", message: "" });
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

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
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const socialLinks = [
        {
            icon: <FaEnvelope className="text-xl sm:text-2xl" />,
            name: "Email",
            url: "mailto:ametepehemmanuel30@gmail.com",
            color: "bg-red-500 hover:bg-red-600"
        },
        {
            icon: <FaGithub className="text-xl sm:text-2xl" />,
            name: "GitHub",
            url: "https://github.com/Edem-Amet",
            color: "bg-gray-800 hover:bg-gray-900"
        },
        {
            icon: <FaLinkedin className="text-xl sm:text-2xl" />,
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/ametepeh-emmanuel-174139244/",
            color: "bg-blue-600 hover:bg-blue-700"
        },
        {
            icon: <FaTwitter className="text-xl sm:text-2xl" />,
            name: "Twitter",
            url: "https://twitter.com",
            color: "bg-sky-400 hover:bg-sky-500"
        }
    ];

    return (
        <section id="contact" className="py-20 mt-4 sm:py-8 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted">
            <motion.div
                className="max-w-4xl mx-auto"
            >
                {/* Section Header */}
                <motion.div variants={item} className="text-center mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-43l lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">
                        Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">In Touch</span>
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                        Have a project in mind or want to collaborate? Feel free to reach out!
                    </p>
                </motion.div>

                {/* Contact Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Form */}
                    <motion.div
                        variants={item}
                        className="bg-white p-6 sm:p-8 rounded-xl shadow-lg shadow-secondary transition-shadow"
                    >
                        <h3 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 sm:mb-6">
                            Send me a message
                        </h3>

                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 sm:mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
                            >
                                Thanks for your message! I'll get back to you soon.
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-primary mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                                    required
                                ></textarea>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-secondary hover:bg-gradient-to-r from-primary to-secondary text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                            >
                                <FiSend className="text-base sm:text-lg" /> Send Message
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div variants={item} className="space-y-6 lg:space-y-8">
                        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transition-shadow shadow-primary">
                            <h3 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 sm:mb-6">
                                Connect with me
                            </h3>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -5 }}
                                        className={`${social.color} text-white p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center transition-colors`}
                                    >
                                        {social.icon}
                                        <span className="mt-1 sm:mt-2 text-xs sm:text-sm">{social.name}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg shadow-primary transition-shadow">
                            <h3 className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 sm:mb-6">
                                Contact Information
                            </h3>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="mt-0.5 sm:mt-1 text-secondary">
                                        <FaEnvelope className="text-lg sm:text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Email</h4>
                                        <p className="text-gray-600 text-xs sm:text-sm">ametepehemmanuel30@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="mt-0.5 sm:mt-1 text-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">Location</h4>
                                        <p className="text-gray-600 text-xs sm:text-sm">Accra / Kumasi, Ghana</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Contact;
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
    FaHome,
    FaLaptopCode,
    FaFileAlt,
    FaUser,
    FaEnvelope,
    FaFlask,
    FaGithub,
    FaLinkedin,
    FaTwitter,
    FaTimes
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { motion } from "framer-motion";

const ResponsiveMenu = ({ showMenu, toggleMenu, scrollToTop }) => {
    const handleLinkClick = () => {
        scrollToTop();
        toggleMenu();
    };

    const menuItems = [
        {
            path: "/",
            label: "Home",
            icon: <FaHome className="text-xl" />
        },
        {
            path: "/expertise",
            label: "My Expertise",
            icon: <FaLaptopCode className="text-xl" />
        },
        {
            path: "/about",
            label: "Volunteer Work",
            icon: <FaFileAlt className="text-xl" />
        },
        {
            path: "/research",
            label: "Research",
            icon: <FaFlask className="text-xl" />
        },
        {
            path: "/projects",
            label: "Projects",
            icon: <MdWork className="text-xl" />
        },
        {
            path: "/hobbies",
            label: "Hobbies",
            icon: <FaUser className="text-xl" />
        },
        {
            path: "/contact",
            label: "Contact",
            icon: <FaEnvelope className="text-xl" />
        },
    ];

    const socialLinks = [
        {
            icon: <FaGithub className="text-lg" />,
            url: "https://github.com/Edem-Amet",
            name: "GitHub"
        },
        {
            icon: <FaLinkedin className="text-lg" />,
            url: "https://www.linkedin.com/in/ametepeh-emmanuel-174139244/",
            name: "LinkedIn"
        },
        {
            icon: <FaTwitter className="text-lg" />,
            url: "https://twitter.com",
            name: "Twitter"
        }
    ];

    return (
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: showMenu ? 0 : "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 left-0 pl-2 pr-2 z-50 h-screen w-80 bg-white shadow-2xl border-r border-gray-100"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-secondary">Menu</h2>
                <button
                    onClick={toggleMenu}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-secondary"
                >
                    <FaTimes className="text-xl" />
                </button>
            </div>

            {/* Menu Items */}
            <nav className="p-6 flex-1 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                        <motion.li
                            key={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                to={item.path}
                                onClick={handleLinkClick}
                                className="flex items-center border-b-2 border-secondary gap-5 p-5 rounded-xl text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                            >
                                <span className="text-primary group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </span>
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
                {/* Social Links */}
                <div className="flex justify-center gap-4 mb-6">
                    {socialLinks.map((social, index) => (
                        <motion.a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="p-3 rounded-full bg-black text-white hover:shadow-lg transition-all duration-300"
                            aria-label={social.name}
                        >
                            {social.icon}
                        </motion.a>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mb-4"
                >
                    <Link
                        to="/contact"
                        onClick={handleLinkClick}
                        className="block w-full bg-gradient-to-r from-primary to-secondary text-white text-center py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                        Let's Talk
                    </Link>
                </motion.div>

                {/* Copyright */}
                <p className="text-center text-gray-600 text-sm">
                    © {new Date().getFullYear()} Portfolio. All rights reserved.
                </p>
            </div>
        </motion.div>
    );
};

ResponsiveMenu.propTypes = {
    showMenu: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    scrollToTop: PropTypes.func.isRequired,
};

export default ResponsiveMenu;
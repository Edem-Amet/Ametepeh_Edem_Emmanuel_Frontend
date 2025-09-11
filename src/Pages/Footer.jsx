import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart } from "react-icons/fa";
import { BiPhoneCall } from "react-icons/bi";
import { FaLaptopCode, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/edem_logo.png";

const Footer = () => {
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

    const socialLinks = [
        {
            icon: <FaEnvelope className="text-lg" />,
            name: "Email",
            url: "mailto:ametepehemmanuel30@gmail.com",
            color: "hover:text-red-500"
        },
        {
            icon: <FaGithub className="text-lg" />,
            name: "GitHub",
            url: "https://github.com/Edem-Amet",
            color: "hover:text-gray-800"
        },
        {
            icon: <FaLinkedin className="text-lg" />,
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/ametepeh-emmanuel-174139244/",
            color: "hover:text-blue-600"
        },
        {
            icon: <FaTwitter className="text-lg" />,
            name: "Twitter",
            url: "https://twitter.com",
            color: "hover:text-sky-400"
        }
    ];

    const quickLinks = [
        { name: "Home", path: "/" },
        { name: "Research", path: "/research" },
        { name: "Projects", path: "/projects" },
        { name: "Hobbies", path: "/hobbies" },
        { name: "Contact", path: "/contact" }
    ];

    const aboutLinks = [
        {
            name: "My Expertise",
            path: "/expertise",
            icon: <FaLaptopCode className="text-sm" />
        },
        {
            name: "Volunteer Work",
            path: "/about",
            icon: <FaFileAlt className="text-sm" />
        }
    ];

    return (
        <footer className="bg-white text-secondary border-t border-gray-100">
            <motion.div
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
                    {/* Brand Section */}
                    <motion.div variants={item} className="lg:col-span-1">
                        <Link to="/" className="flex items-center mb-4">
                            <img src={logo} alt="Portfolio Logo" className="h-16 w-auto object-contain" />
                            <span className="ml-2 text-xl font-bold">Portfolio</span>
                        </Link>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">
                            Full-stack developer specializing in building exceptional digital experiences with modern technologies.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className={`${social.color} text-gray-600 transition-colors duration-300 p-2 rounded-full bg-gray-50 hover:bg-gray-100`}
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={item}>
                        <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-secondary">Quick Links</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-600 hover:text-primary transition-colors duration-300 text-sm sm:text-base"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* About Me Links */}
                    <motion.div variants={item}>
                        <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-secondary">About Me</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            {aboutLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center gap-2 text-sm sm:text-base"
                                    >
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={item}>
                        <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-secondary">Get In Touch</h3>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-start gap-3">
                                <FaEnvelope className="text-primary mt-1" />
                                <div>
                                    <p className="text-gray-600 text-sm sm:text-base">ametepehemmanuel30@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <BiPhoneCall className="text-primary mt-1" />
                                <div>
                                    <p className="text-gray-600 text-sm sm:text-base">Accra / Kumasi, Ghana</p>
                                </div>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="inline-block mt-2"
                            >
                                <Link
                                    to="/contact"
                                    className="bg-secondary hover:bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-colors duration-300 text-sm sm:text-base w-fit"
                                >
                                    <BiPhoneCall /> Let's Talk
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div
                    variants={item}
                    className="border-t border-gray-200 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center"
                >
                    <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left mb-4 sm:mb-0">
                        © {new Date().getFullYear()} All rights reserved.
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base flex items-center gap-1">
                        Made with <FaHeart className="text-red-500 mx-1" /> by Edem Ametepeh
                    </p>
                </motion.div>
            </motion.div>
        </footer>
    );
};

export default Footer;
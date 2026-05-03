import { Link, useLocation } from "react-router-dom";
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
    FaTimes,
    FaAward,
    FaBriefcase,
    FaHeart,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { path: "/", label: "Home", icon: FaHome, group: "main" },
    { path: "/research", label: "Research", icon: FaFlask, group: "main" },
    { path: "/projects", label: "Projects", icon: FaBriefcase, group: "main" },
    { path: "/blog", label: "Blog", icon: FaFileAlt, group: "main" },
    { path: "/hobbies", label: "Hobbies", icon: FaHeart, group: "main" },
    { path: "/skills", label: "My Expertise", icon: FaLaptopCode, group: "about" },
    { path: "/about", label: "Volunteer Work", icon: FaFileAlt, group: "about" },
    { path: "/certificates", label: "Certificates", icon: FaAward, group: "about" },
    { path: "/contact", label: "Contact", icon: FaEnvelope, group: "contact" },
];

const socialLinks = [
    { icon: FaGithub, url: "https://github.com/Edem-Amet", name: "GitHub" },
    { icon: FaLinkedin, url: "https://www.linkedin.com/in/ametepeh-emmanuel-174139244/", name: "LinkedIn" },
    { icon: FaTwitter, url: "https://twitter.com", name: "Twitter" },
];

const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 28 } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
};

const itemVariants = {
    hidden: { x: -18, opacity: 0 },
    visible: (i) => ({ x: 0, opacity: 1, transition: { delay: 0.05 + i * 0.055, duration: 0.35 } }),
};

const ResponsiveMenu = ({ showMenu, toggleMenu, scrollToTop }) => {
    const location = useLocation();

    const handleLinkClick = () => {
        scrollToTop();
        toggleMenu();
    };

    const isActive = (path) => location.pathname === path;

    const mainItems = menuItems.filter(m => m.group === "main");
    const aboutItems = menuItems.filter(m => m.group === "about");
    const contactItem = menuItems.find(m => m.group === "contact");

    return (
        <AnimatePresence>
            {showMenu && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={toggleMenu}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                    />

                    {/* Sidebar panel */}
                    <motion.aside
                        key="sidebar"
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-0 left-0 z-50 h-screen w-[300px] flex flex-col overflow-hidden"
                        style={{
                            background: "linear-gradient(160deg, #ffffff 0%, #fff8f2 100%)",
                            borderRight: "1px solid #F5A62325",
                        }}
                    >
                        {/* ── Top bar ── */}
                        <div className="flex items-center justify-between px-5 py-4 border-b"
                            style={{ borderColor: "#F5A62325" }}>
                            {/* Brand monogram */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                                    style={{ background: "linear-gradient(135deg, #7B3B0A, #F5A623)" }}
                                >
                                    EA
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 leading-none">Edem Amet</p>
                                    <p className="text-xs mt-0.5" style={{ color: "#F5A623" }}>Portfolio</p>
                                </div>
                            </div>

                            <button
                                onClick={toggleMenu}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                style={{ background: "#7B3B0A10", color: "#7B3B0A" }}
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        {/* ── Nav content ── */}
                        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

                            {/* Main section */}
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2 px-1"
                                    style={{ color: "#F5A623" }}>
                                    Navigate
                                </p>
                                <ul className="space-y-1">
                                    {mainItems.map((item, i) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);
                                        return (
                                            <motion.li key={item.path} custom={i} variants={itemVariants}
                                                initial="hidden" animate="visible">
                                                <Link
                                                    to={item.path}
                                                    onClick={handleLinkClick}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                                                    style={{
                                                        background: active
                                                            ? "linear-gradient(to right, #7B3B0A15, #F5A62315)"
                                                            : "transparent",
                                                        borderLeft: active
                                                            ? "3px solid #F5A623"
                                                            : "3px solid transparent",
                                                    }}
                                                >
                                                    <span
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                                                        style={{
                                                            background: active ? "#F5A62320" : "#7B3B0A0D",
                                                            color: active ? "#F5A623" : "#7B3B0A",
                                                        }}
                                                    >
                                                        <Icon size={14} />
                                                    </span>
                                                    <span
                                                        className="text-sm font-medium"
                                                        style={{ color: active ? "#7B3B0A" : "#374151" }}
                                                    >
                                                        {item.label}
                                                    </span>
                                                    {active && (
                                                        <span
                                                            className="ml-auto w-1.5 h-1.5 rounded-full"
                                                            style={{ background: "#F5A623" }}
                                                        />
                                                    )}
                                                </Link>
                                            </motion.li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* About section */}
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2 px-1"
                                    style={{ color: "#F5A623" }}>
                                    About Me
                                </p>
                                <ul className="space-y-1">
                                    {aboutItems.map((item, i) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);
                                        return (
                                            <motion.li key={item.path} custom={mainItems.length + i}
                                                variants={itemVariants} initial="hidden" animate="visible">
                                                <Link
                                                    to={item.path}
                                                    onClick={handleLinkClick}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                                                    style={{
                                                        background: active
                                                            ? "linear-gradient(to right, #7B3B0A15, #F5A62315)"
                                                            : "transparent",
                                                        borderLeft: active
                                                            ? "3px solid #F5A623"
                                                            : "3px solid transparent",
                                                    }}
                                                >
                                                    <span
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{
                                                            background: active ? "#F5A62320" : "#7B3B0A0D",
                                                            color: active ? "#F5A623" : "#7B3B0A",
                                                        }}
                                                    >
                                                        <Icon size={14} />
                                                    </span>
                                                    <span
                                                        className="text-sm font-medium"
                                                        style={{ color: active ? "#7B3B0A" : "#374151" }}
                                                    >
                                                        {item.label}
                                                    </span>
                                                    {active && (
                                                        <span
                                                            className="ml-auto w-1.5 h-1.5 rounded-full"
                                                            style={{ background: "#F5A623" }}
                                                        />
                                                    )}
                                                </Link>
                                            </motion.li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </nav>

                        {/* ── Footer ── */}
                        <div className="px-4 pb-6 pt-4 border-t space-y-4"
                            style={{ borderColor: "#F5A62325" }}>

                            {/* Social icons */}
                            <div className="flex items-center justify-center gap-3">
                                {socialLinks.map((s, i) => {
                                    const Icon = s.icon;
                                    return (
                                        <motion.a
                                            key={i}
                                            href={s.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.12, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            aria-label={s.name}
                                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                                            style={{
                                                background: "#7B3B0A0F",
                                                color: "#7B3B0A",
                                                border: "1px solid #7B3B0A18",
                                            }}
                                        >
                                            <Icon size={15} />
                                        </motion.a>
                                    );
                                })}
                            </div>

                            {/* Let's Talk CTA */}
                            {contactItem && (
                                <Link
                                    to={contactItem.path}
                                    onClick={handleLinkClick}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg hover:scale-[1.02]"
                                    style={{ background: "linear-gradient(to right, #7B3B0A, #F5A623)" }}
                                >
                                    <FaEnvelope size={13} />
                                    Let's Talk
                                </Link>
                            )}

                            <p className="text-center text-gray-400 text-xs">
                                © {new Date().getFullYear()} Edem Amet. All rights reserved.
                            </p>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

ResponsiveMenu.propTypes = {
    showMenu: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    scrollToTop: PropTypes.func.isRequired,
};

export default ResponsiveMenu;
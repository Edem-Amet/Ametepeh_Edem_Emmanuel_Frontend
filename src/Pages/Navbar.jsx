import { useState, useRef, useEffect } from "react";
import { FaCaretDown, FaLaptopCode, FaFileAlt, FaAward } from "react-icons/fa";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import ResponsiveMenu from "./ResponsiveMenu";
import logo from "../assets/edem_logo.png";
import { BiPhoneCall } from "react-icons/bi";

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();

    const toggleMenu = () => setShowMenu(!showMenu);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        if (showMenu) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    useEffect(() => {
        scrollToTop();
    }, [location.pathname]);

    const navLinkClass = "hover:text-primary transition-colors duration-300";
    const linkClass = "flex items-center h-[72px]";

    return (
        <>
            <nav className="bg-white text-secondary fixed top-0 left-0 w-full z-[9999] shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-[80px] py-2">

                        {/* Logo */}
                        <div>
                            <Link to="/" onClick={scrollToTop} className="flex items-center">
                                <img src={logo} alt="Portfolio Logo" className="h-[100px] w-auto object-contain" />
                                <span className="ml-2 text-xl font-bold hidden sm:inline-block">Portfolio</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:block text-[16px] font-medium">
                            <ul className="flex items-center gap-8">

                                {/* Home */}
                                <li className={navLinkClass}>
                                    <Link to="/" onClick={scrollToTop} className={linkClass}>Home</Link>
                                </li>

                                {/* About Me dropdown */}
                                <li className="group relative cursor-pointer">
                                    <div className="hover:text-primary flex items-center gap-[2px] h-[72px]">
                                        About Me
                                        <FaCaretDown className="group-hover:rotate-180 transition-all duration-200" />
                                    </div>
                                    <div className="absolute left-0 z-[9999] hidden w-[210px] bg-white shadow-lg p-2 text-black rounded-md group-hover:block border border-gray-100">
                                        <ul className="space-y-2">
                                            <Link to="/skills" onClick={scrollToTop}>
                                                <li className="p-2 hover:bg-secondary rounded-md hover:text-white transition-colors duration-200 flex items-center gap-2">
                                                    <FaLaptopCode /> My Expertise
                                                </li>
                                            </Link>
                                            <Link to="/about" onClick={scrollToTop}>
                                                <li className="p-2 hover:bg-secondary rounded-md hover:text-white transition-colors duration-200 flex items-center gap-2">
                                                    <FaFileAlt /> Volunteer Work
                                                </li>
                                            </Link>
                                            <Link to="/certificates" onClick={scrollToTop}>
                                                <li className="p-2 hover:bg-secondary rounded-md hover:text-white transition-colors duration-200 flex items-center gap-2">
                                                    <FaAward /> Certificates
                                                </li>
                                            </Link>
                                        </ul>
                                    </div>
                                </li>

                                {/* Research */}
                                <li className={navLinkClass}>
                                    <Link to="/research" onClick={scrollToTop} className={linkClass}>Research</Link>
                                </li>

                                {/* Projects */}
                                <li className={navLinkClass}>
                                    <Link to="/projects" onClick={scrollToTop} className={linkClass}>Projects</Link>
                                </li>

                                {/* Hobbies */}
                                <li className={navLinkClass}>
                                    <Link to="/hobbies" onClick={scrollToTop} className={linkClass}>Hobbies</Link>
                                </li>

                                {/* Contact */}
                                <li className={navLinkClass}>
                                    <Link to="/contact" onClick={scrollToTop} className={linkClass}>Contact</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-5">
                            <Link
                                to="/contact"
                                onClick={scrollToTop}
                                className="flex items-center gap-2 bg-secondary text-white px-4 py-1 rounded-full hover:bg-primary transition-colors duration-300"
                            >
                                <BiPhoneCall /> Let's Talk
                            </Link>

                            <div className="lg:hidden">
                                {showMenu ? (
                                    <HiMenuAlt1
                                        onClick={toggleMenu}
                                        className="cursor-pointer transition-all text-secondary hover:text-primary"
                                        size={34}
                                    />
                                ) : (
                                    <HiMenuAlt3
                                        onClick={toggleMenu}
                                        className="cursor-pointer transition-all text-secondary hover:text-primary"
                                        size={34}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div ref={menuRef}>
                <ResponsiveMenu showMenu={showMenu} toggleMenu={toggleMenu} scrollToTop={scrollToTop} />
            </div>
        </>
    );
};

export default Navbar;
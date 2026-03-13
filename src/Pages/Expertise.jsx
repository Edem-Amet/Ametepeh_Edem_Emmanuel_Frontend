import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FaLaptopCode,
    FaServer,
    FaMobileAlt,
    FaDatabase,
    FaTools,
    FaHtml5,
    FaJsSquare,
    FaReact,
    FaPhp,
    FaJava,
    FaPython,
    FaNodeJs,
    FaBootstrap,
    FaArrowRight,
} from "react-icons/fa";
import {
    SiTailwindcss,
    SiMongodb,
    SiPostman,
    SiCplusplus,
    SiFigma,
    SiAdobephotoshop,
    SiGit,
} from "react-icons/si";
import { GrMysql } from "react-icons/gr";

const Skills = ({ isHomepage = false }) => {
    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const skills = [
        {
            name: "Frontend Development",
            icon: <FaLaptopCode className="text-3xl" />,
            subSkills: [
                { name: "HTML5", icon: <FaHtml5 style={{ color: "#E34F26" }} className="text-xl" /> },
                { name: "CSS3", icon: <FaHtml5 style={{ color: "#264DE4" }} className="text-xl" /> },
                { name: "JavaScript", icon: <FaJsSquare style={{ color: "#F7DF1E" }} className="text-xl" /> },
                { name: "React", icon: <FaReact style={{ color: "#61DAFB" }} className="text-xl" /> },
                { name: "Bootstrap", icon: <FaBootstrap style={{ color: "#7952B3" }} className="text-xl" /> },
                { name: "Tailwind", icon: <SiTailwindcss style={{ color: "#38B2AC" }} className="text-xl" /> },
            ],
        },
        {
            name: "Backend Development",
            icon: <FaServer className="text-3xl" />,
            subSkills: [
                { name: "Node.js", icon: <FaNodeJs style={{ color: "#339933" }} className="text-xl" /> },
                { name: "PHP", icon: <FaPhp style={{ color: "#777BB4" }} className="text-xl" /> },
                { name: "Java", icon: <FaJava style={{ color: "#007396" }} className="text-xl" /> },
                { name: "Python", icon: <FaPython style={{ color: "#3776AB" }} className="text-xl" /> },
            ],
        },
        {
            name: "Mobile Development",
            icon: <FaMobileAlt className="text-3xl" />,
            subSkills: [
                { name: "React Native", icon: <FaReact style={{ color: "#61DAFB" }} className="text-xl" /> },
            ],
        },
        {
            name: "Database",
            icon: <FaDatabase className="text-3xl" />,
            subSkills: [
                { name: "MySQL", icon: <GrMysql style={{ color: "#4479A1" }} className="text-xl" /> },
                { name: "MongoDB", icon: <SiMongodb style={{ color: "#47A248" }} className="text-xl" /> },
            ],
        },
        {
            name: "UI/UX Design",
            icon: <FaTools className="text-3xl" />,
            subSkills: [
                { name: "Figma", icon: <SiFigma style={{ color: "#F24E1E" }} className="text-xl" /> },
                { name: "Photoshop", icon: <SiAdobephotoshop style={{ color: "#31A8FF" }} className="text-xl" /> },
            ],
        },
        {
            name: "Tools",
            icon: <SiGit className="text-3xl" />,
            subSkills: [
                { name: "Git", icon: <SiGit style={{ color: "#F05032" }} className="text-xl" /> },
                { name: "Postman", icon: <SiPostman style={{ color: "#FF6C37" }} className="text-xl" /> },
                { name: "C++", icon: <SiCplusplus style={{ color: "#00599C" }} className="text-xl" /> },
            ],
        },
    ];

    // How many subskills to show per category on homepage
    // small screens: 2, large screens: 4
    const HOMEPAGE_LIMIT_SM = 2;
    const HOMEPAGE_LIMIT_LG = 4;

    // Which top-level categories to show on homepage
    const homepageCategories = ["Frontend Development", "Backend Development"];

    // ──────────────────────────────────────────
    // HOMEPAGE VIEW
    // ──────────────────────────────────────────
    if (isHomepage) {
        const displaySkills = skills.filter(s => homepageCategories.includes(s.name));

        return (
            <section className="pt-2 sm:pt-20 mt-4 px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                    }}
                >
                    <motion.div variants={item} className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Expertise</span>
                        </h2>
                        <p className="text-md text-gray-600 max-w-2xl mx-auto">
                            A snapshot of the technologies I work with
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {displaySkills.map((skill, index) => {
                            const hiddenCount = skill.subSkills.length - HOMEPAGE_LIMIT_SM;
                            const hiddenCountLg = skill.subSkills.length - HOMEPAGE_LIMIT_LG;

                            return (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="text-secondary mr-3">{skill.icon}</div>
                                        <h3 className="text-xl font-semibold text-gray-800">{skill.name}</h3>
                                    </div>

                                    {/* Small screens: show 2 */}
                                    <div className="grid grid-cols-3 gap-3 sm:hidden">
                                        {skill.subSkills.slice(0, HOMEPAGE_LIMIT_SM).map((sub, i) => (
                                            <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg shadow shadow-gray-300">
                                                <span className="mb-2">{sub.icon}</span>
                                                <span className="text-xs text-gray-700 text-center">{sub.name}</span>
                                            </div>
                                        ))}
                                        {hiddenCount > 0 && (
                                            <div className="flex flex-col items-center justify-center p-3">
                                                <span
                                                    className="text-xs font-semibold"
                                                    style={{ color: 'var(--color-primary, #7B3B0A)' }}
                                                >
                                                    +{hiddenCount} more
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Large screens: show 4 */}
                                    <div className="hidden sm:grid grid-cols-3 gap-3">
                                        {skill.subSkills.slice(0, HOMEPAGE_LIMIT_LG).map((sub, i) => (
                                            <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg shadow shadow-gray-300">
                                                <span className="mb-2">{sub.icon}</span>
                                                <span className="text-sm text-gray-700 text-center">{sub.name}</span>
                                            </div>
                                        ))}
                                        {hiddenCountLg > 0 && (
                                            <div className="flex flex-col items-center justify-center p-2">
                                                <span
                                                    className="text-xs font-semibold tracking-wide"
                                                    style={{ color: 'var(--color-secondary, #F5A623)' }}
                                                >
                                                    +{hiddenCountLg} more
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* "View All Skills" CTA */}
                    <motion.div variants={item} className="mt-10 text-center">
                        <Link
                            to="/expertise"
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                            style={{ background: 'linear-gradient(to right, var(--color-primary, #8B4513), var(--color-secondary, #FF8C00))' }}
                        >
                            View All Skills
                            <FaArrowRight className="text-sm" />
                        </Link>
                        <p className="mt-3 text-xs text-gray-400">
                            Including Mobile, Database, UI/UX Design &amp; more
                        </p>
                    </motion.div>
                </motion.div>
            </section>
        );
    }

    // ──────────────────────────────────────────
    // FULL PAGE VIEW
    // ──────────────────────────────────────────
    return (
        <section className="pt-20 sm:pt-20 mt-4 px-4 sm:px-6 lg:px-8 mb-12">
            <motion.div
                className="max-w-6xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                }}
            >
                <motion.div variants={item} className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Expertise</span>
                    </h2>
                    <p className="text-md text-gray-600 max-w-2xl mx-auto">
                        The full stack of technologies, tools, and skills I bring to every project
                    </p>
                </motion.div>

                <motion.div variants={item}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="text-secondary mr-3">{skill.icon}</div>
                                    <h3 className="text-xl font-semibold text-gray-800">{skill.name}</h3>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {skill.subSkills.map((sub, i) => (
                                        <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg shadow-lg shadow-gray-500">
                                            <span className="mb-2">{sub.icon}</span>
                                            <span className="text-sm text-gray-700 text-center">{sub.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Skills;
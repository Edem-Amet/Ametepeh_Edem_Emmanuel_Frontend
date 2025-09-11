import { motion } from "framer-motion";
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

const Skills = () => {
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

    return (
        <section className="pt-20 sm:pt-20 mt-4 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-6xl mx-auto"
            >
                {/* Skills Section */}
                <motion.div variants={item}>
                    <div>
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Expertise</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {skills.map((skill, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="text-secondary mr-3">
                                            {skill.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {skill.name}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {skill.subSkills.map((sub, i) => (
                                            <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg shadow-lg shadow-gray-500">
                                                <span className="mb-2">
                                                    {sub.icon}
                                                </span>
                                                <span className="text-sm text-gray-700 text-center">
                                                    {sub.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Skills;
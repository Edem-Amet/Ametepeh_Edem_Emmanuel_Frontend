import React from 'react';
import { motion } from "framer-motion";
import {
    FaHandsHelping
} from "react-icons/fa";
import { FiAward } from "react-icons/fi";
import { MdSchool, MdWork } from "react-icons/md";

import volunteer1 from "../assets/v2.jpeg";
import volunteer2 from "../assets/v1.jpeg";
import volunteer3 from "../assets/v3.jpeg";
import volunteer4 from "../assets/spiepic.jpeg";
import volunteer5 from "../assets/v5.jpg";
import sci1 from "../assets/sci1.jpg";
import sci2 from "../assets/sci2.jpg";
import sci3 from "../assets/sci3.jpg";
import sci4 from "../assets/sci4.jpg";

const About = () => {
    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                when: "beforeChildren"
            }
        }
    };

    const item = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const timeline = [
        {
            id: 1,
            title: "Teaching & Research Assistant",
            company: "KNUST Physics Department",
            date: "2024 - Present",
            icon: <MdWork className="text-lg" />,
            description: "Help to conduct and supervise lab sessions for undergraduate Physics students, teach solid state physics, Java and web programming, and assist with research literature reviews.",
            type: "work"
        },
        {
            id: 2,
            title: "BSc. Physics (Computing)",
            company: "KNUST",
            date: "2020 - 2024",
            icon: <MdSchool className="text-lg" />,
            description: "Attained a BSc in Physics with Computing specialization, (Graduated in November 2024).",
            type: "Education"
        },
        {
            id: 3,
            title: "Web Development",
            company: "Self Taught",
            date: "2023",
            icon: <FiAward className="text-lg" />,
            description: "Studied web development and User experience in product design; where the journey began",
            type: "Personal Education"
        }
    ];

    const outreachActivities = [
        {
            id: 1,
            title: "Science Outreach Volunteer",
            organization: "KNUST Photonics Students Chapter",
            description: "As an active volunteer, I participate in science outreach programs that promote optics and photonics through:",
            activities: [
                "Hands-on experimental demonstrations",
                "Interactive workshops for high school students",
                "STEM career guidance sessions",
            ],
            link: "https://www.linkedin.com/company/knust-photonics-chapter/",
            linkText: "Follow Us",
            images: [volunteer1, volunteer2, volunteer3, volunteer4, volunteer5]
        },
        {
            id: 2,
            title: "Volunteer at SciFest Ghana in 2024 & in 2025",
            organization: "KNUST College Of Science",
            description: "Creating the awareness of STEM in the young generation",
            activities: [
                "Hands on experiment",
                "Detailed explanation of theoretical science",
                "Mentorship programs"
            ],
            link: "https://www.linkedin.com/posts/knust-photonics-chapter_kpsc-scifest2025-steminmotion-activity-7354096052108505090-XOfF?utm_source=share&utm_medium=member_desktop&rcm=ACoAADyIPKgBngAfiikk5xQb018nn--zZ6lG7bc",
            linkText: "Join Initiative",
            images: [sci1, sci2, sci3, sci4]
        }
    ];

    return (
        <section id="about" className="py-12 mt-12 sm:py-20 lg:py-20 px-4 sm:px-6 lg:px-8-white bg-gradient-to-br from-background via-background to-muted">
            <motion.div
                className="max-w-6xl mx-auto"
            >
                {/* Timeline Section */}
                <motion.div variants={item} className="mb-12 sm:mb-16 lg:mb-20">
                    <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
                        My{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Journey
                        </span>
                    </h2>

                    <div className="relative">
                        {/* Timeline line - Hidden on mobile, visible on larger screens */}
                        <div className="hidden lg:block absolute left-1/2 w-1 shadow-lg h-full bg-gradient-to-b from-primary/30 via-secondary/30 to-primary/30 transform -translate-x-1/2 rounded-full"></div>

                        <div className="space-y-8 lg:space-y-12">
                            {timeline.map((timelineItem, index) => (
                                <motion.div
                                    className={`relative w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:ml-0 lg:pr-8' : 'lg:ml-auto lg:pl-8'}`}
                                >
                                    {/* Timeline dot */}
                                    <div
                                        className="hidden lg:block absolute top-6 w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg border-4 border-white transform -translate-x-1/2 z-10"
                                        style={{
                                            left: index % 2 === 0 ? '100%' : '0%',
                                            marginLeft: index % 2 === 0 ? '2rem' : '-2rem'
                                        }}
                                    />

                                    <motion.div
                                        className={`p-4 sm:p-6 bg-white rounded-2xl shadow-lg shadow-primary/80 hover:shadow-lg hover:shadow-secondary/70 transition-all duration-300 border border-gray-100 hover:border-primary/20 ${index % 2 === 0 ? 'lg:mr-4' : 'lg:ml-4'} relative overflow-hidden`}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                    >
                                        {/* Subtle background pattern */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -mr-10 -mt-10 opacity-50" />

                                        <div className="flex items-start relative z-10">
                                            <div className={`p-3 sm:p-4 rounded-xl ${timelineItem.type === 'work' ? 'bg-gradient-to-br from-primary to-primary/80' : 'bg-gradient-to-br from-secondary to-secondary/80'} text-white mr-3 sm:mr-4 shadow-md flex-shrink-0`}>
                                                {timelineItem.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                                                    {timelineItem.title}
                                                </h3>
                                                <p className="text-sm text-primary font-medium mb-2">
                                                    {timelineItem.company} • {timelineItem.date}
                                                </p>
                                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                                    {timelineItem.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 pt-12 mb-8 sm:mb-12">
                    Volunteer{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Activities
                    </span>
                </h2>

                {/* Outreach Activities Sections */}
                {outreachActivities.map((outreach, sectionIndex) => (
                    <motion.div key={outreach.id} variants={item} className="mb-12 sm:mb-16 lg:mb-20">
                        <motion.div
                            className="bg-white rounded-3xl shadow-lg overflow-hidden border border-secondary/50 hover:shadow-xl transition-all duration-500"
                            whileHover={{ y: -8 }}
                        >
                            <div className={`flex flex-col lg:flex-row ${sectionIndex % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                {/* Text Content */}
                                <div className="w-full lg:w-2/3 p-6 sm:p-8 lg:p-10">
                                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
                                        <div className="p-3 sm:p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl text-primary shadow-sm flex-shrink-0">
                                            <FaHandsHelping className="text-2xl sm:text-3xl" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-800 leading-tight">
                                                {outreach.title}
                                            </h3>
                                            <span className="text-base sm:text-lg text-secondary font-medium">
                                                {outreach.organization}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-primary mb-6 text-base sm:text-lg leading-relaxed">
                                        {outreach.description}
                                    </p>

                                    <ul className="list-none text-gray-600 space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-sm sm:text-base">
                                        {outreach.activities.map((activity, index) => (
                                            <motion.li
                                                key={index}
                                                className="leading-relaxed flex items-start"
                                                whileHover={{ x: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <span className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mt-2 mr-3 flex-shrink-0" />
                                                {activity}
                                            </motion.li>
                                        ))}
                                    </ul>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-block"
                                    >
                                        <a
                                            href={outreach.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-6 sm:px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
                                        >
                                            {outreach.linkText || "Learn More"}
                                        </a>
                                    </motion.div>
                                </div>

                                {/* Image Gallery */}
                                <div className="w-full lg:w-1/3 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-primary/5 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                                    {outreach.images.map((imgSrc, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                            transition={{ duration: 0.3 }}
                                            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                            <img
                                                src={imgSrc}
                                                alt={`${outreach.title} activity ${index + 1}`}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default About;
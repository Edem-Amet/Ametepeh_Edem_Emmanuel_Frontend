import { motion } from "framer-motion";
import { FaPaintBrush, FaMusic, FaCamera, FaPlay, FaPause } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

// Import your drawing images
import drawing1 from "../assets/draw1.jpg";
import drawing2 from "../assets/draw2.jpg";
// Import your music files
import gloryMusic from "../assets/Glory to the lamb.mp3.m4a";
import emmanuelMusic from "../assets/Emmanuel.mp3.m4a";

const HobbiesPage = () => {
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

    // State for image modal
    const [selectedImage, setSelectedImage] = useState(null);

    // Refs for audio elements
    const audioRefs = useRef({
        glory: null,
        emmanuel: null,
    });

    // State for tracking which audio is playing
    const [playingAudio, setPlayingAudio] = useState(null);

    // Initialize audio elements after component mounts
    useEffect(() => {
        audioRefs.current.glory = new Audio(gloryMusic);
        audioRefs.current.emmanuel = new Audio(emmanuelMusic);

        // Cleanup function to pause audio when component unmounts
        return () => {
            if (audioRefs.current.glory) audioRefs.current.glory.pause();
            if (audioRefs.current.emmanuel) audioRefs.current.emmanuel.pause();
        };
    }, []);

    const toggleMusic = (track) => {
        // Pause any currently playing audio
        if (playingAudio && audioRefs.current[playingAudio]) {
            audioRefs.current[playingAudio].pause();
        }

        if (playingAudio === track) {
            // If the same track is clicked, stop it
            setPlayingAudio(null);
        } else {
            // Play the selected track
            if (audioRefs.current[track]) {
                audioRefs.current[track].currentTime = 0;
                audioRefs.current[track].play();
                setPlayingAudio(track);
            }
        }
    };

    const hobbies = [
        {
            title: "Digital Art & Drawing",
            icon: <FaPaintBrush className="text-2xl sm:text-3xl" />,
            description: "Expressing creativity through traditional and digital mediums",
            color: "from-purple-500 to-pink-500",
            images: [
                { src: drawing1, title: "Tarzan Cartoon" },
                { src: drawing2, title: "Train Your Dragon 2" }
            ]
        },
        {
            title: "Keyboard Playing",
            icon: <FaMusic className="text-2xl sm:text-3xl" />,
            description: "Playing worship songs on the keyboard",
            color: "from-red-500 to-orange-400",
            tracks: [
                { id: "glory", title: "Glory - Ps. Benny Hinn" },
                { id: "emmanuel", title: "Emmanuel - Ps. Nathaniel Bassey" },
            ]
        },
        {
            title: "Photo & Videography",
            icon: <FaCamera className="text-2xl sm:text-3xl" />,
            description: "Capturing moments and experimenting with light",
            color: "from-yellow-500 to-amber-400"
        },
    ];

    return (
        <section id="hobbies" className="py-16 mt-8 sm:py-8 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted">
            <motion.div
                className="max-w-6xl mx-auto"
            >
                {/* Hero Section */}
                <motion.div variants={item} className="text-center mb-12 lg:mb-16">
                    <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Creative Side</span>
                    </h1>
                    <p className="text-base sm:text-md lg:text-md text-gray-600 max-w-3xl mx-auto">
                        When I'm not coding or researching, here's how I unwind and explore my creative passions
                    </p>
                </motion.div>

                {/* Hobbies Grid */}
                <motion.div variants={item} className="mb-16 lg:mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {hobbies.map((hobby, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition-all"
                            >
                                <div className={`bg-gradient-to-r ${hobby.color} h-2 w-full`}></div>
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-center mb-3 sm:mb-4">
                                        <div className={`bg-gradient-to-r ${hobby.color} text-white p-2 sm:p-3 rounded-lg mr-3 sm:mr-4`}>
                                            {hobby.icon}
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{hobby.title}</h3>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{hobby.description}</p>

                                    {/* Drawings Section */}
                                    {hobby.images && (
                                        <div className="mt-3 sm:mt-4">
                                            <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">My Drawings:</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {hobby.images.map((image, imgIndex) => (
                                                    <motion.div
                                                        key={imgIndex}
                                                        whileHover={{ scale: 1.05 }}
                                                        className="relative cursor-pointer"
                                                        onClick={() => setSelectedImage(image)}
                                                    >
                                                        <img
                                                            src={image.src}
                                                            alt={image.title}
                                                            className="w-full h-20 sm:h-24 object-cover rounded-lg"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-xs sm:text-sm font-medium px-1 text-center">{image.title}</span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Music Player */}
                                    {hobby.tracks && (
                                        <div className="mt-3 sm:mt-4">
                                            <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Keyboard Samples:</h4>
                                            <div className="space-y-2">
                                                {hobby.tracks.map((track) => (
                                                    <div key={track.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                                                        <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2">{track.title}</span>
                                                        <button
                                                            onClick={() => toggleMusic(track.id)}
                                                            className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs ${playingAudio === track.id
                                                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                                                                }`}
                                                        >
                                                            {playingAudio === track.id ?
                                                                <FaPause size={10} className="flex-shrink-0" /> :
                                                                <FaPlay size={10} className="flex-shrink-0" />
                                                            }
                                                            <span className="hidden xs:inline">{playingAudio === track.id ? "Pause" : "Play"}</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center text-primary font-medium mt-3 sm:mt-4 text-sm sm:text-base">
                                        <span>See more</span>
                                        <FiChevronRight className="ml-1" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Image Modal */}
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 mt-12 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="relative max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute right-0 text-white text-lg bg-black/50 rounded-full p-1 z-10"
                            >
                                ✕
                            </button>
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.title}
                                className="w-full max-h-[80vh] object-contain rounded-lg"
                            />
                            <div className="absolute bottom-2 left-0 right-0 text-center text-white bg-black/50 py-1 rounded-lg mx-4">
                                <p className="text-sm sm:text-base">{selectedImage.title}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
};

export default HobbiesPage;
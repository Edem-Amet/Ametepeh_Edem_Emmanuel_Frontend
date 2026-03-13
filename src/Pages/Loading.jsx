// LoadingLogo.jsx
import React from "react";
import { motion } from "framer-motion";

const LoadingLogo = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
            {/* Video animation */}
            <motion.video
                src="../assets/loading.mp4"
                autoPlay
                loop
                muted
                className="w-40 sm:w-52 md:w-64"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Optional loading text */}
            <motion.p
                className="mt-6 text-gray-700 text-sm sm:text-base font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                Loading portfolio...
            </motion.p>
        </div>
    );
};

export default LoadingLogo;
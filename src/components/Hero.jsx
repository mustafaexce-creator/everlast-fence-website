import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

import heroImage from '../assets/hero-fence.jpeg';

const Hero = () => {
    return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Premium Cedar Fence"
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl w-full mx-auto px-6 grid md:grid-cols-2">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-white space-y-6 md:pt-16"
                >
                    <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                        <span className="bg-[#007054] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck size={14} /> Licensed & Insured
                        </span>
                        <span className="bg-white/20 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-white/30">
                            5-Star Service
                        </span>
                    </motion.div>

                    <motion.p variants={fadeInUp} className="text-xl md:text-2xl font-bold text-[#d45b27] tracking-wide">
                        Fences, Porches, Decks, and Exteriors
                    </motion.p>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                        Built Strong.<br />
                        <span className="text-[#d45b27]">Styled for Life.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-lg md:text-xl text-stone-200 max-w-md font-medium leading-relaxed">
                        Western New York's premier exterior contractor. Enhance your property's security and curb appeal with solutions designed to withstand the elements.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="/contact" className="bg-[#d45b27] hover:bg-[#b84a1e] text-white px-8 py-4 rounded-md font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1 text-center">
                            Start Your Project
                        </Link>
                        <Link to="/gallery" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-md font-bold text-lg transition-all flex items-center justify-center gap-2 group text-center">
                            View Recent Work <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

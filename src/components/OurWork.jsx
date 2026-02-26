import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const CATEGORY_LABELS = {
    residential: 'Residential',
    commercial: 'Commercial',
    'decks-and-rails': 'Decks & Rails',
    concrete: 'Concrete',
    'land-clearing': 'Land Clearing',
};

const CATEGORY_ACCENTS = {
    residential: 'from-emerald-500 to-emerald-600',
    commercial: 'from-blue-500 to-blue-600',
    'decks-and-rails': 'from-purple-500 to-purple-600',
    concrete: 'from-amber-500 to-amber-600',
    'land-clearing': 'from-orange-500 to-orange-600',
};

const OurWork = () => {
    const navigate = useNavigate();
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(1);

    // Fetch 2 random images per category
    useEffect(() => {
        const fetchSlides = async () => {
            setLoading(true);
            const categories = Object.keys(CATEGORY_LABELS);
            const allSlides = [];

            for (const category of categories) {
                const { data, error } = await supabase
                    .from('gallery_images')
                    .select('*')
                    .eq('category', category)
                    .eq('visible', true);

                if (!error && data && data.length > 0) {
                    // Shuffle and pick 2
                    const shuffled = data.sort(() => Math.random() - 0.5);
                    const picked = shuffled.slice(0, 2);
                    allSlides.push(...picked);
                }
            }

            // Shuffle the final array for variety
            setSlides(allSlides.sort(() => Math.random() - 0.5));
            setLoading(false);
        };

        fetchSlides();
    }, []);

    // Get public URL
    const getImageUrl = (storagePath) => {
        const { data } = supabase.storage.from('gallery-images').getPublicUrl(storagePath);
        return data.publicUrl;
    };

    // Auto-advance
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex(prev => (prev + 1) % slides.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goTo = useCallback((index) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex]);

    const goNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex(prev => (prev + 1) % slides.length);
    }, [slides.length]);

    const goPrev = useCallback(() => {
        setDirection(-1);
        setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const currentSlide = slides[currentIndex];

    const slideVariants = {
        enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 1.05 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, scale: 0.95 }),
    };

    if (loading) {
        return (
            <section className="py-24 px-6 bg-stone-900">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="w-12 h-12 border-4 border-[#d45b27] border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            </section>
        );
    }

    if (slides.length === 0) return null;

    return (
        <section className="relative py-24 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#d45b27]/8 rounded-full blur-[120px]" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#007054]/8 rounded-full blur-[120px]" />
            </div>

            {/* Section Header */}
            <div className="relative z-10 text-center mb-16 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-[#d45b27] font-bold text-sm tracking-[0.2em] uppercase mb-3">Portfolio</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Our Work</h2>
                    <p className="text-lg text-stone-400 max-w-2xl mx-auto">
                        Browse highlights from our recent projects across Western New York
                    </p>
                    <div className="h-1 w-20 bg-gradient-to-r from-[#d45b27] to-[#b84a1f] mx-auto rounded-full mt-6" />
                </motion.div>
            </div>

            {/* Slideshow Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    {/* Main Slide */}
                    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/5">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                                className="absolute inset-0"
                            >
                                {/* Image with Ken Burns effect */}
                                <motion.img
                                    src={getImageUrl(currentSlide.storage_path)}
                                    alt={currentSlide.title || currentSlide.filename}
                                    className="w-full h-full object-cover"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: 1.08 }}
                                    transition={{ duration: 8, ease: 'linear' }}
                                />

                                {/* Cinematic overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

                                {/* Content overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            {/* Category badge */}
                                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r ${CATEGORY_ACCENTS[currentSlide.category] || 'from-stone-500 to-stone-600'} shadow-lg`}>
                                                {CATEGORY_LABELS[currentSlide.category] || currentSlide.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Arrow Controls */}
                        <button
                            onClick={goPrev}
                            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 hover:border-white/20 transition-all hover:scale-110"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <button
                            onClick={goNext}
                            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 hover:border-white/20 transition-all hover:scale-110"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>

                    {/* Dot Navigation + Progress Bar */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {slides.map((slide, idx) => (
                            <button
                                key={slide.id}
                                onClick={() => goTo(idx)}
                                className={`relative rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'w-10 h-3 bg-gradient-to-r from-[#d45b27] to-[#b84a1f] shadow-lg shadow-[#d45b27]/30'
                                    : 'w-3 h-3 bg-white/20 hover:bg-white/40'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center mt-10">
                        <motion.button
                            onClick={() => navigate('/gallery')}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#d45b27] to-[#b84a1f] text-white font-bold rounded-xl shadow-xl shadow-[#d45b27]/25 hover:shadow-2xl hover:shadow-[#d45b27]/35 transition-shadow"
                        >
                            View Full Gallery
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default OurWork;

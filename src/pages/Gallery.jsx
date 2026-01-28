import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTASection from '../components/CTASection';

// Dynamically import all gallery images
const galleryImages = import.meta.glob('../assets/gallery/*.jpeg', { eager: true });

// Convert imported modules to array of objects
// Define which image IDs belong to which category
const COMMERCIAL_IDS = [15, 21, 24, 32, 38, 47, 49, 50];
const CONCRETE_IDS = [27, 28, 29, 30, 31, 68, 82, 94];

const PORTFOLIO_ITEMS = Object.values(galleryImages).map((mod, index) => {
    const id = index + 1;

    // Assign category based on explicit ID lists
    let category;
    if (COMMERCIAL_IDS.includes(id)) {
        category = 'commercial';
    } else if (CONCRETE_IDS.includes(id)) {
        category = 'concrete';
    } else {
        category = 'residential';
    }

    // Create meaningful titles based on category
    const titles = {
        residential: ['Cedar Privacy Fence', 'Vinyl Backyard Fence', 'Decorative Picket Fence', 'Classic Wood Fencing'],
        commercial: ['Industrial Security Fence', 'Chain Link Perimeter', 'Steel Guard Rails', 'Commercial Gate System'],
        concrete: ['Stamped Concrete Patio', 'Retaining Wall', 'Concrete Walkway', 'Decorative Driveway']
    };
    const title = titles[category][id % titles[category].length];

    return {
        id: id,
        category: category,
        image: mod.default,
        title: title,
        desc: 'Professional Installation'
    };
});

const CATEGORIES = [
    { id: 'all', label: 'All Work' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'concrete', label: 'Concrete' },
];

const Gallery = () => {
    const [filter, setFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(20);

    const filteredItems = filter === 'all'
        ? PORTFOLIO_ITEMS
        : PORTFOLIO_ITEMS.filter(item => item.category === filter);

    const handleViewMore = () => {
        setVisibleCount(prev => prev + 20);
    };

    // Reset visible count when filter changes
    useEffect(() => {
        setVisibleCount(20);
    }, [filter]);

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
            <Navbar isScrolled={true} />

            {/* Gallery Header */}
            <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white pt-32 pb-20 px-6 text-center overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d45b27]/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#007054]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* Geometric grid pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}></div>

                {/* Diagonal accent lines */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#d45b27]/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-[#007054]/10 to-transparent"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Gallery</h1>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto">
                        Explore our extensive collection of premium installations.
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === cat.id
                                ? 'bg-[#d45b27] text-white shadow-lg'
                                : 'bg-white text-stone-600 hover:bg-stone-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <motion.div
                    layout
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredItems.slice(0, visibleCount).map(item => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                key={item.id}
                                className="group relative h-80 rounded-xl overflow-hidden shadow-xl cursor-pointer"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay Gradient (for subtle depth on hover, optional, or remove entirely if not wanted) */}
                                <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                {/* ID Number - Visible on Hover */}
                                <div className="absolute bottom-2 right-2 text-sm font-bold text-[#d45b27] select-none pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-2 py-1 rounded">
                                    #{item.id}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* View More Button */}
                {visibleCount < filteredItems.length && (
                    <div className="text-center mt-12">
                        <button
                            onClick={handleViewMore}
                            className="bg-white border-2 border-[#d45b27] text-[#d45b27] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#d45b27] hover:text-white transition-colors shadow-lg"
                        >
                            View More
                        </button>
                    </div>
                )}
            </div>

            <CTASection />
            <Footer />
        </div>
    );
};

export default Gallery;

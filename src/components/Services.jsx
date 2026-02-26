import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import residentialImage from '../assets/residential-cover.jpg';
import commercialImage from '../assets/commercial-cover.jpg';
import concreteImage from '../assets/concrete-cover.jpg';
import decksRailsImage from '../assets/decks-rails-cover.jpg';
import landClearingImage from '../assets/land-clearing-cover.jpg';

const SERVICES = [
    {
        id: 'residential',
        title: 'Residential',
        description: 'Privacy, picket, and ornamental fencing solutions for your home.',
        image: residentialImage,
    },
    {
        id: 'commercial',
        title: 'Commercial',
        description: 'High-security chain link, aluminum, and steel barriers for business.',
        image: commercialImage,
    },
    {
        id: 'decks-and-rails',
        title: 'Decks and Rails',
        description: 'Custom-built decks, porches, and railing systems for safety and style.',
        image: decksRailsImage,
    },
    {
        id: 'concrete',
        title: 'Concrete',
        description: 'Driveways, patios, walkways, and foundation work.',
        image: concreteImage,
    },
    {
        id: 'land-clearing',
        title: 'Land Clearing and Excavation',
        description: 'Professional land clearing, grading, and excavation services.',
        image: landClearingImage,
    },
];

const Services = () => {
    const navigate = useNavigate();

    const handleNavigate = (categoryId) => {
        navigate(`/gallery?category=${categoryId}`);
    };

    return (
        <section id="services" className="py-24 px-6 bg-stone-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-stone-900 mb-4 tracking-tight">Our Services</h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Comprehensive exterior solutions for homes and businesses across Western New York
                    </p>
                    <div className="h-1 w-20 bg-[#d45b27] mx-auto rounded-full mt-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map((service, idx) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{ y: -8 }}
                            className="group relative h-[320px] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                            onClick={() => handleNavigate(service.id)}
                        >
                            {/* Background Image or Placeholder */}
                            <div className="absolute inset-0 bg-stone-900/50 group-hover:bg-stone-900/40 transition-colors z-10"></div>
                            {service.image ? (
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#007054] to-[#004d3b] flex items-center justify-center">
                                    <span className="text-white/20 text-6xl font-black">{service.title.charAt(0)}</span>
                                </div>
                            )}

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                                <div className="bg-white/95 backdrop-blur-sm p-5 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-bold text-stone-900 mb-2">{service.title}</h3>
                                    <p className="text-stone-600 text-sm mb-3">{service.description}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNavigate(service.id);
                                        }}
                                        className="text-[#d45b27] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                                    >
                                        View Our Work <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

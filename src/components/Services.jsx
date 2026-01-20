import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import residentialImage from '../assets/residential-fence.jpeg';
import commercialImage from '../assets/commercial-fence.jpeg';
import concreteImage from '../assets/gallery/WhatsApp Image 2026-01-16 at 6.28.57 PM (1).jpeg';
import railsImage from '../assets/rails-fence.png';
import decksImage from '../assets/decks-porches.png';

const SERVICES = [
    {
        id: 'residential',
        title: 'Residential Fencing',
        description: 'Privacy, picket, and ornamental solutions for your home.',
        image: residentialImage,
    },
    {
        id: 'commercial',
        title: 'Commercial Fencing',
        description: 'High-security chain link, aluminum, and steel barriers.',
        image: commercialImage,
    },
    {
        id: 'rails',
        title: 'Rails',
        description: 'Aluminum, vinyl, and wood railings for safety and style.',
        image: railsImage,
    },
    {
        id: 'decks',
        title: 'Decks & Porches',
        description: 'Custom-built outdoor living spaces for your home.',
        image: decksImage,
    },
    {
        id: 'concrete',
        title: 'Concrete',
        description: 'Driveways, patios, walkways, and foundation work.',
        image: concreteImage,
    },
];

const Services = () => {
    const navigate = useNavigate();

    const handleNavigate = (type) => {
        navigate('/contact', { state: { service: type } });
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
                                        Get a Quote <ArrowRight size={16} />
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

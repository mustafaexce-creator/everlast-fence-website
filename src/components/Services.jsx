import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import residentialImage from '../assets/residential-fence.jpeg';
import commercialImage from '../assets/commercial-fence.jpeg';

import { useNavigate } from 'react-router-dom';

const Services = () => {
    const navigate = useNavigate();

    const handleNavigate = (type) => {
        navigate('/contact', { state: { service: type } });
    };

    return (
        <section id="services" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-stone-900 mb-4 tracking-tight">Fencing Solutions</h2>
                    <div className="h-1 w-20 bg-[#d45b27] mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Residential Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="group relative h-[500px] rounded-xl overflow-hidden shadow-2xl cursor-pointer"
                        onClick={() => handleNavigate('residential')}
                    >
                        <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors z-10"></div>
                        <img
                            src={residentialImage}
                            alt="Residential Fencing"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">Residential</h3>
                                <p className="text-stone-600 mb-4">Privacy, picket, and ornamental solutions for your home.</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigate('residential');
                                    }}
                                    className="text-[#d45b27] font-bold flex items-center gap-2 group-hover:gap-3 transition-all"
                                >
                                    Start Your Project <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Commercial Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="group relative h-[500px] rounded-xl overflow-hidden shadow-2xl cursor-pointer"
                        onClick={() => handleNavigate('commercial')}
                    >
                        <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors z-10"></div>
                        <img
                            src={commercialImage}
                            alt="Commercial Fencing"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold text-stone-900 mb-2">Commercial</h3>
                                <p className="text-stone-600 mb-4">High-security chain link, aluminum, and steel barriers.</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigate('commercial');
                                    }}
                                    className="text-[#d45b27] font-bold flex items-center gap-2 group-hover:gap-3 transition-all"
                                >
                                    Start Your Project <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Services;

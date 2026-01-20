import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

import logo from '../assets/logo.png';

const Navbar = ({ isScrolled }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    const scrollToSection = (id) => {
        if (!isHome) {
            window.location.href = `/${id}`;
            return;
        }
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-white py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-1 cursor-pointer">
                    <img src={logo} alt="Everlast Fence Logo" className="h-20 w-auto" />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 font-semibold text-stone-600">
                    <button onClick={() => scrollToSection('#services')} className="hover:text-[#d45b27] transition-colors">Services</button>

                    <Link to="/gallery" className="hover:text-[#d45b27] transition-colors">Gallery</Link>
                    <button onClick={() => scrollToSection('#reviews')} className="hover:text-[#d45b27] transition-colors">Reviews</button>
                    <Link to="/contact" className="hover:text-[#d45b27] transition-colors">Contact</Link>
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Call Now</span>
                        <span className="text-lg font-black text-stone-900 leading-none">(555) 123-4567</span>
                    </div>
                    <Link to="/contact" className="bg-[#d45b27] hover:bg-[#b84a1e] text-white px-6 py-3 rounded-md font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                        Get Free Quote <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-stone-800"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-stone-100 overflow-hidden border-t border-stone-200"
                    >
                        <div className="flex flex-col p-6 gap-4 font-bold text-lg">
                            <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>

                            <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)}>Reviews</a>
                            <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#d45b27] text-white py-3 rounded-md w-full mt-2 text-center block">
                                Get Free Quote
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

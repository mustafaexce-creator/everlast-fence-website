import { MapPin, Phone, Clock, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const COMPANY_LINKS = ['About Us', 'Our Process', 'Portfolio', 'Careers', 'Reviews'];
const SERVICE_LINKS = ['Residential Fencing', 'Commercial Fencing', 'Rails', 'Decks & Porches', 'Concrete'];

const Footer = () => {
    return (
        <footer className="bg-stone-950 text-stone-400 py-16 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

                {/* Column 1: Brand */}
                <div className="space-y-6">
                    <div className="flex items-center gap-1">
                        <img src={logo} alt="Everlast Fence Logo" className="h-20 w-auto" />
                    </div>
                    <p className="leading-relaxed">
                        Western New York's trusted provider of fencing, decks, porches, rails, and exterior solutions. Built to last, styled to impress.
                    </p>
                    <div className="flex gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center hover:bg-[#d45b27] hover:text-white transition-colors cursor-pointer">
                                <Star size={16} fill="currentColor" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Company</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/" className="hover:text-white transition-colors flex items-center gap-2">
                                <ChevronRight size={14} className="text-[#d45b27]" /> Home
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => window.location.href = '/#process'} className="hover:text-white transition-colors flex items-center gap-2">
                                <ChevronRight size={14} className="text-[#d45b27]" /> Our Process
                            </button>
                        </li>
                        <li>
                            <Link to="/gallery" className="hover:text-white transition-colors flex items-center gap-2">
                                <ChevronRight size={14} className="text-[#d45b27]" /> Gallery
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-2">
                                <ChevronRight size={14} className="text-[#d45b27]" /> Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Services */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Services</h4>
                    <ul className="space-y-4">
                        {SERVICE_LINKS.map(link => (
                            <li key={link}>
                                <button onClick={() => window.location.href = '/#services'} className="hover:text-white transition-colors flex items-center gap-2">
                                    <ChevronRight size={14} className="text-[#d45b27]" /> {link}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Contact */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Contact</h4>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="text-[#d45b27] shrink-0" />
                            <span>Western New York<br />Buffalo & Surrounding Areas</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="text-[#d45b27] shrink-0" />
                            <span className="text-white font-bold text-lg">(555) 123-4567</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <Clock className="text-[#d45b27] shrink-0" />
                            <span>Mon-Fri: 7am - 6pm<br />Sat: 8am - 2pm</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-stone-900 mt-16 pt-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Everlast Fence Co. All rights reserved. | Licensed & Insured.</p>
            </div>
        </footer>
    );
};

export default Footer;

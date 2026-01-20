import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import AboutSection from '../components/AboutSection';
import Reviews from '../components/Reviews';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const EverlastFenceLP = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll listener for glassmorphism effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-[#d45b27] selection:text-white">
            <TopBar />
            <Navbar isScrolled={isScrolled} />
            <Hero />
            <StatsBar />
            <AboutSection />
            <Reviews />
            <Services />
            <WhyChooseUs />
            <CTASection />
            <Footer />
        </div>
    );
};

export default EverlastFenceLP;

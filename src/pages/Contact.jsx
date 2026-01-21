import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    const location = useLocation();

    // Determine initial service from navigation state or default to 'residential'
    const initialService = location.state?.service && ['residential', 'commercial'].includes(location.state.service)
        ? location.state.service
        : 'residential';

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        service: initialService,
        message: ''
    });

    // Update form state if location changes (handling back/forward navigation)
    useEffect(() => {
        if (location.state?.service && ['residential', 'commercial'].includes(location.state.service)) {
            setFormState(prev => ({ ...prev, service: location.state.service }));
        }
    }, [location.state]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjK1Igqj6HYcYYBcXtNPLWweWVwBSN0A0vwoIuqQlwIVuoRjxTR42PwTfaMOCYlLvo/exec';

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            // Since no-cors doesn't return readable response, assume success
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormState({ name: '', email: '', phone: '', service: 'residential', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
            alert('There was an error sending your message. Please try again or call us directly.');
        }
    };

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
            <Navbar isScrolled={true} />

            {/* Header */}
            <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white pt-32 pb-20 px-6 text-center overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#007054]/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#d45b27]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* Geometric grid pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}></div>

                {/* Diagonal accent lines */}
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#007054]/10 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-1/4 h-1/2 bg-gradient-to-tl from-[#d45b27]/10 to-transparent"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Contact Us</h1>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto">
                        Ready to upgrade your property? Get a free quote today.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                            <p className="text-lg text-stone-600 leading-relaxed mb-8">
                                We're here to answer any questions you may have about our fencing solutions. Reach out to us and we'll respond as soon as we can.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#d45b27]/10 rounded-full text-[#d45b27]">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Phone</h3>
                                        <p className="text-stone-600">+1 (716) 335-8154</p>
                                        <p className="text-sm text-stone-500">Mon-Fri from 8am to 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#d45b27]/10 rounded-full text-[#d45b27]">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Email</h3>
                                        <p className="text-stone-600">hello@everlastfence.com</p>
                                        <p className="text-sm text-stone-500">Online support 24/7</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#d45b27]/10 rounded-full text-[#d45b27]">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Office</h3>
                                        <p className="text-stone-600">1234 Industrial Way</p>
                                        <p className="text-stone-600">Springfield, ST 62704</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-64 bg-stone-200 rounded-xl overflow-hidden grayscale">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1512345678901"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-stone-100">
                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                                <p className="text-stone-600 mb-8">
                                    Thank you for contacting us. One of our team members will get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-[#d45b27] font-bold hover:underline"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formState.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d45b27] focus:border-transparent transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-stone-700">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formState.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d45b27] focus:border-transparent transition-all"
                                            placeholder="+1 (716) 335-8154"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formState.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d45b27] focus:border-transparent transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-700">Interested In</label>
                                    <select
                                        name="service"
                                        value={formState.service}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d45b27] focus:border-transparent transition-all"
                                    >
                                        <option value="residential">Residential Fencing</option>
                                        <option value="commercial">Commercial Fencing</option>
                                        <option value="concrete">Concrete Work</option>
                                        <option value="repair">Repair / Maintenance</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-stone-700">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        value={formState.message}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d45b27] focus:border-transparent transition-all resize-none"
                                        placeholder="Tell us about your project..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#d45b27] hover:bg-[#b84a1e] text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    {!isSubmitting && <Send size={18} />}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;

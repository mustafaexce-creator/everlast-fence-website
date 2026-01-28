import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    const location = useLocation();

    // Determine initial service from navigation state or default to 'residential'
    const initialService = location.state?.service && ['residential', 'commercial'].includes(location.state.service)
        ? location.state.service
        : 'residential';

    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
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
                body: JSON.stringify({
                    name: `${formState.firstName} ${formState.lastName}`,
                    email: formState.email,
                    phone: formState.phone,
                    service: formState.service,
                    message: formState.message
                }),
            });

            // Since no-cors doesn't return readable response, assume success
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormState({ firstName: '', lastName: '', email: '', phone: '', service: 'residential', message: '' });
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
        <div className="min-h-screen bg-black font-sans text-white">
            <Navbar isScrolled={true} />

            {/* Main Content */}
            <div className="pt-24 pb-16 px-6">
                <div className="max-w-xl mx-auto">

                    {/* Elegant Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl text-center mb-12 font-serif italic text-stone-300"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                        Get a Quote
                    </motion.h1>

                    {/* BBB Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex justify-center mb-12"
                    >
                        <div className="bg-stone-900 border-2 border-stone-600 rounded-lg px-6 py-4 flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <svg viewBox="0 0 100 100" className="w-12 h-12 text-white" fill="currentColor">
                                    <path d="M50 10 C30 10 20 30 25 50 C20 70 30 90 50 90 C70 90 80 70 75 50 C80 30 70 10 50 10 Z M40 75 L40 25 L55 25 C65 25 70 35 65 45 C70 55 65 65 55 65 L50 65 L50 75 Z" />
                                    <circle cx="50" cy="20" r="5" />
                                </svg>
                                <span className="text-white font-black text-lg tracking-wider mt-1">BBB</span>
                            </div>
                            <div className="border-l-2 border-stone-600 pl-4">
                                <div className="text-white font-black text-xl tracking-wide">ACCREDITED</div>
                                <div className="text-white font-black text-xl tracking-wide">BUSINESS</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-green-900/50 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Send size={40} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Message Sent!</h3>
                            <p className="text-stone-400 mb-8">
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
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* First Name */}
                            <div className="space-y-2">
                                <label className="block text-white font-medium">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formState.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 bg-white text-black border-2 border-stone-300 rounded-lg focus:outline-none focus:border-[#d45b27] transition-all"
                                    placeholder="First Name"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label className="block text-white font-medium">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formState.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 bg-white text-black border-2 border-stone-300 rounded-lg focus:outline-none focus:border-[#d45b27] transition-all"
                                    placeholder="Last Name"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-white font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formState.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 bg-white text-black border-2 border-stone-300 rounded-lg focus:outline-none focus:border-[#d45b27] transition-all"
                                    placeholder="Email"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="block text-white font-medium">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formState.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 bg-white text-black border-2 border-stone-300 rounded-lg focus:outline-none focus:border-[#d45b27] transition-all"
                                    placeholder="Phone"
                                />
                            </div>

                            {/* Service Selection */}
                            <div className="space-y-2">
                                <label className="block text-white font-medium">Interested In</label>
                                <select
                                    name="service"
                                    value={formState.service}
                                    onChange={handleChange}
                                    className="w-full px-4 py-4 bg-white text-black border-2 border-stone-300 rounded-lg focus:outline-none focus:border-[#d45b27] transition-all"
                                >
                                    <option value="residential">Residential Fencing</option>
                                    <option value="commercial">Commercial Fencing</option>
                                    <option value="concrete">Concrete Work</option>
                                    <option value="repair">Repair / Maintenance</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="block text-white font-medium">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    value={formState.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-4 bg-white text-black border-2 border-stone-300 rounded-lg focus:outline-none focus:border-[#d45b27] transition-all resize-none"
                                    placeholder="Tell us about your project..."
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#d45b27] hover:bg-[#b84a1e] text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Sending...' : 'Get Your Free Quote'}
                                {!isSubmitting && <Send size={18} />}
                            </button>

                            {/* Trust Indicators */}
                            <p className="text-center text-stone-500 text-sm mt-4">
                                Licensed & Insured • 10 Years Experience • Free Estimates
                            </p>
                        </motion.form>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;

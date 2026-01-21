import woodTexture from '../assets/wood-texture.png';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="py-24 bg-[#d45b27] relative overflow-hidden">
            {/* Decorative Texture Overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: `url(${woodTexture})` }}
            ></div>

            <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                    Ready to transform your property?
                </h2>
                <p className="text-xl text-orange-100 mb-10 font-medium">
                    Schedule your free on-site consultation today. No pressure, just expert advice.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contact" className="bg-white text-[#d45b27] px-10 py-5 rounded-md font-bold text-xl shadow-xl hover:bg-stone-50 transition-colors inline-block">
                        Get Your Free Quote
                    </Link>
                    <a href="tel:+17163358154" className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-md font-bold text-xl hover:bg-white/10 transition-colors inline-block">
                        +1 (716) 335-8154
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CTASection;

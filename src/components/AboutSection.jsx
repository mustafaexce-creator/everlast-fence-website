import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const AboutSection = () => {
    return (
        <section className="py-20 px-6 bg-stone-100">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-6 tracking-tight">
                        Western New York's Most Trusted Exterior Contractor
                    </h2>
                    <div className="h-1 w-20 bg-[#d45b27] mx-auto rounded-full mb-8"></div>
                    <p className="text-lg text-stone-600 leading-relaxed max-w-3xl mx-auto">
                        Everlast Fence is the premier provider of fencing and exterior solutions across Western New York.
                        For over 10 years, we've built our reputation on reliability, quality craftsmanship, and
                        unwavering commitment to customer satisfaction. From residential privacy fences to commercial
                        security installations, decks, porches, rails, and concrete work—we deliver exceptional results
                        that stand the test of time. Our team of licensed professionals takes pride in transforming
                        properties throughout WNY with solutions tailored to each client's unique needs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        <div className="flex items-center gap-2 text-[#007054] font-semibold">
                            <CheckCircle size={20} /> Licensed & Insured
                        </div>
                        <div className="flex items-center gap-2 text-[#007054] font-semibold">
                            <CheckCircle size={20} /> Free Estimates
                        </div>
                        <div className="flex items-center gap-2 text-[#007054] font-semibold">
                            <CheckCircle size={20} /> Quality Materials
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;

import { Hammer, CheckCircle2 } from 'lucide-react';
import workerImage from '../assets/worker-fence.jpeg';

const FEATURES = [
    { title: "Deep Post Settings", desc: "We dig deeper than code requirements to ensure zero wobble." },
    { title: "Proprietary Concrete Mix", desc: "Our rapid-set high-PSI mix locks posts in place permanently." },
    { title: "Premium Lumber & Materials", desc: "#1 Grade Cedar and heavy-gauge steel only." },
    { title: "Transparent Pricing", desc: "No hidden fees. The quote you get is the price you pay." }
];

const WhyChooseUs = () => {
    return (
        <section id="process" className="py-24 bg-white border-t border-stone-200">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* Image Side */}
                <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#d45b27] rounded-tl-3xl z-0"></div>
                    <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-[#007054] rounded-br-3xl z-0"></div>
                    <img
                        src={workerImage}
                        alt="Everlast Crew Working"
                        className="relative z-10 rounded-lg shadow-2xl grayscale-[20%] contrast-125"
                    />
                </div>

                {/* Content Side */}
                <div>
                    <div className="inline-flex items-center gap-2 text-[#d45b27] font-bold uppercase tracking-wider mb-2">
                        <Hammer size={18} /> The Everlast Difference
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 leading-tight">
                        Quality That Stands <br /> The Test of Time.
                    </h2>
                    <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                        We don't cut corners. While others rush the job, we focus on the details that determine how long your fence will last. From the concrete mix to the fastener quality, everything is industrial grade.
                    </p>

                    <div className="space-y-6">
                        {FEATURES.map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="bg-stone-100 p-2 rounded-full h-fit mt-1">
                                    <CheckCircle2 className="text-[#007054]" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-stone-900">{item.title}</h4>
                                    <p className="text-stone-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

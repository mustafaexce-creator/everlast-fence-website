import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
    { id: 1, name: "Sarah Jenkins", text: "Absolutely stunning work! The cedar fence looks incredible and the team was so professional.", date: "2 days ago" },
    { id: 2, name: "Mike Thompson", text: "Best contractors I've hired in years. They finished the job early and cleaned up perfectly.", date: "1 week ago" },
    { id: 3, name: "David Rodriguez", text: "The commercial security fence gives us such peace of mind. Excellent quality.", date: "2 weeks ago" },
    { id: 4, name: "Emily Chen", text: "Love our new white vinyl fence. It completely transformed our backyard! Highly recommend.", date: "3 weeks ago" },
    { id: 5, name: "Robert Wilson", text: "Professional, punctual, and precise. The stamped concrete patio is a masterpiece.", date: "1 month ago" },
    { id: 6, name: "Jessica Parker", text: "Great communication from start to finish. The quote was transparent and fair.", date: "1 month ago" },
    { id: 7, name: "James Anderson", text: "These guys are wizards with wood. The craftsmanship on our privacy fence is top notch.", date: "2 months ago" },
    { id: 8, name: "Kelly Martinez", text: "Super sturdy fence. We've had two storms since installation and it hasn't budged an inch.", date: "2 months ago" },
    { id: 9, name: "Tom Baker", text: "Replaced our old chain link with a beautiful ornamental aluminum one. Looks expensive but was affordable.", date: "3 months ago" },
    { id: 10, name: "Amanda Lewis", text: "Finally a contractor who shows up when they say they will! Five stars all the way.", date: "3 months ago" },
];

const Reviews = () => {
    return (
        <section id="reviews" className="py-20 bg-stone-50 border-y border-stone-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <div className="inline-flex items-center gap-2 text-[#d45b27] font-bold uppercase tracking-wider mb-2">
                    <Star size={18} fill="currentColor" /> Testimonials
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-stone-900">
                    What Our Clients Say
                </h2>
            </div>

            {/* Marquee Container */}
            <div className="flex relative">
                <div className="flex gap-6 animate-infinite-scroll hover:pause">
                    {/* Duplicate list for infinite scroll effect */}
                    {[...REVIEWS, ...REVIEWS].map((review, idx) => (
                        <div
                            key={`${review.id}-${idx}`}
                            className="w-[350px] md:w-[450px] bg-white p-8 rounded-xl border border-stone-200 shrink-0 select-none shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex gap-1 mb-4 text-[#d45b27]">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-stone-600 text-lg mb-6 italic leading-relaxed">
                                "{review.text}"
                            </p>
                            <div className="flex justify-between items-end border-t border-stone-100 pt-4">
                                <div>
                                    <h4 className="text-stone-900 font-bold">{review.name}</h4>
                                    <span className="text-xs text-stone-500">{review.date}</span>
                                </div>
                                <Quote className="text-stone-200" size={40} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;

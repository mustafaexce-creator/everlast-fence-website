const STATS = [
    { label: "Years Experience", value: "20" },
    { label: "Customer Ratings", value: "5-Star" },
    { label: "Service Area", value: "All Over WNY" },
];

const StatsBar = () => {
    return (
        <div className="relative z-20 -mt-16 px-6">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b-4 border-[#d45b27]">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="text-center md:text-left border-r last:border-0 border-stone-200 md:pl-4">
                        <div className="text-3xl md:text-4xl font-black text-stone-900">{stat.value}</div>
                        <div className="text-sm font-semibold text-[#007054] uppercase tracking-wide mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsBar;

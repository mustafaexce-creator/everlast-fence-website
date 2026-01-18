const STATS = [
    { label: "Years Experience", value: "20+" },
    { label: "Fences Installed", value: "3,500+" },
    { label: "Google Rating", value: "4.9/5" },
    { label: "Warranty Years", value: "5-Year" },
];

const StatsBar = () => {
    return (
        <div className="relative z-20 -mt-16 px-6">
            <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-8 border-b-4 border-[#d45b27]">
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

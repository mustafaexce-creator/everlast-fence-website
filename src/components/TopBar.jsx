import { Clock, MapPin } from 'lucide-react';

const TopBar = () => {
    return (
        <div className="bg-[#007054] text-white py-2 text-xs md:text-sm font-medium tracking-wide">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <Clock size={14} /> Mon - Sat: 7am - 6pm
                    </span>
                    <span className="flex items-center gap-2 hidden md:flex">
                        <MapPin size={14} /> Serving Greater Metro Area
                    </span>
                </div>
                <div className="flex gap-6 opacity-90">
                    <a href="#" className="hover:text-[#d45b27] transition-colors">Careers</a>
                    <a href="#" className="hover:text-[#d45b27] transition-colors">Request Service</a>
                </div>
            </div>
        </div>
    );
};

export default TopBar;

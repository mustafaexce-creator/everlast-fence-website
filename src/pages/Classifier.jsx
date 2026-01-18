import { useState, useMemo } from 'react';

// Load images
const galleryImages = import.meta.glob('../assets/gallery/*.jpeg', { eager: true });

const Classifier = () => {
    // Convert to array with filenames
    const items = useMemo(() => {
        return Object.entries(galleryImages).map(([path, mod]) => {
            const filename = path.split('/').pop();
            return {
                path,
                filename,
                src: mod.default
            };
        });
    }, []);

    return (
        <div className="p-8 bg-black min-h-screen">
            <h1 className="text-white text-3xl mb-8">Image Classifier Helper</h1>
            <div className="grid grid-cols-4 gap-4">
                {items.map((item) => (
                    <div key={item.path} className="relative group border border-gray-700">
                        <img src={item.src} className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-2 opacity-100">
                            <span className="text-white text-xs break-all font-mono bg-black/80 p-1">
                                {item.filename}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Classifier;

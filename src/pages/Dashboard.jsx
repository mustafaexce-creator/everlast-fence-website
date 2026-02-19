import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import {
    Upload, Trash2, FolderOpen, Eye, EyeOff, CheckSquare, Square,
    Image as ImageIcon, LayoutDashboard, Plus, X, ChevronDown,
    Save, RefreshCw, AlertTriangle, Check, Filter, Grid3X3, List,
    ChevronRight
} from 'lucide-react';

const CATEGORIES = ['residential', 'commercial', 'concrete'];
const CATEGORY_COLORS = {
    residential: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40', solid: 'bg-emerald-500' },
    commercial: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40', solid: 'bg-blue-500' },
    concrete: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40', solid: 'bg-amber-500' },
};

const Dashboard = () => {
    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Data state
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showUploadZone, setShowUploadZone] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState(null);
    const [reassignCategory, setReassignCategory] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [previewImage, setPreviewImage] = useState(null);

    const fileInputRef = useRef(null);
    const [uploadCategory, setUploadCategory] = useState('residential');

    // Check auth on mount
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            if (session) fetchImages();
            else setLoading(false);
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            if (session) fetchImages();
        });
        return () => subscription.unsubscribe();
    }, []);

    // Toast auto-dismiss
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message, type = 'success') => setToast({ message, type });

    // Auth
    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setAuthError(error.message);
        setAuthLoading(false);
    };

    const handleSignUp = async () => {
        setAuthLoading(true);
        setAuthError('');
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setAuthError(error.message);
        else setAuthError('Check your email for a confirmation link!');
        setAuthLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setImages([]);
    };

    // Fetch images
    const fetchImages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) {
            showToast('Failed to fetch images: ' + error.message, 'error');
        } else {
            setImages(data || []);
        }
        setLoading(false);
    };

    // Get public URL for an image
    const getImageUrl = (storagePath) => {
        const { data } = supabase.storage.from('gallery-images').getPublicUrl(storagePath);
        return data.publicUrl;
    };

    // Get thumbnail URL (smaller size for grid)
    const getThumbnailUrl = (storagePath) => {
        const { data } = supabase.storage.from('gallery-images').getPublicUrl(storagePath, {
            transform: { width: 400, height: 400, resize: 'cover' }
        });
        return data.publicUrl;
    };

    // Pagination
    const ITEMS_PER_PAGE = 24;
    const [dashboardPage, setDashboardPage] = useState(1);

    // Filtered + paginated images
    const filteredImages = activeCategory === 'all'
        ? images
        : images.filter(img => img.category === activeCategory);

    const paginatedImages = filteredImages.slice(0, dashboardPage * ITEMS_PER_PAGE);
    const hasMore = paginatedImages.length < filteredImages.length;

    // Selection
    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAll = () => {
        setSelectedIds(new Set(filteredImages.map(img => img.id)));
    };

    const deselectAll = () => setSelectedIds(new Set());

    const selectedCount = selectedIds.size;

    // Bulk Category Reassign
    const handleBulkReassign = async (category) => {
        const ids = Array.from(selectedIds);
        const { error } = await supabase
            .from('gallery_images')
            .update({ category })
            .in('id', ids);

        if (error) {
            showToast('Failed to reassign: ' + error.message, 'error');
        } else {
            showToast(`Moved ${ids.length} images to ${category}`);
            setSelectedIds(new Set());
            setReassignCategory(null);
            fetchImages();
        }
    };

    // Bulk Toggle Visibility
    const handleBulkToggleVisibility = async (visible) => {
        const ids = Array.from(selectedIds);
        const { error } = await supabase
            .from('gallery_images')
            .update({ visible })
            .in('id', ids);

        if (error) {
            showToast('Failed to update visibility: ' + error.message, 'error');
        } else {
            showToast(`${visible ? 'Shown' : 'Hidden'} ${ids.length} images`);
            setSelectedIds(new Set());
            fetchImages();
        }
    };

    // Delete
    const handleDeleteSelected = async () => {
        const ids = Array.from(selectedIds);
        const toDelete = images.filter(img => ids.includes(img.id));

        // Delete from storage
        const storagePaths = toDelete.map(img => img.storage_path);
        const { error: storageError } = await supabase.storage
            .from('gallery-images')
            .remove(storagePaths);

        if (storageError) {
            showToast('Storage delete failed: ' + storageError.message, 'error');
            return;
        }

        // Delete from database
        const { error: dbError } = await supabase
            .from('gallery_images')
            .delete()
            .in('id', ids);

        if (dbError) {
            showToast('Database delete failed: ' + dbError.message, 'error');
        } else {
            showToast(`Deleted ${ids.length} images`);
            setSelectedIds(new Set());
            setConfirmModal(null);
            fetchImages();
        }
    };

    // Single image delete
    const handleDeleteSingle = async (img) => {
        const { error: storageError } = await supabase.storage
            .from('gallery-images')
            .remove([img.storage_path]);

        if (storageError) {
            showToast('Storage delete failed: ' + storageError.message, 'error');
            return;
        }

        const { error: dbError } = await supabase
            .from('gallery_images')
            .delete()
            .eq('id', img.id);

        if (dbError) {
            showToast('Delete failed: ' + dbError.message, 'error');
        } else {
            showToast('Image deleted');
            fetchImages();
        }
    };

    // Single category change
    const handleCategoryChange = async (imgId, newCategory) => {
        const { error } = await supabase
            .from('gallery_images')
            .update({ category: newCategory })
            .eq('id', imgId);

        if (error) {
            showToast('Failed to change category: ' + error.message, 'error');
        } else {
            showToast(`Moved to ${newCategory}`);
            fetchImages();
        }
    };

    // Toggle single visibility
    const handleToggleVisibility = async (img) => {
        const { error } = await supabase
            .from('gallery_images')
            .update({ visible: !img.visible })
            .eq('id', img.id);

        if (error) {
            showToast('Failed to toggle: ' + error.message, 'error');
        } else {
            fetchImages();
        }
    };

    // Upload
    const handleFiles = async (files) => {
        if (!files.length) return;
        setUploading(true);
        setUploadProgress(0);

        const category = uploadCategory;
        const totalFiles = files.length;
        let uploaded = 0;

        for (const file of files) {
            const ext = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
            const storagePath = `${category}/${fileName}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('gallery-images')
                .upload(storagePath, file);

            if (uploadError) {
                showToast(`Failed to upload ${file.name}: ${uploadError.message}`, 'error');
                continue;
            }

            // Insert db record
            const { error: dbError } = await supabase
                .from('gallery_images')
                .insert({
                    filename: file.name,
                    storage_path: storagePath,
                    category,
                    title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                    visible: true,
                    sort_order: images.length + uploaded
                });

            if (dbError) {
                showToast(`DB insert failed for ${file.name}: ${dbError.message}`, 'error');
            }

            uploaded++;
            setUploadProgress(Math.round((uploaded / totalFiles) * 100));
        }

        showToast(`Uploaded ${uploaded}/${totalFiles} images`);
        setUploading(false);
        setShowUploadZone(false);
        fetchImages();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        handleFiles(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => setDragActive(false);

    // Stats
    const stats = {
        total: images.length,
        visible: images.filter(i => i.visible).length,
        hidden: images.filter(i => !i.visible).length,
        residential: images.filter(i => i.category === 'residential').length,
        commercial: images.filter(i => i.category === 'commercial').length,
        concrete: images.filter(i => i.category === 'concrete').length,
    };

    // =================== LOGIN SCREEN =================== //
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center p-4">
                {/* Background effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#d45b27]/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#007054]/10 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#d45b27] to-[#b84a1f] rounded-2xl mb-4 shadow-lg shadow-[#d45b27]/20">
                                <LayoutDashboard className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1">Gallery Dashboard</h1>
                            <p className="text-stone-400 text-sm">Sign in to manage your gallery</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-stone-400 text-sm font-medium mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-[#d45b27]/50 focus:ring-1 focus:ring-[#d45b27]/30 transition-all"
                                    placeholder="admin@everlastfence.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-stone-400 text-sm font-medium mb-1.5">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-[#d45b27]/50 focus:ring-1 focus:ring-[#d45b27]/30 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {authError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-sm px-4 py-3 rounded-xl ${authError.includes('Check your email')
                                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                                        }`}
                                >
                                    {authError}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-gradient-to-r from-[#d45b27] to-[#b84a1f] text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#d45b27]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {authLoading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <button
                                type="button"
                                onClick={handleSignUp}
                                disabled={authLoading}
                                className="w-full bg-stone-800/50 border border-stone-700/50 text-stone-300 py-3 rounded-xl font-medium hover:bg-stone-800 transition-all disabled:opacity-50"
                            >
                                Create Account
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        );
    }

    // =================== MAIN DASHBOARD =================== //
    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className={`fixed top-6 left-1/2 z-[100] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-medium ${toast.type === 'error'
                            ? 'bg-red-500/90 backdrop-blur-sm text-white'
                            : 'bg-emerald-500/90 backdrop-blur-sm text-white'
                            }`}
                    >
                        {toast.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirm Modal */}
            <AnimatePresence>
                {confirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
                        onClick={() => setConfirmModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-stone-900 border border-stone-700/50 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{confirmModal.title}</h3>
                            </div>
                            <p className="text-stone-400 mb-6">{confirmModal.message}</p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmModal.onConfirm}
                                    className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                                >
                                    {confirmModal.confirmText || 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reassign Category Modal */}
            <AnimatePresence>
                {reassignCategory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
                        onClick={() => setReassignCategory(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-stone-900 border border-stone-700/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Move to Category</h3>
                            <div className="space-y-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleBulkReassign(cat)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:scale-[1.02] ${CATEGORY_COLORS[cat].bg} ${CATEGORY_COLORS[cat].border} ${CATEGORY_COLORS[cat].text}`}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat].solid}`} />
                                        <span className="font-bold capitalize">{cat}</span>
                                        <span className="ml-auto text-sm opacity-60">{stats[cat]} images</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setReassignCategory(null)}
                                className="mt-4 w-full px-4 py-2 rounded-xl bg-stone-800 text-stone-400 hover:bg-stone-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => setPreviewImage(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            src={getImageUrl(previewImage.storage_path)}
                            alt={previewImage.title}
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                        />
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-6 right-6 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Zone Modal */}
            <AnimatePresence>
                {showUploadZone && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
                        onClick={() => !uploading && setShowUploadZone(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-stone-900 border border-stone-700/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Upload Images</h3>
                            <p className="text-stone-400 text-sm mb-6">Drag & drop images or click to browse</p>

                            {/* Category selector for upload */}
                            <div className="mb-4">
                                <label className="block text-stone-400 text-sm font-medium mb-2">Upload to category:</label>
                                <div className="flex gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setUploadCategory(cat)}
                                            className={`flex-1 px-3 py-2 rounded-xl border text-sm font-bold capitalize transition-all ${uploadCategory === cat
                                                ? `${CATEGORY_COLORS[cat].bg} ${CATEGORY_COLORS[cat].border} ${CATEGORY_COLORS[cat].text}`
                                                : 'border-stone-700/50 text-stone-500 hover:text-stone-300'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Drop zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragActive
                                    ? 'border-[#d45b27] bg-[#d45b27]/10'
                                    : 'border-stone-700/50 hover:border-stone-500'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => handleFiles(Array.from(e.target.files))}
                                />
                                {uploading ? (
                                    <div>
                                        <RefreshCw className="w-10 h-10 text-[#d45b27] mx-auto mb-3 animate-spin" />
                                        <p className="text-white font-bold mb-2">Uploading... {uploadProgress}%</p>
                                        <div className="w-full bg-stone-800 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-[#d45b27] to-[#b84a1f] h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-stone-500 mx-auto mb-3" />
                                        <p className="text-stone-300 font-medium mb-1">Drop images here</p>
                                        <p className="text-stone-500 text-sm">JPEG, PNG, WebP supported</p>
                                    </>
                                )}
                            </div>

                            {!uploading && (
                                <button
                                    onClick={() => setShowUploadZone(false)}
                                    className="mt-4 w-full px-4 py-2 rounded-xl bg-stone-800 text-stone-400 hover:bg-stone-700 transition-colors"
                                >
                                    Close
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =================== HEADER =================== */}
            <header className="sticky top-0 z-50 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800/50">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#d45b27] to-[#b84a1f] rounded-xl flex items-center justify-center shadow-lg shadow-[#d45b27]/20">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Gallery Dashboard</h1>
                            <p className="text-xs text-stone-500">Everlast Fence & Concrete</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowUploadZone(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d45b27] to-[#b84a1f] rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#d45b27]/25 transition-all"
                        >
                            <Plus className="w-4 h-4" /> Upload
                        </button>
                        <button
                            onClick={fetchImages}
                            className="p-2 bg-stone-800/50 border border-stone-700/50 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
                            title="Refresh"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-stone-800/50 border border-stone-700/50 rounded-xl text-stone-400 text-sm font-medium hover:text-white hover:bg-stone-800 transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* =================== STATS BAR =================== */}
            <div className="max-w-[1600px] mx-auto px-6 py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Total', value: stats.total, icon: ImageIcon, color: 'from-stone-600 to-stone-700' },
                        { label: 'Visible', value: stats.visible, icon: Eye, color: 'from-emerald-600 to-emerald-700' },
                        { label: 'Hidden', value: stats.hidden, icon: EyeOff, color: 'from-stone-700 to-stone-800' },
                        { label: 'Residential', value: stats.residential, icon: FolderOpen, color: 'from-emerald-600 to-emerald-700' },
                        { label: 'Commercial', value: stats.commercial, icon: FolderOpen, color: 'from-blue-600 to-blue-700' },
                        { label: 'Concrete', value: stats.concrete, icon: FolderOpen, color: 'from-amber-600 to-amber-700' },
                    ].map(stat => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-xl p-4 flex items-center gap-3"
                        >
                            <div className={`w-9 h-9 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white leading-none">{stat.value}</p>
                                <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* =================== TOOLBAR =================== */}
            <div className="max-w-[1600px] mx-auto px-6 mb-4">
                <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-xl p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Category filter tabs */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-stone-500" />
                            <button
                                onClick={() => { setActiveCategory('all'); deselectAll(); setDashboardPage(1); }}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeCategory === 'all'
                                    ? 'bg-[#d45b27] text-white shadow-lg shadow-[#d45b27]/20'
                                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                                    }`}
                            >
                                All ({stats.total})
                            </button>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); deselectAll(); setDashboardPage(1); }}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${activeCategory === cat
                                        ? `${CATEGORY_COLORS[cat].solid} text-white shadow-lg`
                                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                                        }`}
                                >
                                    {cat} ({stats[cat]})
                                </button>
                            ))}
                        </div>

                        {/* Right side controls */}
                        <div className="flex items-center gap-3">
                            {/* View mode toggle */}
                            <div className="flex items-center bg-stone-800/50 rounded-lg border border-stone-700/30 p-0.5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-stone-700 text-white' : 'text-stone-500 hover:text-white'}`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-stone-700 text-white' : 'text-stone-500 hover:text-white'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Select all/deselect */}
                            <button
                                onClick={selectedCount === filteredImages.length ? deselectAll : selectAll}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
                            >
                                {selectedCount === filteredImages.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
                            </button>
                        </div>
                    </div>

                    {/* Bulk actions bar — appears when items selected */}
                    <AnimatePresence>
                        {selectedCount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-800/50">
                                    <span className="text-sm text-[#d45b27] font-bold mr-2">
                                        {selectedCount} image{selectedCount !== 1 ? 's' : ''} selected:
                                    </span>
                                    <button
                                        onClick={() => setReassignCategory(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all"
                                    >
                                        <FolderOpen className="w-3.5 h-3.5" /> Move Category
                                    </button>
                                    <button
                                        onClick={() => handleBulkToggleVisibility(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                                    >
                                        <Eye className="w-3.5 h-3.5" /> Show
                                    </button>
                                    <button
                                        onClick={() => handleBulkToggleVisibility(false)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-stone-500/10 border border-stone-500/30 text-stone-400 hover:bg-stone-500/20 transition-all"
                                    >
                                        <EyeOff className="w-3.5 h-3.5" /> Hide
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({
                                            title: 'Delete Selected Images?',
                                            message: `This will permanently delete ${selectedCount} image${selectedCount !== 1 ? 's' : ''} from storage. This action cannot be undone.`,
                                            confirmText: `Delete ${selectedCount} image${selectedCount !== 1 ? 's' : ''}`,
                                            onConfirm: handleDeleteSelected,
                                        })}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* =================== IMAGE GRID =================== */}
            <div className="max-w-[1600px] mx-auto px-6 pb-12">
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <RefreshCw className="w-8 h-8 text-[#d45b27] animate-spin" />
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-stone-800/50 rounded-2xl flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8 text-stone-600" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-400 mb-2">No images found</h3>
                        <p className="text-stone-500 text-sm mb-6">
                            {activeCategory === 'all'
                                ? 'Upload your first images to get started'
                                : `No images in the ${activeCategory} category`}
                        </p>
                        <button
                            onClick={() => setShowUploadZone(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d45b27] to-[#b84a1f] rounded-xl font-bold hover:shadow-lg hover:shadow-[#d45b27]/25 transition-all"
                        >
                            <Plus className="w-5 h-5" /> Upload Images
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {paginatedImages.map(img => (
                                <div
                                    key={img.id}
                                    className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedIds.has(img.id)
                                        ? 'border-[#d45b27] shadow-lg shadow-[#d45b27]/20 ring-2 ring-[#d45b27]/30'
                                        : 'border-stone-800/50 hover:border-stone-700/50'
                                        } ${!img.visible ? 'opacity-50' : ''}`}
                                >
                                    <div className="aspect-square bg-stone-800" onClick={() => setPreviewImage(img)}>
                                        <img
                                            src={getThumbnailUrl(img.storage_path)}
                                            alt={img.title || img.filename}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Select checkbox */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleSelect(img.id); }}
                                        className={`absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all z-10 ${selectedIds.has(img.id)
                                            ? 'bg-[#d45b27] text-white'
                                            : 'bg-black/40 text-white/60 opacity-0 group-hover:opacity-100 hover:bg-black/60'
                                            }`}
                                    >
                                        {selectedIds.has(img.id) ? <Check className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                    </button>

                                    {/* Category badge */}
                                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-xs font-bold uppercase ${CATEGORY_COLORS[img.category]?.bg || 'bg-stone-700/50'} ${CATEGORY_COLORS[img.category]?.text || 'text-stone-400'} backdrop-blur-sm`}>
                                        {img.category}
                                    </div>

                                    {/* Hidden badge */}
                                    {!img.visible && (
                                        <div className="absolute bottom-12 left-2 px-2 py-0.5 rounded-md text-xs font-bold bg-red-500/20 text-red-400 backdrop-blur-sm flex items-center gap-1">
                                            <EyeOff className="w-3 h-3" /> Hidden
                                        </div>
                                    )}

                                    {/* Bottom bar with actions */}
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-white/80 truncate flex-1 mr-2">{img.filename}</p>
                                            <div className="flex items-center gap-1">
                                                {/* Category quick-change */}
                                                <select
                                                    value={img.category}
                                                    onChange={(e) => { e.stopPropagation(); handleCategoryChange(img.id, e.target.value); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-stone-800/80 text-white text-xs rounded-md px-1.5 py-1 border border-stone-700/50 cursor-pointer appearance-none"
                                                >
                                                    {CATEGORIES.map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleToggleVisibility(img); }}
                                                    className="p-1.5 rounded-md bg-stone-800/80 text-stone-300 hover:text-white transition-colors"
                                                    title={img.visible ? 'Hide' : 'Show'}
                                                >
                                                    {img.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setConfirmModal({
                                                            title: 'Delete Image?',
                                                            message: `Delete "${img.filename}"? This cannot be undone.`,
                                                            confirmText: 'Delete',
                                                            onConfirm: () => { handleDeleteSingle(img); setConfirmModal(null); },
                                                        });
                                                    }}
                                                    className="p-1.5 rounded-md bg-stone-800/80 text-red-400 hover:text-red-300 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {hasMore && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => setDashboardPage(prev => prev + 1)}
                                    className="flex items-center gap-2 px-8 py-3 bg-stone-800/80 border border-stone-700/50 rounded-xl text-stone-300 font-bold hover:bg-stone-700 hover:text-white transition-all"
                                >
                                    Load More <ChevronRight className="w-4 h-4" />
                                    <span className="text-stone-500 text-sm font-normal ml-1">
                                        ({paginatedImages.length} of {filteredImages.length})
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* LIST VIEW */
                    <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800/50 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-stone-800/50 text-left">
                                    <th className="px-4 py-3 w-10">
                                        <button onClick={selectedCount === filteredImages.length ? deselectAll : selectAll}>
                                            {selectedCount === filteredImages.length
                                                ? <CheckSquare className="w-4 h-4 text-[#d45b27]" />
                                                : <Square className="w-4 h-4 text-stone-500" />
                                            }
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-xs font-bold text-stone-500 uppercase w-16">Preview</th>
                                    <th className="px-4 py-3 text-xs font-bold text-stone-500 uppercase">Filename</th>
                                    <th className="px-4 py-3 text-xs font-bold text-stone-500 uppercase">Category</th>
                                    <th className="px-4 py-3 text-xs font-bold text-stone-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-xs font-bold text-stone-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredImages.map(img => (
                                    <tr
                                        key={img.id}
                                        className={`border-b border-stone-800/30 hover:bg-stone-800/30 transition-colors ${selectedIds.has(img.id) ? 'bg-[#d45b27]/5' : ''} ${!img.visible ? 'opacity-50' : ''}`}
                                    >
                                        <td className="px-4 py-2">
                                            <button onClick={() => toggleSelect(img.id)}>
                                                {selectedIds.has(img.id)
                                                    ? <CheckSquare className="w-4 h-4 text-[#d45b27]" />
                                                    : <Square className="w-4 h-4 text-stone-600" />
                                                }
                                            </button>
                                        </td>
                                        <td className="px-4 py-2">
                                            <img
                                                src={getImageUrl(img.storage_path)}
                                                alt=""
                                                className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:scale-110 transition-transform"
                                                loading="lazy"
                                                onClick={() => setPreviewImage(img)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-sm text-stone-300 font-mono truncate max-w-[200px]">{img.filename}</td>
                                        <td className="px-4 py-2">
                                            <select
                                                value={img.category}
                                                onChange={(e) => handleCategoryChange(img.id, e.target.value)}
                                                className={`text-xs font-bold rounded-lg px-2 py-1 border cursor-pointer ${CATEGORY_COLORS[img.category]?.bg || ''} ${CATEGORY_COLORS[img.category]?.border || ''} ${CATEGORY_COLORS[img.category]?.text || ''} bg-transparent`}
                                            >
                                                {CATEGORIES.map(c => (
                                                    <option key={c} value={c} className="bg-stone-900 text-white">{c}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${img.visible ? 'text-emerald-400' : 'text-stone-500'}`}>
                                                {img.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                {img.visible ? 'Visible' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleToggleVisibility(img)}
                                                    className="p-1.5 rounded-md text-stone-500 hover:text-white hover:bg-stone-800 transition-all"
                                                >
                                                    {img.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmModal({
                                                        title: 'Delete Image?',
                                                        message: `Delete "${img.filename}"? This cannot be undone.`,
                                                        confirmText: 'Delete',
                                                        onConfirm: () => { handleDeleteSingle(img); setConfirmModal(null); },
                                                    })}
                                                    className="p-1.5 rounded-md text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Dashboard;

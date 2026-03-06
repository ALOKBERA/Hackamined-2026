import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Trash2,
    ExternalLink,
    Calendar as CalIcon,
    ChevronLeft,
    FolderOpen,
    FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import SmartImage from '../components/SmartImage';
import { getCategoryIcon } from '../utils/categoryIcons';

const CategoryView = () => {
    const { categoryName } = useParams();
    const [screenshots, setScreenshots] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchScreenshots = async () => {
        try {
            const res = await axios.get(`/api/screenshots/category/${categoryName}`);
            setScreenshots(res.data.data);
        } catch (err) {
            console.error('Fetch category error:', err);
            toast.error('Failed to load screenshots');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScreenshots();
    }, [categoryName]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record permanently? This will also remove the file from cloud storage.')) return;

        try {
            await axios.delete(`/api/screenshots/${id}`);
            setScreenshots(prev => prev.filter(s => s._id !== id));
            toast.success('Indexed item purged');
        } catch (err) {
            toast.error('Purge failed');
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-main">
            <header style={{ marginBottom: '48px' }}>
                <Link to="/dashboard" className="btn-ghost" style={{ marginLeft: '-16px', marginBottom: '24px' }}>
                    <ChevronLeft size={18} />
                    Terminal Root
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {getCategoryIcon(categoryName, 32)}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem' }}>{categoryName}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{screenshots.length} indexed items found in this segment.</p>
                    </div>
                </div>
            </header>

            <div className="premium-grid">
                <AnimatePresence>
                    {screenshots.map((item, i) => (
                        <motion.div
                            key={item._id}
                            className="snap-card"
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="snap-img-box">
                                <SmartImage
                                    src={item.driveThumbnailLink}
                                    category={item.category}
                                    alt={item.originalName}
                                    className="snap-img"
                                />
                                <button
                                    className="btn-icon"
                                    onClick={() => handleDelete(item._id)}
                                    style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#ff4d4d' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="snap-content">
                                <h3 className="snap-title" style={{ fontSize: '1rem' }}>{item.metadata?.summary}</h3>
                                <div className="snap-footer">
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <a href={item.driveViewLink} target="_blank" rel="noreferrer" className="btn-icon">
                                            <ExternalLink size={16} />
                                        </a>
                                        {item.sheetsLink && (
                                            <a href={item.sheetsLink} target="_blank" rel="noreferrer" className="btn-icon" title="View entry in Sheet">
                                                <FileText size={16} />
                                            </a>
                                        )}
                                        {item.calendarEventLink && (
                                            <a href={item.calendarEventLink} target="_blank" rel="noreferrer" className="btn-icon">
                                                <CalIcon size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {screenshots.length === 0 && (
                <div style={{ textAlign: 'center', padding: '120px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ color: 'var(--text-secondary)' }}>Segment Empty</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>No items have been assigned to this index category.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryView;

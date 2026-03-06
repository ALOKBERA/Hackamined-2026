import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Grid,
    Clock,
    ExternalLink,
    Calendar as CalIcon,
    Trash2,
    ChevronRight,
    TrendingUp,
    FileText,
    ImageIcon
} from 'lucide-react';
import UploadZone from '../components/UploadZone';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SmartImage from '../components/SmartImage';
import { getCategoryIcon } from '../utils/categoryIcons';

const ALL_CATEGORIES = [
    'Ticket', 'Wallpaper', 'LinkedIn Profile', 'LinkedIn Post', 'Social Media Post',
    'Payment', 'Sensitive Document', 'Contact', 'Mail', 'Quote',
    'WhatsApp Chat', 'Study Notes', 'Other'
];

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, byCategory: [] });
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploader, setShowUploader] = useState(false);

    // Merge backend stats with ALL_CATEGORIES to ensure all are shown
    const displayCategories = ALL_CATEGORIES.map(categoryName => {
        const stat = stats.byCategory.find(c => c.category === categoryName);
        return {
            category: categoryName,
            count: stat ? stat.count : 0
        };
    }).sort((a, b) => b.count - a.count); // Show most populated first

    const fetchData = async () => {
        // ... (rest of fetchData)
        try {
            const [statsRes, recentRes] = await Promise.all([
                axios.get('/api/screenshots/stats'),
                axios.get('/api/screenshots?limit=6')
            ]);
            setStats(statsRes.data);
            setRecent(recentRes.data.data);
        } catch (err) {
            console.error('Fetch dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onUploadSuccess = () => {
        fetchData();
        setShowUploader(false);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Synchronizing workspace...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-main">
            <header className="section-head">
                <div>
                    <h1 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>Workspace overview</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>You have <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.total}</span> snapshots indexed across the cloud.</p>
                </div>
                <button
                    className="btn-premium"
                    onClick={() => setShowUploader(!showUploader)}
                >
                    <Plus size={18} />
                    New Snapshot
                </button>
            </header>

            <AnimatePresence>
                {showUploader && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginBottom: 48 }}
                        exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <UploadZone onSuccess={onUploadSuccess} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="stats-flex">
                <div className="stat-box">
                    <div className="stat-box-label">Total Volume</div>
                    <div className="stat-box-val">{stats.total}</div>
                </div>
                {displayCategories.slice(0, 4).map((cat, i) => (
                    <div key={i} className="stat-box">
                        <div className="stat-box-label">{cat.category}</div>
                        <div className="stat-box-val">{cat.count}</div>
                    </div>
                ))}
            </div>

            <section style={{ marginBottom: '64px' }}>
                <div className="section-head">
                    <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Index Categories</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '20px' }}>
                    {displayCategories.map((cat, i) => (
                        <Link to={`/category/${encodeURIComponent(cat.category)}`} key={i}>
                            <motion.div
                                className="card-premium"
                                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}
                                whileHover={{ borderColor: 'var(--accent)', y: -4 }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--border)'
                                }}>
                                    {getCategoryIcon(cat.category, 24)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{cat.category}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.count} items organized</div>
                                </div>
                                <ChevronRight size={18} style={{ position: 'absolute', right: '20px', bottom: '20px', opacity: 0.3 }} />
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <div className="section-head">
                    <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Recent Indexes</h2>
                </div>
                <div className="premium-grid">
                    {recent.map((item, i) => (
                        <motion.div
                            key={item._id}
                            className="snap-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="snap-img-box">
                                <SmartImage
                                    src={item.driveThumbnailLink}
                                    category={item.category}
                                    alt={item.originalName}
                                    className="snap-img"
                                />
                                <div className="snap-badge">{item.category}</div>
                            </div>
                            <div className="snap-content">
                                <h3 className="snap-title">{item.metadata?.summary}</h3>
                                <div className="snap-footer">
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <a href={item.driveViewLink} target="_blank" rel="noreferrer" className="btn-icon" title="View Drive">
                                            <ExternalLink size={16} />
                                        </a>
                                        {item.calendarEventLink && (
                                            <a href={item.calendarEventLink} target="_blank" rel="noreferrer" className="btn-icon" title="Calendar">
                                                <CalIcon size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {recent.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                        <ImageIcon size={48} style={{ color: 'var(--border)', marginBottom: '16px' }} />
                        <h3 style={{ color: 'var(--text-secondary)' }}>No snapshots indexed yet</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                            Upload your first image to begin the AI classification process.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Zap,
    Shield,
    Calendar,
    ArrowRight,
    Sparkles,
    Layers,
    Search,
    CheckCircle,
    Command
} from 'lucide-react';

const Landing = () => {
    const { login } = useAuth();

    const features = [
        {
            icon: <Zap size={24} className="text-primary" />,
            title: "Real-time Intelligence",
            desc: "Advanced Groq Vision AI categorizes your visuals in milliseconds."
        },
        {
            icon: <Shield size={24} className="text-primary" />,
            title: "Privacy First",
            desc: "Secure storage within your private Google Drive infrastructure."
        },
        {
            icon: <Calendar size={24} className="text-primary" />,
            title: "Smart Scheduling",
            desc: "Automatic extraction of ticket times for instant calendar reminders."
        }
    ];

    return (
        <div className="landing-page" style={{ background: 'var(--bg-primary)' }}>
            <section className="hero">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        borderRadius: '100px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        marginBottom: '32px'
                    }}>
                        <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                        <span>Intelligence for your Screenshots</span>
                    </div>

                    <h1 className="hero-title">
                        Visualizing <br />
                        <span className="gradient-text">Efficiency.</span>
                    </h1>

                    <p className="hero-sub">
                        SnapSense AI is the premium platform for organizing your visual data. Automatically classify images, log metadata, and sync with your digital life.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn-premium" onClick={login}>
                            Get Started Free
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </section>

            <section style={{ padding: '100px 24px', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Pro-grade classification</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Automate the mundane tasks of organizing your visuals.</p>
                </div>

                <div className="premium-grid">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            className="card-premium"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div style={{ marginBottom: '24px', color: 'var(--accent)' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section style={{ padding: '100px 24px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Elevate your workflow today</h2>
                    <button className="btn-premium" onClick={login}>
                        Sign in with Google
                        <ArrowRight size={18} />
                    </button>
                    <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No credit card required. Free tier includes all core AI features.
                    </p>
                </div>
            </section>

            <footer style={{ padding: '60px 24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <Command size={20} />
                    <span style={{ fontWeight: 700 }}>SnapSense AI</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    © {new Date().getFullYear()} Precision Visual Analytics. Phase 12 Production.
                </p>
            </footer>
        </div>
    );
};

export default Landing;

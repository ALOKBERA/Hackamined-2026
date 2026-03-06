import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const FEATURES = [
    {
        icon: '🤖',
        title: 'AI Classification',
        desc: 'Powered by Groq Vision — classifies into 13 smart categories instantly',
    },
    {
        icon: '☁️',
        title: 'Google Drive Sync',
        desc: 'Every screenshot auto-organized in your Drive by category',
    },
    {
        icon: '📊',
        title: 'Sheets Logging',
        desc: 'Auto-logged to Google Sheets with summaries and metadata',
    },
    {
        icon: '📅',
        title: 'Calendar Reminders',
        desc: 'Tickets & payments automatically added to Google Calendar',
    },
]

const CATEGORIES = [
    { icon: '🎫', name: 'Ticket' },
    { icon: '🖼️', name: 'Wallpaper' },
    { icon: '💼', name: 'LinkedIn' },
    { icon: '📱', name: 'Social Media' },
    { icon: '💳', name: 'Payment' },
    { icon: '🔒', name: 'Sensitive Doc' },
    { icon: '👤', name: 'Contact' },
    { icon: '📧', name: 'Mail' },
    { icon: '💬', name: 'WhatsApp Chat' },
    { icon: '📝', name: 'Quote' },
    { icon: '📚', name: 'Study Notes' },
    { icon: '🗂️', name: 'Other' },
]

export default function Landing() {
    const { login } = useAuth()

    return (
        <div className="landing">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb hero-orb-1" />
                    <div className="hero-orb hero-orb-2" />
                    <div className="hero-orb hero-orb-3" />
                </div>
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="hero-badge">
                        <span>✨ AI-Powered</span>
                    </div>
                    <h1 className="hero-title">
                        Your Screenshots,
                        <br />
                        <span className="gradient-text">Finally Organized</span>
                    </h1>
                    <p className="hero-subtitle">
                        Drop a screenshot. Our AI classifies it instantly and syncs it to
                        your Google Drive, Sheets & Calendar — automatically.
                    </p>
                    <motion.button
                        className="btn-google"
                        onClick={login}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </motion.button>
                    <p className="hero-disclaimer">
                        🔒 We request Drive, Sheets & Calendar access to organize your screenshots
                    </p>
                </motion.div>

                {/* Floating category pills */}
                <motion.div
                    className="category-pills"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            className="category-pill"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Features */}
            <section className="features-section">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Everything automated
                </motion.h2>
                <div className="features-grid">
                    {FEATURES.map((feat, i) => (
                        <motion.div
                            key={feat.title}
                            className="feature-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -6, borderColor: 'rgba(139,92,246,0.6)' }}
                        >
                            <div className="feature-icon">{feat.icon}</div>
                            <h3>{feat.title}</h3>
                            <p>{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <motion.div
                    className="cta-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <h2>Ready to tame your screenshots?</h2>
                    <p>Sign in once. Screenshots organized forever.</p>
                    <motion.button
                        className="btn-google"
                        onClick={login}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Get Started — It's Free
                    </motion.button>
                </motion.div>
            </section>

            <footer className="footer">
                <p>© 2026 SnapSense AI · Built with 💜 for the Hackathon</p>
            </footer>
        </div>
    )
}
